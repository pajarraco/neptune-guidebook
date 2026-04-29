#!/bin/sh
# Container entrypoint for Coolify (Nixpacks).
#
# Persistent volume strategy:
#   Coolify mounts a persistent volume at /app/dist/locales. On the very
#   first boot the volume is empty, so we populate it from Google Sheets.
#   On subsequent boots we leave it alone (the volume already has the
#   latest data) — to refresh, run `npm run fetch-data` from the Coolify
#   terminal, or set FORCE_FETCH_LOCALES=1.
set -e

# Load .env.local if present (local development / testing only).
# In production (Coolify) env vars are injected by the platform.
if [ -f ".env.local" ]; then
  # shellcheck disable=SC2046
  export $(grep -v '^#' .env.local | grep -v '^$' | xargs)
fi

LOCALES_DIR="${LOCALES_DIR:-/app/dist/locales}"
PORT="${PORT:-3000}"

mkdir -p "$LOCALES_DIR"

needs_fetch=0
if [ "${FORCE_FETCH_LOCALES:-0}" = "1" ]; then
  needs_fetch=1
elif [ -z "$(ls -A "$LOCALES_DIR" 2>/dev/null)" ]; then
  needs_fetch=1
fi

if [ "$needs_fetch" = "1" ]; then
  echo "[start] Populating locales in $LOCALES_DIR ..."
  LOCALES_DIR="$LOCALES_DIR" node src/server/fetch-sheet-data.mjs || {
    echo "[start] WARNING: fetch-sheet-data.mjs failed. Continuing with whatever is on the volume."
  }
else
  echo "[start] Using existing locales in $LOCALES_DIR"
fi

echo "[start] Serving dist/ on port $PORT (locales gated by ACCESS_CODE)"
exec node src/server/server.mjs
