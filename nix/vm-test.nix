# Real NixOS VM test for the Pueblo Hub service.
# Boots a VM, starts the service from the canonical package, and verifies
# user/directories, host/port/roots, `/api/status`, the embedded frontend,
# clean restart, persistent state, and no orphaned processes after stop.
#
# The test imports only `nixosModules.default` and never sets
# `services.pueblo-hub.package`: the default package must resolve through the
# overlay the exported module installs itself.
{ pkgs, module }:
let
  # Minimal ACP agent: answers `initialize` and `session/new`, resumes through
  # `session/load`, then idles until killed. Enough to demand-start a real
  # supervised child process.
  fakeAcp = pkgs.writeScript "pueblo-vm-fake-acp" ''
    #!${pkgs.python3}/bin/python3
    import sys, json
    for line in sys.stdin:
        try:
            msg = json.loads(line)
        except Exception:
            continue
        method, params, id = msg.get("method"), msg.get("params", {}), msg.get("id")
        if id is None:
            continue
        if method == "initialize":
            print(json.dumps({"jsonrpc": "2.0", "id": id,
                              "result": {"protocolVersion": 1,
                                         "agentCapabilities": {"loadSession": True}}}), flush=True)
        elif method == "session/new":
            print(json.dumps({"jsonrpc": "2.0", "id": id,
                              "result": {"sessionId": "vm-test-session",
                                         "configOptions": []}}), flush=True)
        elif method == "session/load":
            print(json.dumps({"jsonrpc": "2.0", "id": id,
                              "result": {"sessionId": params.get("sessionId"),
                                         "configOptions": []}}), flush=True)
        # Anything else: stay silent and stay alive until killed.
  '';
in
pkgs.testers.runNixOSTest {
  name = "pueblo-hub-service";
  # The wrapper module installs the Pueblo overlay through `nixpkgs.overlays`,
  # exactly like a downstream configuration. Allow nodes to configure
  # `nixpkgs.*` instead of pinning them read-only.
  node.pkgsReadOnly = false;
  nodes.server = { ... }: {
    imports = [ module ];
    nix.settings.experimental-features = [ "nix-command" "flakes" ];
    services.pueblo-hub = {
      enable = true;
      projectRoots = [ "/srv/projects" ];
      host = "127.0.0.1";
      port = 8765;
      # Redirected state must work with no manual provisioning: tmpfiles
      # creates and chowns it for the service user.
      dataDir = "/srv/pueblo-data";
      agents.vmfake = {
        command = "${fakeAcp}";
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
    server.succeed("test -d /srv/pueblo-data")
    server.succeed("test -f /srv/pueblo-data/pueblo-hub.sqlite3")
    server.succeed("test \"$(stat -c %U /srv/pueblo-data)\" = pueblo-hub")

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
    server.succeed("curl -sf http://127.0.0.1:8765/api/agents | jq -e '.[] | select(.id == \"vmfake\" and .source == \"declarative\")'")

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
        -d '{"agent":"vmfake"}' | tee /tmp/chat.json
      jq -e '.id' /tmp/chat.json
    """)

    # Loading the chat config demand-starts the agent; the supervised child
    # must exist while the service runs.
    server.succeed("""
      CHAT=$(jq -r .id /tmp/chat.json)
      curl -sf "http://127.0.0.1:8765/api/chats/$CHAT/config" | jq -e .
    """)
    server.wait_until_succeeds("pgrep -f '[p]ueblo-vm-fake-acp'")

    # A restart kills the supervised child with the old control group and
    # stays healthy; no new child starts until the next demand.
    server.succeed("systemctl restart pueblo-hub.service")
    server.wait_for_unit("pueblo-hub.service")
    server.wait_for_open_port(8765)
    server.succeed("curl -sf http://127.0.0.1:8765/api/status | jq -e .")
    server.succeed("! pgrep -f '[p]ueblo-vm-fake-acp'")
    server.succeed("""
      PID=$(jq -r .id /tmp/project.json)
      curl -sf http://127.0.0.1:8765/api/projects | jq -e --arg id "$PID" '.[] | select(.id == $id)'
    """)

    # A stop shuts the agent down through the service; nothing is orphaned.
    # Start it once more first so the stop has a live child to clean up.
    server.succeed("""
      CHAT=$(jq -r .id /tmp/chat.json)
      curl -sf "http://127.0.0.1:8765/api/chats/$CHAT/config" | jq -e .
    """)
    server.wait_until_succeeds("pgrep -f '[p]ueblo-vm-fake-acp'")
    server.succeed("systemctl stop pueblo-hub.service")
    server.succeed("! pgrep -f '[p]ueblo-hub'")
    server.succeed("! pgrep -f '[p]ueblo-vm-fake-acp'")
  '';
}
