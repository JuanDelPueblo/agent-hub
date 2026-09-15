# Normal nixpkgs-style overlay. Importing it makes `pkgs.pueblo-hub`
# available using the same derivation as the canonical flake package.
# The flake passes its `crane` input; the build logic itself lives in
# `nix/package.nix`.
{ crane }:
final: prev: {
  pueblo-hub = import ./package.nix {
    pkgs = prev;
    inherit crane;
  };
  pueblo-hub-frontend = import ./frontend.nix { pkgs = prev; };
}
