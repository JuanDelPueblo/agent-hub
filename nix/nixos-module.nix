# First-class NixOS service for Batey.
#
# A downstream configuration consumes Batey without copying packaging:
#
#   imports = [ batey.nixosModules.default ];
#   services.batey.enable = true;
#   services.batey.projectRoots = [ "/srv/projects" ];
#
# The exported flake module supplies `bateyPackage`, so this module does not
# depend on a package overlay. `services.batey.package` remains overridable.
{ config, lib, pkgs, bateyPackage, ... }:
let
  cfg = config.services.batey;

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

  declarativeFile = pkgs.writeText "batey-declarative-agents.json" (builtins.toJSON declarativeJson);

  # Every name Batey must treat as a secret: all passEnv names of declared
  # agents plus the explicit redaction list. Only names travel on the command
  # line; values stay in runtime environment files.
  secretVars = lib.unique
    (lib.concatMap (agent: agent.passEnv) (builtins.attrValues cfg.agents)
      ++ cfg.secretEnvVars);

  # State Batey owns. Each directory is created and chowned through
  # tmpfiles, so overrides such as `dataDir = "/srv/batey-data"` work
  # without manual mkdir/chown. The database contributes its parent
  # directory. HOME is covered when the module manages the account; an
  # explicitly selected existing account keeps its own home.
  managedDirs =
    [ cfg.dataDir cfg.stateDir cfg.configDir ]
    ++ lib.optionals (cfg.logDir != null) [ cfg.logDir ]
    ++ lib.optionals (cfg.worktreesDir != null) [ cfg.worktreesDir ]
    ++ lib.optionals (cfg.database != null) [ (builtins.dirOf cfg.database) ]
    ++ lib.optionals (cfg.user == "batey" && cfg.home != "/var/lib/batey") [ cfg.home ];

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
    ++ lib.optionals (secretVars != [ ]) [ "--secret-env-vars" (lib.concatStringsSep "," secretVars) ]
    ++ lib.concatMap (root: [ "--project-root" root ]) cfg.projectRoots;

  execStart = "${lib.getExe cfg.package} " + lib.escapeShellArgs argsList;
in
{
  options.services.batey = {
    enable = lib.mkEnableOption "Batey, a persistent ACP project and chat supervisor";

    package = lib.mkOption {
      type = lib.types.package;
      default = bateyPackage;
      description = "Batey package to run.";
    };

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
      description = "Bind address for the Batey web server.";
    };

    port = lib.mkOption {
      type = lib.types.port;
      default = 8765;
      description = "Port for the Batey web server.";
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
      default = "/var/lib/batey/data";
      description = ''
        Batey data directory (database, worktrees, registry cache).
        Created and chowned to the service user automatically, so overrides
        such as `/srv/batey-data` need no manual setup.
      '';
    };

    stateDir = lib.mkOption {
      type = lib.types.str;
      default = "/var/lib/batey/state";
      description = ''
        Batey state directory. Created and chowned automatically.
      '';
    };

    configDir = lib.mkOption {
      type = lib.types.str;
      default = "/var/lib/batey/config";
      description = ''
        Batey configuration directory. Created and chowned automatically.
      '';
    };

    logDir = lib.mkOption {
      type = lib.types.nullOr lib.types.str;
      default = null;
      description = ''
        Batey log directory. Null derives `stateDir/logs`.
        A set value is created and chowned automatically.
      '';
    };

    worktreesDir = lib.mkOption {
      type = lib.types.nullOr lib.types.str;
      default = null;
      description = ''
        Managed worktree root. Null derives it from the database location.
        A set value is created and chowned automatically.
      '';
    };

    database = lib.mkOption {
      type = lib.types.nullOr lib.types.str;
      default = null;
      description = ''
        Explicit database file. Null derives `dataDir/batey.sqlite3`.
      '';
    };

    user = lib.mkOption {
      type = lib.types.str;
      default = "batey";
      description = ''
        Service user. The default `batey` system user is created
        automatically. Any other value is assumed to exist and is never
        redefined.
      '';
    };

    group = lib.mkOption {
      type = lib.types.str;
      default = "batey";
      description = ''
        Service group. The default `batey` group is created
        automatically. Any other value is assumed to exist.
      '';
    };

    home = lib.mkOption {
      type = lib.types.str;
      default = "/var/lib/batey";
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
        At startup Batey moves every `passEnv` and `secretEnvVars` name out
        of its own environment into a stash, so the inherited workspace
        environment every agent shares never carries them. Each value is then
        injected only into the agents naming it. An agent that names nothing
        receives no secret.
      '';
    };

    secretEnvVars = lib.mkOption {
      type = lib.types.listOf lib.types.str;
      default = [ ];
      description = ''
        Extra environment variable names treated as secrets. They are
        stripped from the inherited workspace environment even when no
        declarative agent references them, and never injected anywhere.
        Useful for secrets present in `environmentFiles` that no agent
        should receive.
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
              Environment variable names injected into this agent at session
              start. Values come from `environment` or `environmentFiles` at
              runtime and never enter the Nix store. Batey removes these
              names from the shared inherited environment first, so this
              agent receives exactly the names it lists and no other agent's
              secrets.
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
            description = "Free-form metadata object. Batey stores it and does not read it.";
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
        message = "services.batey.projectRoots needs at least one project root.";
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

    users.users = lib.mkIf (cfg.user == "batey") {
      batey = {
        isSystemUser = true;
        group = cfg.group;
        home = cfg.home;
        createHome = true;
        description = "Batey service user";
      };
    };

    users.groups = lib.mkIf (cfg.group == "batey") {
      batey = { };
    };

    # Batey-owned state directories, including any operator overrides.
    # systemd-tmpfiles creates and chowns them before the service starts, so
    # a redirected `dataDir` works with no manual provisioning. Project roots
    # are deliberately excluded: they hold user data the service must not own.
    systemd.tmpfiles.rules = map
      (dir: "d ${dir} 0750 ${cfg.user} ${cfg.group} -")
      managedDirs;

    systemd.services.batey = {
      description = "Batey persistent ACP project and chat supervisor";
      wantedBy = [ "multi-user.target" ];
      after = [ "network.target" ];
      wants = [ "network-online.target" ];
      path = [ pkgs.bash pkgs.coreutils pkgs.git pkgs.direnv pkgs.nix pkgs.openssh ] ++ cfg.runtimePackages;
      environment = {
        HOME = cfg.home;
        # Enable `nix-command` and `flakes` for the service environment only,
        # so `use flake` workspace environments resolve with no system-wide
        # Nix settings. Override `environment.NIX_CONFIG` to take full
        # control (keep the experimental-features line to keep `use flake`).
        NIX_CONFIG = "experimental-features = nix-command flakes";
      } // cfg.environment;
      serviceConfig = {
        Type = "simple";
        ExecStart = execStart;
        Restart = "on-failure";
        RestartSec = "5s";
        User = cfg.user;
        Group = cfg.group;
        WorkingDirectory = cfg.home;
        StateDirectory = "batey";
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
