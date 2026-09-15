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
  npmDepsHash = "sha256-GYGyh6hphURRcrUlhpmQs4LZnyz40MoFtf2q701/uLM=";
  preBuild = ''
    export NG_CLI_ANALYTICS=false
  '';
  installPhase = ''
    mkdir -p $out
    cp -r dist/browser/* $out/
  '';
}
