#!/usr/bin/env bash
# OCI runtime smoke test for the canonical Pueblo Hub image.
# Loads `nix build .#pueblo-hub-oci`, runs it with temporary state/project
# mounts, and verifies `/api/status` plus the embedded frontend.
# Needs `docker` or `podman` and a checkout root. Reproducible in CI.
set -euo pipefail

RUNTIME=""
if command -v docker > /dev/null 2>&1; then
  RUNTIME=docker
elif command -v podman > /dev/null 2>&1; then
  RUNTIME=podman
else
  echo "error: need docker or podman for the OCI smoke test" >&2
  exit 1
fi

ROOT="$PWD"
if [ ! -f "$ROOT/flake.nix" ]; then
  echo "error: run from the repository root" >&2
  exit 1
fi

echo "Building the canonical OCI image..."
IMAGE_TAR=$(nix build .#pueblo-hub-oci --no-link --print-out-paths)
echo "Image: $IMAGE_TAR"

echo "Loading into $RUNTIME..."
if [ "$RUNTIME" = docker ]; then
  docker load -i "$IMAGE_TAR"
else
  podman load -i "$IMAGE_TAR"
fi

VERSION=$(grep '^version' "$ROOT/Cargo.toml" | head -1 | sed 's/.*"\([^"]*\)".*/\1/')
IMAGE_REF="pueblo-hub:${VERSION:-latest}"

STATE=$(mktemp -d)
PROJECTS=$(mktemp -d)
mkdir -p "$PROJECTS/demo"
echo "# smoke" > "$PROJECTS/demo/README.md"
# The image runs non-root (65534); temp bind mounts must be writable by it.
chmod 0777 "$STATE" "$PROJECTS" "$PROJECTS/demo"
cleanup() {
  if [ -n "${CID:-}" ]; then
    $RUNTIME rm -f "$CID" > /dev/null 2>&1 || true
  fi
  rm -rf "$STATE" "$PROJECTS"
}
trap cleanup EXIT

echo "Starting pueblo-hub ($IMAGE_REF, state=$STATE projects=$PROJECTS)..."
CID=$($RUNTIME run -d --rm \
  -p 127.0.0.1:8765:8765 \
  -v "$STATE:/data" \
  -v "$PROJECTS:/projects" \
  "$IMAGE_REF")

echo "Waiting for /api/status..."
for _ in $(seq 1 60); do
  if curl -sf http://127.0.0.1:8765/api/status > /dev/null 2>&1; then
    break
  fi
  sleep 1
done
curl -sf http://127.0.0.1:8765/api/status | tee /tmp/pueblo-oci-status.json
curl -sf http://127.0.0.1:8765/ | grep -qi '<!doctype html'

echo "Stopping the container (SIGTERM)..."
$RUNTIME stop -t 20 "$CID" > /dev/null
CID=""
echo "OCI smoke test passed."
