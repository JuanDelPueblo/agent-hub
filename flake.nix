{
  description = "Pueblo Hub: persistent ACP project and chat supervisor";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.crane.url = "github:ipetkov/crane";
  inputs.crane.inputs.nixpkgs.follows = "nixpkgs";
  outputs = { self, nixpkgs, crane }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];
      eachSystem = nixpkgs.lib.genAttrs systems;
    in {
      packages = eachSystem (system:
        let
          pkgs = import nixpkgs { inherit system; };
          pueblo-hub-frontend = pkgs.buildNpmPackage {
            pname = "pueblo-hub-frontend";
            version = "0.3.0";
            src = ./frontend;
            npmDepsHash = "sha256-sfE4FiYhZL24PSU+hRlXW3ltkkXN1PM1D7Rc0aqGqHk=";
            preBuild = ''
              export NG_CLI_ANALYTICS=false
            '';
            installPhase = ''
              mkdir -p $out
              cp -r dist/browser/* $out/
            '';
          };
        in rec {
          inherit pueblo-hub-frontend;
          # Compatibility attribute for existing `.#frontend` consumers.
          frontend = pueblo-hub-frontend;
          pueblo-hub =
            let
              craneLib = crane.mkLib pkgs;
              rustSrc = pkgs.lib.fileset.toSource {
                root = ./.;
                fileset = pkgs.lib.fileset.unions [
                  ./Cargo.toml
                  ./Cargo.lock
                  ./backend/src
                  ./static
                ];
              };
              commonArgs = {
                pname = "pueblo-hub";
                version = "0.3.0";
                src = rustSrc;
                strictDeps = true;
                # Packaging builds the release artifact only. Source-level
                # verification, including the Rust test suite, lives in
                # `nix run .#verify` and CI.
                doCheck = false;
                nativeBuildInputs =
                  pkgs.lib.optionals pkgs.stdenv.hostPlatform.isLinux [ pkgs.mold ];
                RUSTFLAGS =
                  pkgs.lib.optionalString pkgs.stdenv.hostPlatform.isLinux "-C link-arg=-fuse-ld=mold";
                meta = {
                  description = "Persistent single-owner ACP project and chat supervisor";
                  license = pkgs.lib.licenses.gpl3Only;
                  mainProgram = "pueblo-hub";
                };
              };
              # Dependencies compile once from the manifest and lockfile.
              # Crate-only edits reuse these artifacts.
              cargoArtifacts = craneLib.buildDepsOnly commonArgs;
            in
            craneLib.buildPackage (commonArgs // {
              inherit cargoArtifacts;
              preBuild = ''
                rm -rf static/*
                cp -r ${pueblo-hub-frontend}/* static/
              '';
            });
          default = pueblo-hub;
        });

      devShells = eachSystem (system:
        let
          pkgs = import nixpkgs { inherit system; };
        in {
          default = pkgs.mkShell {
            name = "pueblo-hub-dev";

            packages = with pkgs; [
              # Rust toolchain
              cargo
              rustc
              clippy
              rustfmt
              rust-analyzer

              # Build speed
              mold
              sccache
              cargo-nextest
              cargo-watch

              # Frontend and fake backend
              nodejs_22

              # Integration tests and tooling
              python3
              git
              sqlite
              direnv
            ];

            # The bundled SQLite of rusqlite compiles C sources.
            nativeBuildInputs = [ pkgs.pkg-config ];

            shellHook = ''
              # Link with mold. mold is much faster than the default linker.
              # The variable is target-scoped, so it does not replace the
              # rustflags of Cargo.toml or of a later cargo invocation.
              host_triple="$(rustc -vV | sed -n 's/^host: //p')"
              flag_var="CARGO_TARGET_$(echo "$host_triple" | tr 'a-z.-' 'A-Z__')_RUSTFLAGS"
              export "$flag_var=-C link-arg=-fuse-ld=mold"

              # Keep build output out of the Nix store and out of the source tree.
              export CARGO_TARGET_DIR="''${CARGO_TARGET_DIR:-$PWD/target}"

              # sccache caches the compilation of dependencies between checkouts.
              # It turns off incremental compilation, so it stays opt-in.
              # Run `export RUSTC_WRAPPER=sccache` to enable it.

              export NG_CLI_ANALYTICS=false
              export RUST_BACKTRACE=1

              echo "pueblo-hub dev shell: $(rustc --version), node $(node --version)"
              echo "  cargo check       fast type check"
              echo "  cargo nextest run fast test run"
              echo "  npm run dev       frontend against the fake backend (in frontend/)"
            '';
          };
        });

      apps = eachSystem (system:
        let
          pkgs = import nixpkgs { inherit system; };
          verify = pkgs.writeShellApplication {
            name = "pueblo-hub-verify";
            # Every tool the verification suite needs, so `nix run .#verify`
            # works on a clean checkout without entering `nix develop`.
            runtimeInputs = with pkgs; [
              cargo
              rustc
              clippy
              rustfmt
              pkg-config
              stdenv.cc
              cargo-nextest
              nodejs_22
              python3
              git
              sqlite
              direnv
            ];
            text = builtins.readFile ./nix/verify.sh;
          };
        in {
          verify = {
            type = "app";
            program = pkgs.lib.getExe verify;
          };
        });
    };
}
