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
  npmDepsHash = "sha256-sfE4FiYhZL24PSU+hRlXW3ltkkXN1PM1D7Rc0aqGqHk=";
  preBuild = ''
    export NG_CLI_ANALYTICS=false
  '';
  installPhase = ''
    mkdir -p $out
    cp -r dist/browser/* $out/
  '';
}
