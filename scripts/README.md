# Utility Scripts

## Overview

This folder contains legacy utility scripts. The production server and
Google Sheets sync logic have been moved to `src/server/`.

## Contents

- `json-to-csv.js` — converts locale JSON data to CSV format (utility/debug use only)

## Server & Sheets sync

These now live in `src/server/`:

| File                              | Purpose                                   |
| --------------------------------- | ----------------------------------------- |
| `src/server/server.mjs`           | Production HTTP server                    |
| `src/server/start.sh`             | Container entrypoint (Coolify / Nixpacks) |
| `src/server/fetch-sheet-data.mjs` | CLI wrapper for `npm run fetch-data`      |
| `src/server/lib/auth.mjs`         | Session signing + Google ID token verify  |
| `src/server/lib/locales.mjs`      | Read/write locale JSON files              |
| `src/server/lib/sheets.mjs`       | Google Sheets pull + transform logic      |

See `docs/google-sheets-integration.md` and `docs/guidelines.md` for
full documentation.
