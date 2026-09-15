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
          pueblo-hub = import ./nix/package.nix { inherit pkgs crane; };
          pueblo-hub-frontend = import ./nix/frontend.nix { inherit pkgs; };
          pueblo-hub-oci = import ./nix/oci.nix { inherit pkgs pueblo-hub; };
        in {
          inherit pueblo-hub pueblo-hub-frontend pueblo-hub-oci;
          # Compatibility attribute for existing `.#frontend` consumers.
          frontend = pueblo-hub-frontend;
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
          pueblo-hub = self.packages.${system}.pueblo-hub;
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
          pueblo-hub = {
            type = "app";
            program = pkgs.lib.getExe pueblo-hub;
          };
          default = {
            type = "app";
            program = pkgs.lib.getExe pueblo-hub;
          };
          verify = {
            type = "app";
            program = pkgs.lib.getExe verify;
          };
        });

      overlays.default = import ./nix/overlay.nix { inherit crane; };

      nixosModules.pueblo-hub = import ./nix/nixos-module.nix;
      nixosModules.default = self.nixosModules.pueblo-hub;

      checks = eachSystem (system:
        let
          pkgs = import nixpkgs { inherit system; };
          pueblo-hub = self.packages.${system}.pueblo-hub;
          pueblo-hub-oci = self.packages.${system}.pueblo-hub-oci;
          module = self.nixosModules.pueblo-hub;
          overlaid = import nixpkgs {
            inherit system;
            overlays = [ self.overlays.default ];
          };
        in {
          eval-checks = import ./nix/eval-checks.nix { inherit pkgs pueblo-hub module; };
          oci-config = import ./nix/oci-check.nix { inherit pkgs pueblo-hub pueblo-hub-oci; };
          vm-test = import ./nix/vm-test.nix { inherit pkgs pueblo-hub module; };
          overlay-provides-package = pkgs.runCommand "pueblo-hub-overlay-check" { } ''
            [ -x ${overlaid.pueblo-hub}/bin/pueblo-hub ] \
              || (echo "overlay does not provide pkgs.pueblo-hub" >&2; exit 1)
            ${overlaid.pueblo-hub}/bin/pueblo-hub --help > /dev/null
            [ "$(${overlaid.pueblo-hub}/bin/pueblo-hub --version)" = "$(${pueblo-hub}/bin/pueblo-hub --version)" ] \
              || (echo "overlay package version differs from canonical package" >&2; exit 1)
            touch $out
          '';
        });
    };
}
