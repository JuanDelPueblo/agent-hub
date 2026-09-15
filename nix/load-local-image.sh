#!/usr/bin/env bash
# Build the canonical OCI image, load it into a local container runtime,
# and prepare the disposable state used by compose.yml.
set -euo pipefail

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
cd "$ROOT"

if command -v docker > /dev/null 2>&1; then
  RUNTIME=docker
elif command -v podman > /dev/null 2>&1; then
  RUNTIME=podman
else
  echo "error: need Docker or Podman" >&2
  exit 1
fi

echo "Building the canonical OCI image..."
IMAGE_TAR=$(nix build .#batey-oci --no-link --print-out-paths)
echo "Image archive: $IMAGE_TAR"

echo "Loading the image into $RUNTIME..."
LOAD_OUTPUT=$("$RUNTIME" load --input "$IMAGE_TAR" 2>&1)
printf '%s\n' "$LOAD_OUTPUT"

# Docker prints `Loaded image: batey:VERSION`; Podman usually prints
# `Loaded image(s): batey:VERSION`. Keep the reference supplied by the archive.
IMAGE_REF=$(printf '%s\n' "$LOAD_OUTPUT" \
  | sed -nE 's/.*Loaded image\(s\)?:[[:space:]]*([^[:space:],]+).*/\1/p' \
  | tail -n 1)

if [ -z "$IMAGE_REF" ]; then
  # Use the runtime list only as a fallback for runtimes with different load output.
  IMAGE_REF=$("$RUNTIME" image ls --format '{{.Repository}}:{{.Tag}}' \
    | awk '$0 ~ /(^|\/)batey:[^:]+$/ && $0 !~ /:local$/ { print; exit }')
fi

case "$IMAGE_REF" in
  *batey:*) ;;
  *)
    echo "error: cannot discover the loaded versioned Batey image" >&2
    exit 1
    ;;
esac

echo "Tagging $IMAGE_REF as batey:local..."
"$RUNTIME" tag "$IMAGE_REF" batey:local

mkdir -p .batey-docker/data .batey-docker/projects

COMPOSE_ENV="$ROOT/.env"
HOST_UID=$(id -u)
HOST_GID=$(id -g)

if [ -e "$COMPOSE_ENV" ]; then
  EXISTING_UID=$(sed -nE 's/^BATEY_UID=([0-9]+)$/\1/p' "$COMPOSE_ENV" | head -n 1)
  EXISTING_GID=$(sed -nE 's/^BATEY_GID=([0-9]+)$/\1/p' "$COMPOSE_ENV" | head -n 1)
  if [ "$EXISTING_UID" != "$HOST_UID" ] || [ "$EXISTING_GID" != "$HOST_GID" ]; then
    echo "error: $COMPOSE_ENV exists with a different Batey UID/GID" >&2
    echo "error: remove that file or set BATEY_UID and BATEY_GID to $HOST_UID and $HOST_GID" >&2
    exit 1
  fi
else
  umask 077
  printf '%s\n' \
    '# Created by nix/load-local-image.sh for compose.yml.' \
    "BATEY_UID=$HOST_UID" \
    "BATEY_GID=$HOST_GID" \
    > "$COMPOSE_ENV"
fi

echo "Local OCI image ready: batey:local"
echo "State directory: $ROOT/.batey-docker/data"
echo "Project directory: $ROOT/.batey-docker/projects"
echo "Compose identity: $COMPOSE_ENV (UID $HOST_UID, GID $HOST_GID)"
