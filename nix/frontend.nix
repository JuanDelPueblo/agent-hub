# The production Angular assets embedded into the Rust binary.
# Version comes from Cargo.toml so the application has one authoritative
# version source.
{ pkgs }:
let
  version = (builtins.fromTOML (builtins.readFile ../Cargo.toml)).package.version;
in
pkgs.buildNpmPackage {
  pname = "pueblo-hub-frontend";
  inherit version;
  src = ../frontend;
  npmDepsHash = "sha256-O0SO3Lc0p7fjQ41gGqVCSP/PxqGJlqVgHq6xOL2u98M=";
  preBuild = ''
    export NG_CLI_ANALYTICS=false
  '';
  installPhase = ''
    mkdir -p $out
    cp -r dist/browser/* $out/
  '';
}
