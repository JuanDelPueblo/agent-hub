#!/usr/bin/env bash
# OCI runtime-compatibility regression test (T129).
#
# Proves the Nix-built OCI image can execute ordinary Linux binaries and
# script entrypoints installed from the ACP Registry, the way
# `nix/load-local-image.sh` + `docker compose` runs them in practice. This
# guards the specific regression: a Registry-installed native binary or an
# `#!/usr/bin/env ...` script failing with a misleading "file not found"
# because the image had no conventional ELF loader or `/usr/bin/env`.
#
# Needs `docker` or `podman`, a checkout root, and network access (it fetches
# a real Registry entry and a real npm package, the same way Batey's own
# Registry install path would). Run from the repository root.
set -euo pipefail

RUNTIME=""
if command -v docker > /dev/null 2>&1; then
  RUNTIME=docker
elif command -v podman > /dev/null 2>&1; then
  RUNTIME=podman
else
  echo "error: need docker or podman for the OCI runtime-compat smoke test" >&2
  exit 1
fi

ROOT="$PWD"
if [ ! -f "$ROOT/flake.nix" ]; then
  echo "error: run from the repository root" >&2
  exit 1
fi

WORK=$(mktemp -d)
cleanup() {
  if [ -n "${CID:-}" ]; then
    $RUNTIME rm -f "$CID" > /dev/null 2>&1 || true
  fi
  rm -rf "$WORK"
}
trap cleanup EXIT

echo "Building the canonical OCI image and the foreign-ELF fixture..."
IMAGE_TAR=$(nix build .#batey-oci --no-link --print-out-paths)
FIXTURE=$(nix build .#oci-foreign-elf-fixture --no-link --print-out-paths)
echo "Image: $IMAGE_TAR"
echo "Fixture: $FIXTURE"

echo "Loading into $RUNTIME..."
LOAD_OUTPUT=$($RUNTIME load -i "$IMAGE_TAR" 2>&1)
printf '%s\n' "$LOAD_OUTPUT"
VERSION=$(grep '^version' "$ROOT/Cargo.toml" | head -1 | sed 's/.*"\([^"]*\)".*/\1/')
IMAGE_REF="batey:${VERSION:-latest}"

echo "Starting a probe container ($IMAGE_REF)..."
CID=$($RUNTIME create --entrypoint sh "$IMAGE_REF" -c 'sleep 600')
$RUNTIME start "$CID" > /dev/null

fail() { echo "oci-runtime-compat failed: $1" >&2; exit 1; }

echo "Checking the conventional loader path and env shim exist..."
$RUNTIME exec "$CID" sh -c '
  set -e
  case "$(uname -m)" in
    x86_64) loader=/lib64/ld-linux-x86-64.so.2 ;;
    aarch64) loader=/lib/ld-linux-aarch64.so.1 ;;
    *) echo "unsupported host arch $(uname -m)" >&2; exit 1 ;;
  esac
  test -e "$loader" || { echo "missing conventional loader: $loader" >&2; exit 1; }
  test -e /usr/bin/env || { echo "missing /usr/bin/env" >&2; exit 1; }
  test -e /bin/sh || { echo "missing /bin/sh" >&2; exit 1; }
  test -e /bin/bash || { echo "missing /bin/bash" >&2; exit 1; }
  [ "$(id -u)" != 0 ] || { echo "container runs as root" >&2; exit 1; }
' || fail "structural checks"

echo "Checking SSL_CERT_FILE is set and resolves inside the container..."
$RUNTIME exec "$CID" sh -c 'test -n "$SSL_CERT_FILE" && test -f "$SSL_CERT_FILE"' \
  || fail "SSL_CERT_FILE is not set to a real file (breaks TLS for agents such as Antigravity)"

echo "Running the foreign-ELF fixture (regresses to 'file not found' without a loader)..."
$RUNTIME cp "$FIXTURE/bin/foreign-hello" "$CID:/tmp/foreign-hello"
OUT=$($RUNTIME exec "$CID" /tmp/foreign-hello) || fail "foreign ELF binary did not execute"
[ "$OUT" = "foreign-elf-ok" ] || fail "foreign ELF binary produced unexpected output: $OUT"

echo "Running a '#!/usr/bin/env node' script (proves /usr/bin/env)..."
cat > "$WORK/env-node-check.mjs" <<'EOF'
#!/usr/bin/env node
console.log("env-node-ok");
EOF
chmod +x "$WORK/env-node-check.mjs"
$RUNTIME cp "$WORK/env-node-check.mjs" "$CID:/tmp/env-node-check.mjs"
OUT=$($RUNTIME exec "$CID" /tmp/env-node-check.mjs) || fail "env-node script did not execute"
[ "$OUT" = "env-node-ok" ] || fail "env-node script produced unexpected output: $OUT"

echo "Fetching the official Registry catalog for a representative native-binary ACP (OpenCode)..."
REGISTRY_URL="https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json"
curl -fsS -m 30 "$REGISTRY_URL" -o "$WORK/registry.json"
case "$(uname -m)" in
  x86_64) PLATFORM=linux-x86_64 ;;
  aarch64) PLATFORM=linux-aarch64 ;;
  *) fail "unsupported host arch for the Registry test: $(uname -m)" ;;
esac
ARCHIVE_URL=$(python3 -c "
import json, sys
d = json.load(open('$WORK/registry.json'))
for a in d['agents']:
    if a.get('id') == 'opencode':
        print(a['distribution']['binary']['$PLATFORM']['archive'])
        sys.exit(0)
sys.exit(1)
") || fail "opencode native-binary entry not found in the official Registry catalog"
echo "Downloading $ARCHIVE_URL..."
curl -fsSL -m 120 "$ARCHIVE_URL" -o "$WORK/opencode.tar.gz"
mkdir -p "$WORK/opencode"
tar -xzf "$WORK/opencode.tar.gz" -C "$WORK/opencode"
chmod +x "$WORK/opencode/opencode"
$RUNTIME exec "$CID" mkdir -p /tmp/opencode
$RUNTIME cp "$WORK/opencode/opencode" "$CID:/tmp/opencode/opencode"
OUT=$($RUNTIME exec "$CID" /tmp/opencode/opencode --version) || fail "installed OpenCode binary did not run"
echo "OpenCode --version: $OUT"

echo "Verifying a representative Registry npx ACP reaches ACP initialization (claude-agent-acp)..."
NPX_PACKAGE=$(python3 -c "
import json
d = json.load(open('$WORK/registry.json'))
for a in d['agents']:
    if a.get('id') == 'claude-acp':
        print(a['distribution']['npx']['package'])
" ) || fail "claude-acp npx entry not found in the official Registry catalog"
[ -n "$NPX_PACKAGE" ] || fail "claude-acp npx entry not found in the official Registry catalog"
INIT_REQUEST='{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":1,"clientCapabilities":{}}}'
RESPONSE=$($RUNTIME exec -i "$CID" sh -c "export HOME=/tmp/npx-home; mkdir -p \$HOME; timeout 90 npx -y $NPX_PACKAGE" <<EOF || true
$INIT_REQUEST
EOF
)
case "$RESPONSE" in
  *'"protocolVersion"'*) echo "npx ACP reached initialize: $RESPONSE" ;;
  *) fail "npx ACP did not reach ACP initialization: $RESPONSE" ;;
esac

echo "OCI runtime-compatibility smoke test passed."
