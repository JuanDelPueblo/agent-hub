# Normal nixpkgs-style overlay. Importing it makes `pkgs.batey`
# available using the same derivation as the canonical flake package.
# The flake passes its `crane` input; the build logic itself lives in
# `nix/package.nix`.
{ crane }:
final: prev: {
  batey = import ./package.nix {
    pkgs = prev;
    inherit crane;
  };
  batey-frontend = import ./frontend.nix { pkgs = prev; };
}
