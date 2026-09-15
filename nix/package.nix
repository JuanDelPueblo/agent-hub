# The canonical Pueblo Hub application derivation.
# Every consumer -- `nix build`, the NixOS module, and the OCI image -- uses
# this exact derivation. Version comes from Cargo.toml.
{ pkgs, crane }:
let
  version = (builtins.fromTOML (builtins.readFile ../Cargo.toml)).package.version;
  pueblo-hub-frontend = import ./frontend.nix { inherit pkgs; };
  craneLib = crane.mkLib pkgs;
  rustSrc = pkgs.lib.fileset.toSource {
    root = ../.;
    fileset = pkgs.lib.fileset.unions [
      ../Cargo.toml
      ../Cargo.lock
      ../backend/src
      ../static
    ];
  };
  commonArgs = {
    pname = "pueblo-hub";
    inherit version;
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
  passthru = {
    inherit pueblo-hub-frontend;
    inherit version;
  };
})
