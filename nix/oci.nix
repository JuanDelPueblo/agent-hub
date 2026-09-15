# OCI/Docker image built from the exact canonical Batey package.
# No second compiler path: `batey` below is `nix/package.nix`.
{ pkgs, batey }:
let
  lib = pkgs.lib;

  # Generic runtimes only. No project-specific toolchains.
  runtimeEnv = pkgs.buildEnv {
    name = "batey-runtime-env";
    paths = with pkgs; [
      bash
      coreutils
      git
      openssh
      direnv
      nodejs
      uv
      cacert
    ];
  };

  # --- Foreign-ELF compatibility (T129) ---
  #
  # ACP Registry installs (native binaries and npx/uvx packages with native
  # dependencies) are built for ordinary Linux distributions. They carry the
  # conventional ELF interpreter path (`/lib64/ld-linux-x86-64.so.2` on
  # x86_64, the aarch64 equivalent on aarch64) rather than a Nix store path,
  # and they expect glibc's usual shared libraries to be reachable. Batey's
  # Nix-built image has neither by default, so such a binary fails to exec
  # with a misleading "No such file or directory" that looks like a missing
  # executable but is actually a missing interpreter.
  #
  # `nix-ld` is the standard Nix mechanism for this: it is itself a tiny ELF
  # binary that gets placed at the conventional interpreter path. The kernel
  # loads it as if it were the real loader; it then reads `NIX_LD` (the real
  # loader to hand off to) and `NIX_LD_LIBRARY_PATH` (where to find the
  # libraries the foreign binary needs) and execs the real loader with that
  # search path. This mirrors the NixOS `programs.nix-ld` module, adapted for
  # a non-NixOS container image.
  #
  # `stdenv.hostPlatform` already carries the correct interpreter path and
  # basename for the target system, so this needs no manual per-arch
  # branching: it produces `/lib64/ld-linux-x86-64.so.2` on x86_64-linux and
  # `/lib/ld-linux-aarch64.so.1` on aarch64-linux.
  realLoader = pkgs.stdenv.cc.bintools.dynamicLinker;
  conventionalLoaderPath = "/${pkgs.stdenv.hostPlatform.libDir}/${baseNameOf realLoader}";

  # A practical generic compatibility set, not a provider-specific one:
  # glibc itself (libc/libm/libpthread/libdl), the C++ runtime (libstdc++/
  # libgcc_s), zlib, and openssl. Extend this only when a representative ACP
  # demonstrates a real additional need.
  nixLdLibraries = with pkgs; [
    glibc
    stdenv.cc.cc
    zlib
    openssl
  ];
  nixLdLibraryEnv = pkgs.buildEnv {
    name = "batey-nix-ld-libs";
    paths = map lib.getLib nixLdLibraries;
    pathsToLink = [ "/lib" ];
    ignoreCollisions = true;
  };
in
pkgs.dockerTools.buildLayeredImage {
  name = "batey";
  tag = batey.version or "latest";
  contents = [
    batey
    runtimeEnv
    pkgs.dockerTools.caCertificates
    pkgs.nix-ld
    nixLdLibraryEnv
  ];
  fakeRootCommands = ''
    mkdir -p ./data ./projects ./tmp
    chown -R 65534:65534 ./data
    chmod 0755 ./data ./projects
    chmod 0777 ./tmp

    # Conventional ELF loader path -> nix-ld. Built into the image at build
    # time (no root required at container runtime); the container still runs
    # as an unprivileged user.
    mkdir -p ".$(dirname ${conventionalLoaderPath})"
    ln -sf ${pkgs.nix-ld}/libexec/nix-ld ".${conventionalLoaderPath}"

    # `#!/usr/bin/env ...` script shims. Point at the binaries already in the
    # image's Nix closure instead of duplicating them.
    mkdir -p ./usr/bin
    ln -sf ${pkgs.coreutils}/bin/env ./usr/bin/env
  '';
  config = {
    Entrypoint = [ "${batey}/bin/batey" ];
    Cmd = [
      "--host" "0.0.0.0"
      "--port" "8765"
      "--data-dir" "/data"
      "--state-dir" "/data/state"
      "--config-dir" "/data/config"
      "--project-root" "/projects"
    ];
    ExposedPorts = {
      "8765/tcp" = { };
    };
    Env = [
      "HOME=/data"
      "PATH=/bin:/usr/bin:${runtimeEnv}/bin"
      "SSL_CERT_FILE=/etc/ssl/certs/ca-bundle.crt"
      "NIX_LD=${realLoader}"
      "NIX_LD_LIBRARY_PATH=${nixLdLibraryEnv}/lib"
    ];
    User = "65534:65534";
    WorkingDir = "/data";
    Volumes = {
      "/data" = { };
      "/projects" = { };
    };
    Labels = {
      "org.opencontainers.image.title" = "Batey";
      "org.opencontainers.image.description" = "Persistent single-owner ACP project and chat supervisor";
      "org.opencontainers.image.version" = batey.version or "unknown";
    };
  };
}
