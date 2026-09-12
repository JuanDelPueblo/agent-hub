{
  description = "Agent Hub: persistent CCGONEXT ACP supervisor";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];
      eachSystem = nixpkgs.lib.genAttrs systems;
    in {
      packages = eachSystem (system:
        let pkgs = import nixpkgs { inherit system; };
        in rec {
          agent-hub = pkgs.rustPlatform.buildRustPackage {
            pname = "agent-hub";
            version = "0.1.0";
            src = pkgs.lib.cleanSource self;
            cargoLock.lockFile = ./Cargo.lock;
            nativeCheckInputs = [ pkgs.python3 ];
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
