# Real NixOS VM test for the Pueblo Hub service.
# Boots a VM, starts the service from the canonical package, and verifies
# user/directories, host/port/roots, `/api/status`, the embedded frontend,
# clean restart, persistent state, and no orphaned processes after stop.
#
# The test imports only `nixosModules.default` and never sets
# `services.pueblo-hub.package`: the default package must resolve through the
# overlay the exported module installs itself. It deliberately sets no
# system-wide Nix flakes options: the service must enable them for itself,
# and a real `use flake` workspace below proves it.
{ pkgs, module }:
let
  # Minimal ACP agent: answers `initialize`, `session/new`, and
  # `session/load`, then idles until killed. Enough to demand-start a real
  # supervised child.
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
  # A minimal `use flake` workspace. Its development shell is a plain Nix
  # derivation, keeping this proof independent of network and nixpkgs input
  # availability in the small test VM.
  flakeProj = pkgs.runCommand "pueblo-vm-flake-proj" { } ''
    mkdir -p $out
    # The system is baked in host-side: the guest nix no longer provides
    # `builtins.currentSystem`.
    cat > $out/flake.nix <<'FLAKE_EOF'
    {
      outputs = { self }: {
        devShells.${pkgs.system}.default = derivation {
          name = "pueblo-vm-flake-shell";
          system = "${pkgs.system}";
          builder = builtins.storePath "@PUEBLO_VM_BASH@";
          args = [ "-c" ": > \"$out\"" ];
          PUEBLO_VM_FLAKE_VAR = "flake-env-ok";
        };
      };
    }
FLAKE_EOF
    printf 'use flake --impure\n' > $out/.envrc
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
    environment.systemPackages = with pkgs; [ curl jq git ];
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

    # The service enables flakes for itself; the host sets no global Nix
    # experimental features.
    server.succeed("systemctl show pueblo-hub.service -p Environment | grep -q 'NIX_CONFIG=.*nix-command flakes'")

    # Configured host/port/project roots are served.
    server.succeed("curl -sf http://127.0.0.1:8765/api/status | jq -e .")
    server.succeed("curl -sf 'http://127.0.0.1:8765/api/filesystem/directories' | jq -e '.roots | index(\"/srv/projects\")'")

    # Embedded frontend response.
    server.succeed("curl -sf http://127.0.0.1:8765/ -o /tmp/index.html; grep -qi '<!doctype html' /tmp/index.html || { echo \"BODY-BYTES=$(wc -c < /tmp/index.html)\"; head -c 500 /tmp/index.html; echo; false; }")

    # Declarative agent is listed as read-only declarative.
    server.succeed("curl -sf http://127.0.0.1:8765/api/agents | jq -e '.[] | select(.id == \"vmfake\" and .source == \"declarative\")'")

    # A durable plain project and chat for the restart-persistence check.
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

    # A minimal `use flake` workspace from the Nix-generated fixture. Bare
    # `use flake` resolves the enclosing git checkout, so the fixture is
    # committed like a real project. Files copied out of the read-only store
    # arrive without owner-write permission (which root operations silently
    # bypass), so the tree is explicitly made writable before handing it to
    # the service user, who writes direnv state beside the flake.
    server.succeed("cp -r ${flakeProj}/. /srv/projects/flake-proj/ && cd /srv/projects/flake-proj && BASH_PATH=$(readlink -f \"$(command -v bash)\") && sed -i \"s|@PUEBLO_VM_BASH@|$BASH_PATH|\" flake.nix && git init -q -b main . && git add -A && git -c user.email=vm@test -c user.name=vm commit -qm init && git log --oneline | head -1 && cd / && chown -R pueblo-hub:pueblo-hub /srv/projects/flake-proj && chmod -R u+rwX /srv/projects/flake-proj && stat -c '%U:%G %a %n' /srv/projects/flake-proj && cat /srv/projects/flake-proj/flake.nix /srv/projects/flake-proj/.envrc")
    server.succeed("""
      curl -sf -X POST http://127.0.0.1:8765/api/projects \
        -H 'Content-Type: application/json' \
        -d '{"name":"flake-proj","path":"/srv/projects/flake-proj"}' | tee /tmp/flake-project.json
    """)
    server.succeed("""
      PID=$(jq -r .id /tmp/flake-project.json)
      curl -sf -X POST "http://127.0.0.1:8765/api/projects/$PID/chats" \
        -H 'Content-Type: application/json' \
        -d '{"agent":"vmfake","workspace":{"mode":"project_checkout","branch":"main"}}' | tee /tmp/flake-chat.json
      jq -e '.id' /tmp/flake-chat.json
    """)

    # The untrusted `.envrc` is reported, never auto-authorized.
    server.succeed("""
      FCHAT=$(jq -r .id /tmp/flake-chat.json)
      CODE=$(curl -s -o /tmp/flake-config.json -w "%{http_code}" http://127.0.0.1:8765/api/chats/$FCHAT/config)
      echo "config code=$CODE body=$(cat /tmp/flake-config.json)"
      test "$CODE" = 409
    """)

    # Authorizing through Pueblo runs `direnv allow` on the verified path and
    # resumes the session; the supervised child starts with the resolved
    # flake environment.
    server.succeed("""
      FCHAT=$(jq -r .id /tmp/flake-chat.json)
      CODE=$(curl -s -o /tmp/flake-authorize.json -w "%{http_code}" -X POST http://127.0.0.1:8765/api/chats/$FCHAT/environment/authorize)
      test "$CODE" = 200 || { cat /tmp/flake-authorize.json; false; }
      jq -e . /tmp/flake-authorize.json
    """)
    server.wait_until_succeeds("pgrep -f '[p]ueblo-vm-fake-acp'")

    # A restart kills the supervised child with the old control group and
    # stays healthy; durable work survives.
    server.succeed("systemctl restart pueblo-hub.service")
    server.wait_for_unit("pueblo-hub.service")
    server.wait_for_open_port(8765)
    server.succeed("curl -sf http://127.0.0.1:8765/api/status | jq -e .")
    server.succeed("! pgrep -f '[p]ueblo-vm-fake-acp'")
    server.succeed("""
      PID=$(jq -r .id /tmp/project.json)
      curl -sf http://127.0.0.1:8765/api/projects | jq -e --arg id "$PID" '.[] | select(.id == $id)'
    """)

    # Resuming the flake chat after the restart re-resolves the authorized
    # environment and starts a fresh child; stopping then cleans everything.
    server.succeed("""
      FCHAT=$(jq -r .id /tmp/flake-chat.json)
      curl -sf "http://127.0.0.1:8765/api/chats/$FCHAT/config" | jq -e .
    """)
    server.wait_until_succeeds("pgrep -f '[p]ueblo-vm-fake-acp'")
    server.succeed("systemctl stop pueblo-hub.service")
    server.succeed("! pgrep -f '[p]ueblo-hub'")
    server.succeed("! pgrep -f '[p]ueblo-vm-fake-acp'")
  '';
}
