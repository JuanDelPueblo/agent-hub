{
  description = "Agent Hub: persistent ACP project and chat supervisor";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];
      eachSystem = nixpkgs.lib.genAttrs systems;
    in {
      packages = eachSystem (system:
        let
          pkgs = import nixpkgs { inherit system; };
          frontend = pkgs.buildNpmPackage {
            pname = "agent-hub-frontend";
            version = "0.2.0";
            src = ./frontend;
            npmDepsHash = "sha256-Uz0McjnDAbC/0YNc8bcb4MXGnQl/tMU26xVnIz5BUDg=";
            preBuild = ''
              export NG_CLI_ANALYTICS=false
            '';
            installPhase = ''
              mkdir -p $out
              cp -r dist/browser/* $out/
            '';
          };
        in rec {
          inherit frontend;
          agent-hub = pkgs.rustPlatform.buildRustPackage {
            pname = "agent-hub";
            version = "0.2.0";
            src = pkgs.lib.cleanSource self;
            cargoLock.lockFile = ./Cargo.lock;
            preBuild = ''
              rm -rf static/*
              cp -r ${frontend}/* static/
            '';
            nativeCheckInputs = [ pkgs.python3 pkgs.git ];
            meta = {
              description = "Persistent single-owner ACP project and chat supervisor";
              license = pkgs.lib.licenses.gpl3Only;
              mainProgram = "agent-hub";
            };
          };
          default = agent-hub;
        });
    };
}
