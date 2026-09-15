# Small evaluation checks for the NixOS module.
# Covers package override, custom user/group, declarative generation, and
# error cases. Runs in `nix flake check` without booting a VM.
{ pkgs, pueblo-hub, module }:
let
  lib = pkgs.lib;
  stub = { lib, ... }: {
    options.users.users = lib.mkOption {
      type = lib.types.attrsOf lib.types.anything;
      default = { };
    };
    options.users.groups = lib.mkOption {
      type = lib.types.attrsOf lib.types.anything;
      default = { };
    };
    options.systemd.services = lib.mkOption {
      type = lib.types.attrsOf lib.types.anything;
      default = { };
    };
    options.assertions = lib.mkOption {
      type = lib.types.listOf lib.types.anything;
      default = [ ];
    };
  };
  evalWith = cfg: lib.evalModules {
    modules = [ module stub { services.pueblo-hub = cfg; } ];
    specialArgs = { inherit pkgs; };
  };
  base = {
    enable = true;
    package = pueblo-hub;
    projectRoots = [ "/srv/projects" ];
  };

  customPackage = pkgs.runCommand "pueblo-hub-custom" { } "mkdir -p $out/bin; echo hi > $out/bin/pueblo-hub; chmod +x $out/bin/pueblo-hub";

  evalDefault = evalWith base;
  evalOverride = evalWith (base // { package = customPackage; });
  evalCustomUser = evalWith (base // { user = "alice"; group = "users"; });
  evalDeclarative = evalWith (base // {
    agents = {
      manual = {
        command = "${pkgs.coreutils}/bin/my-acp";
        args = [ "--stdio" ];
        env.REGION = "eu";
        passEnv = [ "PRIVATE_TOKEN" ];
        idleTimeout = 300;
        displayName = "Manual";
        usageProvider = "internal";
        metadata = { team = "platform"; };
        defaultPermissionPolicy = "read-only";
        description = "Manual agent";
      };
      pkg = {
        npx.package = "package-acp@1.2.3";
        npx.args = [ "--acp" ];
        displayName = "Package";
      };
      tool = {
        uvx.package = "tool==2.0.0";
      };
    };
  });

  # Error cases: each must trip at least one module assertion.
  evalBadLaunch = evalWith (base // {
    agents.confused = {
      command = "a";
      npx.package = "pkg@1.2.3";
    };
  });
  evalFloatingNpx = evalWith (base // {
    agents.float = { npx.package = "pkg@latest"; };
  });
  evalFloatingUvx = evalWith (base // {
    agents.float = { uvx.package = "pkg>=1.0"; };
  });
  evalNoLaunch = evalWith (base // {
    agents.empty = { };
  });

  # `lib.evalModules` collects assertions without enforcing them, so a bad
  # config is one with a false assertion entry.
  hasFailedAssertion = eval:
    lib.any (a: !a.assertion) eval.config.assertions;

  # Declarative files are store paths; read them at build time.
  declFile = evalDeclarative.config.systemd.services.pueblo-hub.serviceConfig.ExecStart;
  declFailedMessages = lib.concatStringsSep "; " (map (a: a.message)
    (lib.filter (a: !a.assertion) evalDeclarative.config.assertions));
in
pkgs.runCommand "pueblo-hub-eval-checks" {
  nativeBuildInputs = [ pkgs.jq ];
  # Force the declarative file into the closure so the script can read it.
  # The ExecStart string references it.
  execStart = declFile;
} ''
  set -euo pipefail
  fail() { echo "eval-check failed: $1" >&2; exit 1; }

  # --- Nix-eval facts baked in as strings ---
  defaultUser='${evalDefault.config.systemd.services.pueblo-hub.serviceConfig.User}'
  overrideExec='${evalOverride.config.systemd.services.pueblo-hub.serviceConfig.ExecStart}'
  customUser='${evalCustomUser.config.systemd.services.pueblo-hub.serviceConfig.User}'
  customGroup='${evalCustomUser.config.systemd.services.pueblo-hub.serviceConfig.Group}'
  hasDefaultUser=${if evalDefault.config.users.users ? pueblo-hub then "yes" else "no"}
  hasCustomUser=${if evalCustomUser.config.users.users ? pueblo-hub then "yes" else "no"}
  badIdFailed=${if (evalWith (base // { agents."bad id!" = { command = "x"; }; })).config.assertions == [] then "no" else (if hasFailedAssertion (evalWith (base // { agents."bad id!" = { command = "x"; }; })) then "yes" else "no")}
  badLaunchFailed=${if hasFailedAssertion evalBadLaunch then "yes" else "no"}
  floatingNpxFailed=${if hasFailedAssertion evalFloatingNpx then "yes" else "no"}
  floatingUvxFailed=${if hasFailedAssertion evalFloatingUvx then "yes" else "no"}
  noLaunchFailed=${if hasFailedAssertion evalNoLaunch then "yes" else "no"}
  defaultOk=${if hasFailedAssertion evalDefault then "no" else "yes"}
  declOk=${if hasFailedAssertion evalDeclarative then "no" else "yes"}
  defaultHasNode=${if builtins.elem pkgs.nodejs evalDefault.config.services.pueblo-hub.runtimePackages then "yes" else "no"}
  defaultHasUv=${if builtins.elem pkgs.uv evalDefault.config.services.pueblo-hub.runtimePackages then "yes" else "no"}

  [ "$defaultUser" = pueblo-hub ] || fail "default user is $defaultUser"
  [ "$hasDefaultUser" = yes ] || fail "default system user was not created"
  case "$overrideExec" in
    *pueblo-hub-custom*) ;;
    *) fail "package override did not reach ExecStart: $overrideExec" ;;
  esac
  [ "$customUser" = alice ] || fail "custom user is $customUser"
  [ "$customGroup" = users ] || fail "custom group is $customGroup"
  [ "$hasCustomUser" = no ] || fail "custom user unexpectedly redefined an account"
  [ "$defaultOk" = yes ] || fail "default config trips an assertion"
  [ "$defaultHasNode" = yes ] || fail "default runtimePackages lack nodejs (npx)"
  [ "$defaultHasUv" = yes ] || fail "default runtimePackages lack uv (uvx)"
  [ "$declOk" = yes ] || fail "declarative config trips an assertion: ${declFailedMessages}"
  [ "$badIdFailed" = yes ] || fail "bad agent id was accepted"
  [ "$badLaunchFailed" = yes ] || fail "command+npx was accepted"
  [ "$floatingNpxFailed" = yes ] || fail "floating npx package was accepted"
  [ "$floatingUvxFailed" = yes ] || fail "floating uvx package was accepted"
  [ "$noLaunchFailed" = yes ] || fail "agent without launch was accepted"

  # --- Declarative JSON content (build-time, reads the store file) ---
  # Extract the declarative file path from ExecStart.
  declPath=$(echo "$execStart" | grep -o '/nix/store/[^ ]*pueblo-declarative-agents.json' | head -1)
  [ -n "$declPath" ] || fail "no declarative file in ExecStart"
  [ -f "$declPath" ] || fail "declarative file $declPath missing"
  jq -e '.manual.command | contains("my-acp")' "$declPath" > /dev/null \
    || fail "manual command not in declarative file"
  jq -e '.manual.pass_env == ["PRIVATE_TOKEN"]' "$declPath" > /dev/null \
    || fail "pass_env not in declarative file"
  jq -e '.manual.env.REGION == "eu"' "$declPath" > /dev/null \
    || fail "manual env not in declarative file"
  jq -e '.pkg.command == "npx" and (.pkg.args[0] == "--yes") and (.pkg.args[1] == "package-acp@1.2.3")' "$declPath" > /dev/null \
    || fail "pinned npx launch not generated"
  jq -e '.tool.command == "uvx" and (.tool.args[0] == "tool==2.0.0")' "$declPath" > /dev/null \
    || fail "pinned uvx launch not generated"
  if grep -q PRIVATE_TOKEN_VALUE "$declPath"; then
    fail "secret value leaked into the Nix store file"
  fi

  touch $out
''
