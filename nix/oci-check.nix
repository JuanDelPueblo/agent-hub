# Validates the OCI image construction through Nix only (no daemon).
# Asserts the canonical package binary is the entrypoint, the image runs
# non-root, exposes port 8765, and documents persistent mounts.
{ pkgs, batey-oci, batey }:
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

  cmdJoined=$(jq -r '(.config.Cmd // []) | join(" ")' "$config")
  case "$cmdJoined" in
    *"--host"*0.0.0.0*|*"--port"*8765*) ;;
    *) fail "image Cmd does not bind 0.0.0.0:8765 by default: $cmdJoined" ;;
  esac

  echo "OCI image $image passes config checks (entrypoint, user $user, 8765, volumes)."
  touch $out
''
