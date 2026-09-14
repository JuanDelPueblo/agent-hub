{
  description = "Pueblo Hub: persistent ACP project and chat supervisor";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];
      eachSystem = nixpkgs.lib.genAttrs systems;
    in {
      packages = eachSystem (system:
        let
          pkgs = import nixpkgs { inherit system; };
          pueblo-hub-frontend = pkgs.buildNpmPackage {
            pname = "pueblo-hub-frontend";
            version = "0.2.0";
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
          pueblo-hub = pkgs.rustPlatform.buildRustPackage {
            pname = "pueblo-hub";
            version = "0.2.0";
            src = pkgs.lib.cleanSource self;
            cargoLock.lockFile = ./Cargo.lock;
            preBuild = ''
              rm -rf static/*
              cp -r ${pueblo-hub-frontend}/* static/
            '';
            nativeCheckInputs = [ pkgs.python3 pkgs.git ];
            meta = {
              description = "Persistent single-owner ACP project and chat supervisor";
              license = pkgs.lib.licenses.gpl3Only;
              mainProgram = "pueblo-hub";
            };
          };
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
    };
}
