#!/usr/bin/env bash
#
# Loads bulk local dev data that does NOT belong in supabase/seed.sql:
#   - The static LEGO catalog (themes, lego_sets, set_prices) — large, external
#     reference data, stored gzipped under supabase/seeds/catalog/.
#   - Per-user collection data (user_sets/favorites/themes) — depends on the
#     catalog, so it can't load inside `supabase db reset` (which runs seed.sql
#     before the catalog exists). Stored as plain CSV under supabase/seeds/fixtures/.
#
# seed.sql seeds the auth users + profiles; this script adds everything that
# references the catalog. Run AFTER `supabase db reset` — or just use
# `npm run db:reset`, which chains both.
#
# Idempotent: truncates these tables before loading, so it is safe to re-run.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CATALOG="$ROOT/supabase/seeds/catalog"
FIXTURES="$ROOT/supabase/seeds/fixtures"

# Prefer the URL the CLI reports; fall back to the standard local default.
DB_URL="${SUPABASE_DB_URL:-$(supabase status -o env 2>/dev/null | sed -n 's/^DB_URL="\(.*\)"$/\1/p')}"
DB_URL="${DB_URL:-postgresql://postgres:postgres@127.0.0.1:54322/postgres}"

copy_gz() { # table, columns, gz-file
  echo "  → $1"
  gzip -dc "$CATALOG/$1.csv.gz" \
    | psql "$DB_URL" -v ON_ERROR_STOP=1 -q \
        -c "\copy $1($2) from stdin with (format csv, header true)"
}

copy_csv() { # table, columns, csv-file
  echo "  → $1"
  psql "$DB_URL" -v ON_ERROR_STOP=1 -q \
    -c "\copy $1($2) from '$FIXTURES/$1.csv' with (format csv, header true)"
}

echo "Resetting bulk tables…"
psql "$DB_URL" -v ON_ERROR_STOP=1 -q -c \
  "truncate user_themes, user_favorites, user_sets, set_prices, lego_sets, themes restart identity cascade;"

echo "Loading catalog…"
copy_gz themes      "id,name,parent_id"
copy_gz lego_sets   "set_num,name,year,theme_id,num_parts,img_url"
copy_gz set_prices  "set_num,currency,retail_price,source,updated_at"

echo "Loading user collection fixtures…"
copy_csv user_sets       "id,user_id,set_num,quantity,notes,created_at,collection_type"
copy_csv user_favorites  "id,user_id,set_num,created_at"
copy_csv user_themes     "id,user_id,theme_id,display_order,created_at"

echo "Done. Local data seeded."
