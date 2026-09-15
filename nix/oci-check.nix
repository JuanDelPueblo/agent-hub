# Validates the OCI image construction through Nix only (no daemon).
# Asserts the canonical package binary is the entrypoint, the image runs
# non-root, exposes port 8765, documents persistent mounts, and (T129)
# carries a conventional ELF loader plus a `/usr/bin/env` shim for
# Registry-installed native binaries and env-shebang scripts.
{ pkgs, batey-oci, batey }:
let
  # Same table dockerTools/nix-ld use: the conventional loader path for the
  # target platform, independent of the Nix store.
  loaderPath =
    "/${pkgs.stdenv.hostPlatform.libDir}/${baseNameOf pkgs.stdenv.cc.bintools.dynamicLinker}";
in
pkgs.runCommand "batey-oci-config-check" {
  nativeBuildInputs = [ pkgs.jq ];
} ''
  set -euo pipefail
  fail() { echo "oci-check failed: $1" >&2; exit 1; }

  image=${batey-oci}
  work=$(mktemp -d)
  tar -xf "$image" -C "$work"
  manifest="$work/manifest.json"
  [ -f "$manifest" ] || fail "image has no manifest.json"
  configRel=$(jq -r '.[0].Config' "$manifest")
  config="$work/$configRel"
  [ -f "$config" ] || fail "image config $configRel missing"

  entry=$(jq -r '.config.Entrypoint | join(" ")' "$config")
  case "$entry" in
    */bin/batey*) ;;
    *) fail "Entrypoint does not run the canonical package: $entry" ;;
  esac

  user=$(jq -r '.config.User // empty' "$config")
  [ -n "$user" ] || fail "image has no User"
  [ "$user" != "0" ] && [ "$user" != "root" ] && [ "$user" != "0:0" ] && [ "$user" != "root:root" ] \
    || fail "image runs as root: $user"

  jq -e '.config.ExposedPorts["8765/tcp"]' "$config" > /dev/null \
    || fail "image does not expose 8765/tcp"
  jq -e '.config.Volumes["/data"]' "$config" > /dev/null \
    || fail "image does not document a /data volume"
  jq -e '.config.Volumes["/projects"]' "$config" > /dev/null \
    || fail "image does not document a /projects volume"

  envJoined=$(jq -r '(.config.Env // []) | join("\n")' "$config")
  echo "$envJoined" | grep -q '^HOME=/data' || fail "image HOME is not /data"
  echo "$envJoined" | grep -q '^NIX_LD=' || fail "image does not set NIX_LD (foreign ELF binaries cannot start)"
  echo "$envJoined" | grep -q '^NIX_LD_LIBRARY_PATH=' \
    || fail "image does not set NIX_LD_LIBRARY_PATH (foreign ELF binaries cannot resolve libc)"
  echo "$envJoined" | grep -q '^SSL_CERT_FILE=/etc/ssl/certs/ca-bundle.crt$' \
    || fail "image SSL_CERT_FILE is not the expected CA bundle path"

  cmdJoined=$(jq -r '(.config.Cmd // []) | join(" ")' "$config")
  case "$cmdJoined" in
    *"--host"*0.0.0.0*|*"--port"*8765*) ;;
    *) fail "image Cmd does not bind 0.0.0.0:8765 by default: $cmdJoined" ;;
  esac

  # Extract every layer and confirm the conventional ELF loader and the
  # `/usr/bin/env` shim actually land in the image content, not just in the
  # config's Env. This is the structural half of the T129 regression guard;
  # nix/oci-runtime-compat-smoke.sh exercises the same paths by execution.
  rootfs="$work/rootfs"
  mkdir -p "$rootfs"
  for layerRel in $(jq -r '.[0].Layers[]' "$manifest"); do
    layer="$work/$layerRel"
    [ -f "$layer" ] || fail "image layer $layerRel missing"
    tar -xf "$layer" -C "$rootfs"
  done

  # `-L`, not `-e`: the symlink target is a Nix store path that this
  # hermetic check's own sandbox has no reason to have bind-mounted, so
  # following it would report a real symlink as "missing". Checking the
  # link target's text is enough here; nix/oci-runtime-compat-smoke.sh
  # proves the target actually resolves and runs inside a real container.
  loaderPath="${loaderPath}"
  [ -L "$rootfs$loaderPath" ] || fail "conventional ELF loader path $loaderPath missing from image content"
  target=$(readlink "$rootfs$loaderPath")
  case "$target" in
    */libexec/nix-ld) ;;
    *) fail "conventional loader path $loaderPath does not point at nix-ld: $target" ;;
  esac
  [ -L "$rootfs/usr/bin/env" ] || fail "/usr/bin/env missing from image content"
  [ -L "$rootfs/bin/sh" ] || fail "/bin/sh missing from image content"
  [ -L "$rootfs/bin/bash" ] || fail "/bin/bash missing from image content"

  echo "OCI image $image passes config checks (entrypoint, user $user, 8765, volumes, loader, env shim)."
  touch $out
''
