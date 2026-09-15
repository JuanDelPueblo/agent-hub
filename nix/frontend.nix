# The production Angular assets embedded into the Rust binary.
# Version comes from Cargo.toml so the application has one authoritative
# version source.
{ pkgs }:
let
  version = (builtins.fromTOML (builtins.readFile ../Cargo.toml)).package.version;
in
pkgs.buildNpmPackage {
  pname = "batey-frontend";
  inherit version;
  src = ../frontend;
  npmDepsHash = "sha256-5d2Cc4F0UONLi0pGH44/xmKOdi7b8eiYC5bqhTb/ADg=";
  preBuild = ''
    export NG_CLI_ANALYTICS=false
  '';
  installPhase = ''
    mkdir -p $out
    cp -r dist/browser/* $out/
  '';
}
