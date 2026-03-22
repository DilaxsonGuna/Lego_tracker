/**
 * Sync retail prices from Brickset API into set_prices table.
 *
 * Fetches sets year-by-year from Brickset, extracts retail prices for
 * USD, GBP, CAD, EUR, and upserts into the set_prices table.
 *
 * Usage:
 *   npx tsx scripts/sync-brickset-prices.ts
 *   npx tsx scripts/sync-brickset-prices.ts --year 2024        # single year
 *   npx tsx scripts/sync-brickset-prices.ts --from 2020 --to 2025  # year range
 *
 * Env vars required (from .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   BRICKSET_API_KEY
 */

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

// ── Load env from .env.local ──────────────────────────────────

function loadEnv(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const file of [".env.local", ".env"]) {
    const envPath = path.resolve(process.cwd(), file);
    try {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
        if (match) vars[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
      }
    } catch {
      // file not found, try next
    }
  }
  return vars;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const BRICKSET_API_KEY = env.BRICKSET_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
if (!BRICKSET_API_KEY) {
  console.error("Missing BRICKSET_API_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Brickset API ──────────────────────────────────────────────

const BRICKSET_BASE = "https://brickset.com/api/v3.asmx";
const PAGE_SIZE = 500;
const RATE_LIMIT_MS = 1100; // slightly over 1 req/sec

interface BricksetSet {
  number: string;
  numberVariant: number;
  name: string;
  year: number;
  LEGOCom: {
    US?: { retailPrice?: number };
    UK?: { retailPrice?: number };
    CA?: { retailPrice?: number };
    DE?: { retailPrice?: number };
  };
}

interface BricksetResponse {
  status: string;
  matches: number;
  sets: BricksetSet[];
}

async function fetchBricksetPage(year: number, pageNumber: number): Promise<BricksetResponse> {
  const params = JSON.stringify({ year, pageSize: PAGE_SIZE, pageNumber });
  const url = `${BRICKSET_BASE}/getSets?apiKey=${BRICKSET_API_KEY}&userHash=&params=${encodeURIComponent(params)}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`Brickset API error: ${res.status} ${res.statusText}`);

  return res.json() as Promise<BricksetResponse>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Price extraction ──────────────────────────────────────────

interface PriceRow {
  set_num: string;
  currency: string;
  retail_price: number;
  source: string;
}

function extractPrices(set: BricksetSet): PriceRow[] {
  const setNum = `${set.number}-${set.numberVariant}`;
  const prices: PriceRow[] = [];

  const mapping: [string, { retailPrice?: number } | undefined][] = [
    ["USD", set.LEGOCom.US],
    ["GBP", set.LEGOCom.UK],
    ["CAD", set.LEGOCom.CA],
    ["EUR", set.LEGOCom.DE],
  ];

  for (const [currency, data] of mapping) {
    if (data?.retailPrice && data.retailPrice > 0) {
      prices.push({
        set_num: setNum,
        currency,
        retail_price: data.retailPrice,
        source: "brickset",
      });
    }
  }

  return prices;
}

// ── Main sync ─────────────────────────────────────────────────

async function syncYear(year: number): Promise<{ sets: number; prices: number }> {
  let page = 1;
  let totalSets = 0;
  let totalPrices = 0;

  while (true) {
    const data = await fetchBricksetPage(year, page);

    if (data.status !== "success") {
      console.error(`  Brickset error for year ${year} page ${page}: ${data.status}`);
      break;
    }

    if (data.sets.length === 0) break;

    // Extract all prices from this page
    const allPrices: PriceRow[] = [];
    for (const set of data.sets) {
      allPrices.push(...extractPrices(set));
    }

    // Upsert into set_prices (only for sets that exist in our lego_sets table)
    if (allPrices.length > 0) {
      // Get set_nums that exist in our DB
      const setNums = [...new Set(allPrices.map((p) => p.set_num))];
      const { data: existingSets } = await supabase
        .from("lego_sets")
        .select("set_num")
        .in("set_num", setNums);

      const existingSetNums = new Set((existingSets ?? []).map((s) => s.set_num));
      const validPrices = allPrices.filter((p) => existingSetNums.has(p.set_num));

      if (validPrices.length > 0) {
        const { error } = await supabase.from("set_prices").upsert(validPrices, {
          onConflict: "set_num,currency,source",
        });

        if (error) {
          console.error(`  Upsert error for year ${year} page ${page}:`, error.message);
        } else {
          totalPrices += validPrices.length;
        }
      }
    }

    totalSets += data.sets.length;

    // Check if more pages
    if (data.sets.length < PAGE_SIZE) break;

    page++;
    await sleep(RATE_LIMIT_MS);
  }

  return { sets: totalSets, prices: totalPrices };
}

async function main() {
  const args = process.argv.slice(2);
  let fromYear = 1970;
  let toYear = new Date().getFullYear();

  // Parse CLI args
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--year" && args[i + 1]) {
      fromYear = toYear = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === "--from" && args[i + 1]) {
      fromYear = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === "--to" && args[i + 1]) {
      toYear = parseInt(args[i + 1]);
      i++;
    }
  }

  console.log(`Syncing Brickset prices for years ${fromYear}-${toYear}...`);
  console.log();

  let grandTotalSets = 0;
  let grandTotalPrices = 0;

  for (let year = fromYear; year <= toYear; year++) {
    const { sets, prices } = await syncYear(year);

    if (sets > 0) {
      console.log(`  ${year}: ${sets} sets, ${prices} prices upserted`);
    }

    grandTotalSets += sets;
    grandTotalPrices += prices;

    await sleep(RATE_LIMIT_MS);
  }

  console.log();
  console.log(`Done. ${grandTotalSets} sets processed, ${grandTotalPrices} prices upserted.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
