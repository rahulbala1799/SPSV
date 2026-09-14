#!/usr/bin/env bash
# Cloud Agent start phase: bring up per-boot runtime state (the Postgres server).
# Must tolerate restarts and return once the database is ready.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck source=db.sh
source "$REPO_ROOT/.cursor/db.sh"

echo "==> Starting PostgreSQL"
start_postgres
ensure_role_and_db
echo "==> Database ready"
