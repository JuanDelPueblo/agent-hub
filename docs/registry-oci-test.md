# Registry OCI test

This test uses the official Registry through the production OCI image.
The frozen fixture in `tests/fixtures/registry-v1-current.json` supplies test data only.
Production continues to fetch the official endpoint.

## Clean state

Remove the test data only if you no longer need its chats or installed agents.
Run these commands from the repository root:

```sh
docker compose down
rm -rf .batey-docker/data
nix/load-local-image.sh
docker compose up -d
```

1. Open `http://localhost:8765/agents/registry`.
2. Confirm that agents appear without a click on **Refresh**.
3. Confirm that Codex and Claude appear if the official Registry contains them.
4. Enter `codex` in the search field.
5. Confirm that the list changes with each character.
6. Enter `claude` in the search field.
7. Select **Clear search**.
8. Confirm that all entries return immediately.
9. Enter `codex` again.
10. Select **Refresh**.
11. Confirm that the query stays active and Codex remains visible.
12. Confirm that the status shows **Freshly fetched** and the fetch time.
13. Clear the search again.

Use the browser Network panel to confirm that search and clear send no Registry requests.
Refresh sends one request for the full catalog.

Compare the raw cache and API counts:

```sh
jq '.agents | length' .batey-docker/data/registry-cache/registry.json
curl -fsS http://localhost:8765/api/agents/registry \
  | jq '{status, fetched_at, accepted: (.agents | length), rejected, error}'
```

The ordinary API request returns `cached` after the first fetch.
The response includes `rejected: []` when all entries pass validation.
Expand the rejection details when entries fail validation.
A catalog with zero accepted entries must show a problem.

## Restart and offline cache

1. Record the API agent IDs and fetch time.
2. Run `docker compose restart`.
3. Open the Registry page again.
4. Confirm that the same entries and fetch time appear with **Cached catalog**.
5. Repeat the restart test a second time.

To test a failed refresh, use an unreachable HTTPS endpoint after the cache exists.
Create a temporary Compose override outside the repository:

```yaml
services:
  batey:
    environment:
      BATEY_REGISTRY_URL: https://127.0.0.1:9/registry.json
```

Start Compose with the override:

```sh
docker compose -f compose.yml -f /tmp/batey-registry-offline.yml up -d
```

1. Open the Registry page.
2. Confirm that the cached entries appear without a network fetch.
3. Select **Refresh**.
4. Confirm that the entries and fetch time remain unchanged.
5. Confirm that the page reports the refresh failure separately.
6. Run `docker compose up -d` to restore the official endpoint.

## Browser regression check

The check needs Chromium and Node 22 on the host.
Set `CHROMIUM` if the executable has a different name.

```sh
nix develop --command node nix/registry-browser-check.mjs http://localhost:8765
```

The check verifies rendered entries, local search, clear, refresh, the fetch time, and compact layout.
Add `--offline` during the offline test.
The check then requires a refresh error and requires cached entries to remain visible.

## T128 reproduction

On 2026-09-15, the official document contained 41 entries.
The original parser accepted all 41 entries and rejected zero entries.
The fresh Compose API returned 41 entries but omitted the empty `rejected` array.
The frontend read `rejected.length` and stopped before it rendered the list.
The fake backend always supplied that array, so its page did not reproduce the failure.

The fixture preserves seven official entries and adds three isolation cases.
It accepts eight entries and rejects two entries with explicit reasons.
It covers package distributions, binary platforms, optional SHA values, args, env, and unknown fields.
