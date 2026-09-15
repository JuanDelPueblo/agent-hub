# Real NixOS VM test for the Pueblo Hub service.
# Boots a VM, starts the service from the canonical package, and verifies
# user/directories, host/port/roots, `/api/status`, the embedded frontend,
# clean restart, persistent state, and no orphaned processes after stop.
{ pkgs, pueblo-hub, module }:
pkgs.testers.runNixOSTest {
  name = "pueblo-hub-service";
  nodes.server = { ... }: {
    imports = [ module ];
    nix.settings.experimental-features = [ "nix-command" "flakes" ];
    services.pueblo-hub = {
      enable = true;
      package = pueblo-hub;
      projectRoots = [ "/srv/projects" ];
      host = "127.0.0.1";
      port = 8765;
      agents.demo = {
        command = "${pkgs.coreutils}/bin/sleep";
        args = [ "3600" ];
        description = "VM test agent";
      };
    };
    environment.systemPackages = with pkgs; [ curl jq ];
    systemd.tmpfiles.rules = [
      "d /srv/projects 0755 root root"
      "d /srv/projects/demo 0755 root root"
    ];
    networking.firewall.allowedTCPPorts = [ 8765 ];
  };
  testScript = ''
    server.wait_for_unit("pueblo-hub.service")
    server.wait_for_open_port(8765)

    # Expected user and persistent directories.
    server.succeed("id pueblo-hub")
    server.succeed("test -d /var/lib/pueblo-hub")
    server.succeed("test -d /var/lib/pueblo-hub/data")
    server.succeed("test \"$(stat -c %U /var/lib/pueblo-hub)\" = pueblo-hub")

    # Workspace and registry runtimes are on the service PATH: direnv and Nix
    # for `use flake` environments, git for project work, nodejs (npx) and uv
    # (uvx) for registry agents.
    server.succeed("systemctl show pueblo-hub.service -p Environment | grep -qi direnv")
    server.succeed("systemctl show pueblo-hub.service -p Environment | grep -q 'nix-'")
    server.succeed("systemctl show pueblo-hub.service -p Environment | grep -qi git")
    server.succeed("systemctl show pueblo-hub.service -p Environment | grep -qi nodejs")
    server.succeed("systemctl show pueblo-hub.service -p Environment | grep -qi 'uv-'")

    # Configured host/port/project roots are served.
    server.succeed("curl -sf http://127.0.0.1:8765/api/status | jq -e .")
    server.succeed("curl -sf 'http://127.0.0.1:8765/api/filesystem/directories' | jq -e '.roots | index(\"/srv/projects\")'")

    # Embedded frontend response.
    server.succeed("curl -sf http://127.0.0.1:8765/ | grep -qi '<!doctype html'")

    # Declarative agent is listed as read-only declarative.
    server.succeed("curl -sf http://127.0.0.1:8765/api/agents | jq -e '.[] | select(.id == \"demo\" and .source == \"declarative\")'")

    # Create durable work, then restart and verify it survived.
    server.succeed("""
      curl -sf -X POST http://127.0.0.1:8765/api/projects \
        -H 'Content-Type: application/json' \
        -d '{"name":"demo","path":"/srv/projects/demo"}' | tee /tmp/project.json
      test \"$(jq -r .path /tmp/project.json)\" = /srv/projects/demo
    """)
    server.succeed("""
      PID=$(jq -r .id /tmp/project.json)
      curl -sf -X POST "http://127.0.0.1:8765/api/projects/$PID/chats" \
        -H 'Content-Type: application/json' \
        -d '{"agent":"demo"}' | tee /tmp/chat.json
      jq -e '.id' /tmp/chat.json
    """)
    server.succeed("test -f /var/lib/pueblo-hub/data/pueblo-hub.sqlite3")
    server.succeed("systemctl restart pueblo-hub.service")
    server.wait_for_unit("pueblo-hub.service")
    server.wait_for_open_port(8765)
    server.succeed("curl -sf http://127.0.0.1:8765/api/status | jq -e .")
    server.succeed("""
      PID=$(jq -r .id /tmp/project.json)
      curl -sf http://127.0.0.1:8765/api/projects | jq -e --arg id "$PID" '.[] | select(.id == $id)'
    """)

    # Clean stop leaves no service or agent processes behind.
    # Bracket patterns avoid matching the checking shell itself.
    server.succeed("systemctl stop pueblo-hub.service")
    server.succeed("! pgrep -f '[p]ueblo-hub'")
    server.succeed("! pgrep -f '[s]leep 3600'")
  '';
}
