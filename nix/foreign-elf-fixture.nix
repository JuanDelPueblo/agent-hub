# A minimal stand-in for a Registry-distributed native binary (T129).
#
# Real ACP binaries (for example OpenCode's release tarball) are built for
# ordinary Linux distributions: they carry the conventional ELF interpreter
# path and no Nix store RPATH, and they resolve libc through the interpreter's
# own default search plus whatever library path environment it is given.
#
# This fixture reproduces exactly that shape from an ordinary Nix-built
# binary, without a network fetch: compile a trivial program with the normal
# Nix toolchain, then strip the Nix store RPATH and repoint the interpreter at
# the conventional path for the target platform. The result only runs if the
# conventional loader path resolves and finds glibc through some other means
# (here, `nix-ld` and `NIX_LD_LIBRARY_PATH`) -- the same failure mode a real
# Registry binary hits on an unpatched image.
{ pkgs }:
let
  interpreter =
    "/${pkgs.stdenv.hostPlatform.libDir}/${baseNameOf pkgs.stdenv.cc.bintools.dynamicLinker}";
in
pkgs.stdenv.mkDerivation {
  pname = "batey-oci-foreign-elf-fixture";
  version = "1";
  dontUnpack = true;
  nativeBuildInputs = [ pkgs.patchelf ];
  buildPhase = ''
    runHook preBuild
    cat > hello.c <<'EOF'
    #include <stdio.h>
    int main(void) {
      printf("foreign-elf-ok\n");
      return 0;
    }
    EOF
    $CC hello.c -o foreign-hello
    runHook postBuild
  '';
  installPhase = ''
    runHook preInstall
    mkdir -p $out/bin
    cp foreign-hello $out/bin/foreign-hello
    chmod +w $out/bin/foreign-hello
    patchelf --remove-rpath $out/bin/foreign-hello
    patchelf --set-interpreter ${interpreter} $out/bin/foreign-hello
    runHook postInstall
  '';
  meta.description =
    "A conventionally-linked ELF binary that reproduces the Registry native-binary loader gap for OCI testing";
}
