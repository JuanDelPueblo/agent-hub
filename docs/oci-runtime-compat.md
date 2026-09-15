# OCI runtime compatibility (T129)

This test proves the Nix-built OCI image can run ordinary Linux binaries and
`#!/usr/bin/env ...` scripts from the ACP Registry. It guards one specific
regression: a Registry-installed native binary or script failed to start.
The failure looked like a missing file. The real cause was a missing
conventional ELF loader and a missing `/usr/bin/env`.

## What the image now provides

- `/lib64/ld-linux-x86-64.so.2` on x86_64, and the aarch64 equivalent, both
  point at `nix-ld`. `nix-ld` reads `NIX_LD` and `NIX_LD_LIBRARY_PATH` and
  hands off to the real loader with a working library search path.
- `NIX_LD_LIBRARY_PATH` covers glibc, libstdc++, zlib, and openssl. Add a
  library here only when a real ACP demonstrates a need for it.
- `/usr/bin/env`, `/bin/sh`, and `/bin/bash` all point at binaries already in
  the image. Nothing is duplicated.
- Every library and binary comes from the image's own Nix closure. The image
  never mounts the host's `/nix/store`.
- The container still runs as the unprivileged user `65534:65534`. Nix
  creates the loader symlinks at image build time, not through a startup
  script that needs root.

## Automated test

Run this from the repository root:

```sh
./nix/oci-runtime-compat-smoke.sh
```

It needs `docker` or `podman`, and network access to fetch a real ACP
Registry entry. It builds the image, starts a container, and checks:

1. The conventional loader path and `/usr/bin/env` exist.
2. `SSL_CERT_FILE` points at a real CA bundle inside the container. Agents
   such as Antigravity need this to make TLS connections.
3. A synthetic foreign-ELF binary runs. This binary reproduces the exact
   shape of a real Registry binary: the conventional interpreter path, no
   Nix store RPATH. `nix/foreign-elf-fixture.nix` builds it. It fails on an
   image without this fix.
4. A `#!/usr/bin/env node` script runs.
5. The real OpenCode native binary, downloaded from its Registry entry, runs
   `--version`.
6. A real npx ACP Registry entry (`claude-agent-acp`) reaches ACP
   initialization: it replies to an `initialize` request over stdio.

`nix flake check` also runs a hermetic check with no daemon
(`nix/oci-check.nix`). It extracts the image layers and confirms the loader
symlink and `/usr/bin/env` exist in the image content, and that the image
config sets `NIX_LD` and `NIX_LD_LIBRARY_PATH`.

## Manual verification through Batey itself

The steps above prove the image can run foreign binaries. To prove Batey's
own ACP launch path benefits, run the local Compose workflow and install a
real agent:

```sh
nix/load-local-image.sh
docker compose up -d
```

Then, through the Batey UI or its REST API, install and start OpenCode (a
Registry native binary) and an npx-based agent such as `claude-acp`. A
successful prompt assigns a real `acp_session_id` and moves the chat to
`process_state: RUNNING`. Before this fix, a Registry native binary like
OpenCode failed at this exact step with a misleading "file not found" error,
because the missing file was the ELF loader, not the agent binary.

## A related fix worth knowing about

`nix/load-local-image.sh` discovers the freshly loaded image tag by parsing
`docker load`'s output, with a fallback that scans `docker image ls`. That
fallback can pick a stale `batey:<old-version>` tag left over from earlier
work, instead of the image you just built. If `batey:local` looks wrong
after running the script, check `docker images | grep batey` for a stale tag
and retag manually:

```sh
docker tag batey:<correct-version> batey:local
```

This is a pre-existing issue in the script's discovery logic, not something
this change introduced. It is worth a follow-up fix.
