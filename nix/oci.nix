# OCI/Docker image built from the exact canonical Pueblo Hub package.
# No second compiler path: `pueblo-hub` below is `nix/package.nix`.
{ pkgs, pueblo-hub }:
let
  # Generic runtimes only. No project-specific toolchains.
  runtimeEnv = pkgs.buildEnv {
    name = "pueblo-hub-runtime-env";
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
in
pkgs.dockerTools.buildLayeredImage {
  name = "pueblo-hub";
  tag = pueblo-hub.version or "latest";
  contents = [ pueblo-hub runtimeEnv pkgs.dockerTools.caCertificates ];
  fakeRootCommands = ''
    mkdir -p ./data ./projects ./tmp
    chown -R 65534:65534 ./data
    chmod 0755 ./data ./projects
    chmod 0777 ./tmp
  '';
  config = {
    Entrypoint = [ "${pueblo-hub}/bin/pueblo-hub" ];
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
    ];
    User = "65534:65534";
    WorkingDir = "/data";
    Volumes = {
      "/data" = { };
      "/projects" = { };
    };
    Labels = {
      "org.opencontainers.image.title" = "Pueblo Hub";
      "org.opencontainers.image.description" = "Persistent single-owner ACP project and chat supervisor";
      "org.opencontainers.image.version" = pueblo-hub.version or "unknown";
    };
  };
}
