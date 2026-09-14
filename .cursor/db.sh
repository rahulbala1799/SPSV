#!/usr/bin/env bash
# Shared helpers for provisioning and starting the local Postgres used by the
# Cloud Agent development environment. Sourced by install.sh and start.sh.
set -euo pipefail

DB_NAME="${SPSV_DB_NAME:-spsv}"
DB_USER="${SPSV_DB_USER:-spsv}"
DB_PASS="${SPSV_DB_PASS:-spsv}"

# Detect the installed Postgres cluster (version/name) so the scripts do not
# hard-code a major version.
pg_cluster() {
  # Prints "<version> <cluster>" for the first configured cluster, if any.
  if command -v pg_lsclusters >/dev/null 2>&1; then
    pg_lsclusters -h 2>/dev/null | awk 'NR==1 {print $1, $2}'
  fi
}

start_postgres() {
  local vc version cluster
  vc="$(pg_cluster)"
  version="$(echo "$vc" | awk '{print $1}')"
  cluster="$(echo "$vc" | awk '{print $2}')"

  if [ -z "$version" ] || [ -z "$cluster" ]; then
    echo "No Postgres cluster found; cannot start database." >&2
    return 1
  fi

  # Idempotent: only start if not already online.
  if pg_lsclusters "$version" "$cluster" 2>/dev/null | awk 'NR==2 {print $4}' | grep -q online; then
    echo "Postgres $version/$cluster already online."
  else
    sudo pg_ctlcluster "$version" "$cluster" start
  fi

  # Wait for readiness.
  for _ in $(seq 1 30); do
    if sudo -u postgres pg_isready -q; then
      return 0
    fi
    sleep 1
  done
  echo "Postgres did not become ready in time." >&2
  return 1
}

ensure_role_and_db() {
  # Create the application role and database if they do not already exist.
  sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='${DB_USER}') THEN
    CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';
  END IF;
END \$\$;
ALTER ROLE ${DB_USER} CREATEDB;
SQL
  if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
    sudo -u postgres createdb -O "${DB_USER}" "${DB_NAME}"
  fi
}
