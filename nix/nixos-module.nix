# First-class NixOS service for Pueblo Hub.
#
# A downstream configuration consumes Pueblo Hub without copying packaging:
#
#   imports = [ pueblo-hub.nixosModules.default ];
#   services.pueblo-hub.enable = true;
#   services.pueblo-hub.projectRoots = [ "/srv/projects" ];
#
# Optionally import `pueblo-hub.overlays.default` to get `pkgs.pueblo-hub`,
# or override `services.pueblo-hub.package` with the canonical package from
# the flake.
{ config, lib, pkgs, ... }:
let
  cfg = config.services.pueblo-hub;

  validId = id:
    builtins.match "[A-Za-z0-9_-]+" id != null && builtins.stringLength id <= 64 && id != "";

  validEnvName = name: name != "" && !(lib.hasInfix "=" name);

  # Pinned exact versions only, mirroring `ensure_pinned` in the backend.
  # npx: `name@1.2.3` (scoped `@scope/name@1.2.3` allowed).
  isPinnedNpx = spec:
    let
      m = builtins.match "^(@[^@]+/[^@]+|[^@]+)@([0-9]+\\.[0-9]+\\.[0-9]+([-+][0-9A-Za-z.-]+)*)$" spec;
    in
    m != null;

  # uvx: `name==1.2.3` or the npm `@` form the backend also accepts.
  isPinnedUvx = spec:
    let
      eq = builtins.match "^([^=]+)==?=?([^=]+)$" spec;
    in
    if eq != null then
      let version = builtins.elemAt eq 1;
      in builtins.match "^[0-9]+\\.[0-9]+\\.[0-9]+([-+][0-9A-Za-z.-]+)*$" version != null
    else
      isPinnedNpx spec;

  enabledAgents = lib.filterAttrs (_: agent: agent.enable) cfg.agents;

  agentJson = name: agent:
    let
      base = {
        display_name = agent.displayName;
        idle_timeout = agent.idleTimeout;
        usage_provider = agent.usageProvider;
        metadata = agent.metadata;
        default_permission_policy = agent.defaultPermissionPolicy;
        description = agent.description;
        pass_env = agent.passEnv;
      };
      manual = {
        command = agent.command;
        args = agent.args;
        env = agent.env;
      };
      npxLaunch = {
        command = "npx";
        args = [ "--yes" agent.npx.package ] ++ agent.npx.args;
        env = agent.npx.env;
      };
      uvxLaunch = {
        command = "uvx";
        args = [ agent.uvx.package ] ++ agent.uvx.args;
        env = agent.uvx.env;
      };
      launch =
        if agent.npx != null then npxLaunch
        else if agent.uvx != null then uvxLaunch
        else manual;
    in
    lib.filterAttrs (_: v: v != null) (base // launch);

  declarativeJson = lib.mapAttrs agentJson enabledAgents;

  declarativeFile = pkgs.writeText "pueblo-declarative-agents.json" (builtins.toJSON declarativeJson);

  argsList =
    [ "--host" cfg.host "--port" (toString cfg.port) ]
    ++ lib.optionals (cfg.publicOrigin != null) [ "--public-origin" cfg.publicOrigin ]
    ++ lib.optionals (cfg.promptTimeout != null) [ "--prompt-timeout" (toString cfg.promptTimeout) ]
    ++ lib.optionals (cfg.registryUrl != null) [ "--registry-url" cfg.registryUrl ]
    ++ [ "--data-dir" cfg.dataDir "--state-dir" cfg.stateDir "--config-dir" cfg.configDir ]
    ++ lib.optionals (cfg.logDir != null) [ "--log-dir" cfg.logDir ]
    ++ lib.optionals (cfg.worktreesDir != null) [ "--worktrees-dir" cfg.worktreesDir ]
    ++ lib.optionals (cfg.database != null) [ "--database" cfg.database ]
    ++ [ "--declarative-agents-file" declarativeFile ]
    ++ lib.concatMap (root: [ "--project-root" root ]) cfg.projectRoots;

  execStart = "${lib.getExe cfg.package} " + lib.escapeShellArgs argsList;
in
{
  options.services.pueblo-hub = {
    enable = lib.mkEnableOption "Pueblo Hub, a persistent ACP project and chat supervisor";

    package = lib.mkPackageOption pkgs "pueblo-hub" { };

    projectRoots = lib.mkOption {
      type = lib.types.listOf lib.types.str;
      default = [ ];
      description = ''
        Project-root boundaries every project path is validated against.
        The service user needs read and write access to each root.
        At least one root is required when the service is enabled.
      '';
    };

    host = lib.mkOption {
      type = lib.types.str;
      default = "127.0.0.1";
      description = "Bind address for the Pueblo Hub web server.";
    };

    port = lib.mkOption {
      type = lib.types.port;
      default = 8765;
      description = "Port for the Pueblo Hub web server.";
    };

    publicOrigin = lib.mkOption {
      type = lib.types.nullOr lib.types.str;
      default = null;
      description = "Public origin URL reported to clients, when behind a proxy.";
    };

    promptTimeout = lib.mkOption {
      type = lib.types.nullOr lib.types.ints.positive;
      default = null;
      description = ''
        Optional inactivity watchdog for prompts in seconds.
        Unset means no silence timeout.
      '';
    };

    registryUrl = lib.mkOption {
      type = lib.types.nullOr lib.types.str;
      default = null;
      description = ''
        ACP Registry document URL. Null uses the compiled default.
      '';
    };

    dataDir = lib.mkOption {
      type = lib.types.str;
      default = "/var/lib/pueblo-hub/data";
      description = "Pueblo Hub data directory (database, worktrees, registry cache).";
    };

    stateDir = lib.mkOption {
      type = lib.types.str;
      default = "/var/lib/pueblo-hub/state";
      description = "Pueblo Hub state directory.";
    };

    configDir = lib.mkOption {
      type = lib.types.str;
      default = "/var/lib/pueblo-hub/config";
      description = "Pueblo Hub configuration directory.";
    };

    logDir = lib.mkOption {
      type = lib.types.nullOr lib.types.str;
      default = null;
      description = "Pueblo Hub log directory. Null derives `stateDir/logs`.";
    };

    worktreesDir = lib.mkOption {
      type = lib.types.nullOr lib.types.str;
      default = null;
      description = ''
        Managed worktree root. Null derives it from the database location.
      '';
    };

    database = lib.mkOption {
      type = lib.types.nullOr lib.types.str;
      default = null;
      description = ''
        Explicit database file. Null derives `dataDir/pueblo-hub.sqlite3`.
      '';
    };

    user = lib.mkOption {
      type = lib.types.str;
      default = "pueblo-hub";
      description = ''
        Service user. The default `pueblo-hub` system user is created
        automatically. Any other value is assumed to exist and is never
        redefined.
      '';
    };

    group = lib.mkOption {
      type = lib.types.str;
      default = "pueblo-hub";
      description = ''
        Service group. The default `pueblo-hub` group is created
        automatically. Any other value is assumed to exist.
      '';
    };

    home = lib.mkOption {
      type = lib.types.str;
      default = "/var/lib/pueblo-hub";
      description = ''
        Stable HOME for the service user. ACP-agent authentication and
        configuration stored here survives restarts and upgrades.
      '';
    };

    runtimePackages = lib.mkOption {
      type = lib.types.listOf lib.types.package;
      default = [ pkgs.nodejs pkgs.uv ];
      description = ''
        Generic runtimes added to the service PATH for registry agents.
        `npx` comes from nodejs, `uvx` from uv. Remove one to report its
        agents deterministically unavailable. Do not add project-specific
        compiler toolchains here.
      '';
    };

    environment = lib.mkOption {
      type = lib.types.attrsOf lib.types.str;
      default = { };
      description = ''
        Non-secret environment values for the service. Never put API keys,
        tokens, or passwords here; use `environmentFiles` so secrets stay
        out of the Nix store.
      '';
    };

    environmentFiles = lib.mkOption {
      type = lib.types.listOf lib.types.str;
      default = [ ];
      description = ''
        Runtime environment files (systemd `EnvironmentFile`) for secrets.
        Declarative agents reference these values by name through `passEnv`.
      '';
    };

    agents = lib.mkOption {
      default = { };
      description = ''
        Declarative ACP agents. They feed the same catalog as all other
        sources with `AgentSource::Declarative` and stay read-only through
        the mutable web management APIs. Secrets never belong in `env`;
        name runtime variables with `passEnv` and supply values through
        `environmentFiles`.
      '';
      type = lib.types.attrsOf (lib.types.submodule ({ name, ... }: {
        options = {
          enable = lib.mkEnableOption "this declarative agent" // { default = true; };

          displayName = lib.mkOption {
            type = lib.types.nullOr lib.types.str;
            default = null;
            description = "Display name. Null defaults to the agent id.";
          };

          command = lib.mkOption {
            type = lib.types.nullOr lib.types.str;
            default = null;
            description = ''
              Launch command. May reference a Nix package output directly,
              e.g. `"\${pkgs.foo}/bin/foo"`. Exactly one of `command`,
              `npx`, and `uvx` must be set.
            '';
          };

          args = lib.mkOption {
            type = lib.types.listOf lib.types.str;
            default = [ ];
            description = "Launch arguments for a manual `command` agent.";
          };

          env = lib.mkOption {
            type = lib.types.attrsOf lib.types.str;
            default = { };
            description = ''
              Non-secret environment values baked into the launch.
              Never put secrets here; they land in the Nix store.
              Use `passEnv` plus `environmentFiles` for secrets.
            '';
          };

          passEnv = lib.mkOption {
            type = lib.types.listOf lib.types.str;
            default = [ ];
            description = ''
              Environment variable names inherited from the service process
              at session start. Values come from `environment` or
              `environmentFiles` at runtime and never enter the Nix store.
            '';
          };

          idleTimeout = lib.mkOption {
            type = lib.types.nullOr lib.types.ints.positive;
            default = null;
            description = "Idle timeout in seconds. Null uses the compiled default (900).";
          };

          usageProvider = lib.mkOption {
            type = lib.types.nullOr lib.types.str;
            default = null;
            description = "Usage provider identifier. Never inferred from the id.";
          };

          metadata = lib.mkOption {
            type = lib.types.nullOr lib.types.attrs;
            default = null;
            description = "Free-form metadata object. Pueblo Hub stores it and does not read it.";
          };

          defaultPermissionPolicy = lib.mkOption {
            type = lib.types.nullOr (lib.types.enum [ "ask" "read-only" "auto-approve" "deny-all" ]);
            default = null;
            description = "Default permission policy for new sessions.";
          };

          description = lib.mkOption {
            type = lib.types.nullOr lib.types.str;
            default = null;
            description = "Human-readable agent description.";
          };

          npx = lib.mkOption {
            type = lib.types.nullOr (lib.types.submodule {
              options = {
                package = lib.mkOption {
                  type = lib.types.str;
                  description = "Exact pinned package spec, e.g. `package-acp@1.2.3`.";
                };
                args = lib.mkOption {
                  type = lib.types.listOf lib.types.str;
                  default = [ ];
                  description = "Extra args appended after the package spec.";
                };
                env = lib.mkOption {
                  type = lib.types.attrsOf lib.types.str;
                  default = { };
                  description = "Non-secret environment for this npx agent.";
                };
              };
            });
            default = null;
            description = "Pinned npx registry-origin launch. No live registry lookup happens.";
          };

          uvx = lib.mkOption {
            type = lib.types.nullOr (lib.types.submodule {
              options = {
                package = lib.mkOption {
                  type = lib.types.str;
                  description = "Exact pinned package spec, e.g. `package==1.2.3`.";
                };
                args = lib.mkOption {
                  type = lib.types.listOf lib.types.str;
                  default = [ ];
                  description = "Extra args appended after the package spec.";
                };
                env = lib.mkOption {
                  type = lib.types.attrsOf lib.types.str;
                  default = { };
                  description = "Non-secret environment for this uvx agent.";
                };
              };
            });
            default = null;
            description = "Pinned uvx registry-origin launch. No live registry lookup happens.";
          };
        };
      }));
    };
  };

  config = lib.mkIf cfg.enable {
    assertions = [
      {
        assertion = cfg.projectRoots != [ ];
        message = "services.pueblo-hub.projectRoots needs at least one project root.";
      }
      {
        assertion = lib.all validId (builtins.attrNames enabledAgents);
        message = "A declarative agent id holds letters, digits, '-', and '_' only (max 64).";
      }
      {
        assertion = lib.all
          (name:
            let
              agent = enabledAgents.${name};
              launchCount = lib.length (lib.filter (x: x != null) [ agent.command agent.npx agent.uvx ]);
            in
            launchCount == 1)
          (builtins.attrNames enabledAgents);
        message = "Each declarative agent sets exactly one of `command`, `npx`, or `uvx`.";
      }
      {
        assertion = lib.all
          (name:
            let agent = enabledAgents.${name};
            in agent.npx == null || (agent.args == [ ] && agent.env == { } && agent.command == null))
          (builtins.attrNames enabledAgents);
        message = "An `npx` agent keeps top-level `command`/`args`/`env` empty; use `npx.args`/`npx.env`.";
      }
      {
        assertion = lib.all
          (name:
            let agent = enabledAgents.${name};
            in agent.uvx == null || (agent.args == [ ] && agent.env == { } && agent.command == null))
          (builtins.attrNames enabledAgents);
        message = "A `uvx` agent keeps top-level `command`/`args`/`env` empty; use `uvx.args`/`uvx.env`.";
      }
      {
        assertion = lib.all
          (name:
            let agent = enabledAgents.${name};
            in agent.npx == null || isPinnedNpx agent.npx.package)
          (builtins.attrNames enabledAgents);
        message = "A declarative `npx.package` pins one exact version, e.g. `pkg@1.2.3`. Floating tags are refused.";
      }
      {
        assertion = lib.all
          (name:
            let agent = enabledAgents.${name};
            in agent.uvx == null || isPinnedUvx agent.uvx.package)
          (builtins.attrNames enabledAgents);
        message = "A declarative `uvx.package` pins one exact version, e.g. `pkg==1.2.3`. Floating tags are refused.";
      }
      {
        assertion = lib.all
          (name: lib.all validEnvName enabledAgents.${name}.passEnv)
          (builtins.attrNames enabledAgents);
        message = "A declarative `passEnv` name is non-empty and holds no `=`.";
      }
    ];

    users.users = lib.mkIf (cfg.user == "pueblo-hub") {
      pueblo-hub = {
        isSystemUser = true;
        group = cfg.group;
        home = cfg.home;
        createHome = true;
        description = "Pueblo Hub service user";
      };
    };

    users.groups = lib.mkIf (cfg.group == "pueblo-hub") {
      pueblo-hub = { };
    };

    systemd.services.pueblo-hub = {
      description = "Pueblo Hub persistent ACP project and chat supervisor";
      wantedBy = [ "multi-user.target" ];
      after = [ "network.target" ];
      wants = [ "network-online.target" ];
      path = [ pkgs.bash pkgs.coreutils pkgs.git pkgs.direnv pkgs.nix pkgs.openssh ] ++ cfg.runtimePackages;
      environment = {
        HOME = cfg.home;
      } // cfg.environment;
      serviceConfig = {
        Type = "simple";
        ExecStart = execStart;
        Restart = "on-failure";
        RestartSec = "5s";
        User = cfg.user;
        Group = cfg.group;
        WorkingDirectory = cfg.home;
        StateDirectory = "pueblo-hub";
        StateDirectoryMode = "0700";
        UMask = "0077";
        KillMode = "control-group";
        KillSignal = "SIGTERM";
        TimeoutStopSec = "30s";
        EnvironmentFile = cfg.environmentFiles;
      };
    };
  };
}
