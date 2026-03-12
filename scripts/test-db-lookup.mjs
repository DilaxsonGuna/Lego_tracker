/**
 * Test script: Validate set number lookup against Supabase lego_sets table
 *
 * Checks whether the set numbers returned by Gemini exist in the local DB
 * with the "-1" suffix normalization.
 *
 * Usage:
 *   node scripts/test-db-lookup.mjs
 */

import fs from "node:fs";
import path from "node:path";

// ── Load env ────────────────────────────────────────────────

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  const vars = {};
  try {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([A-Z_]+)=(.+)$/);
      if (match) vars[match[1]] = match[2].trim();
    }
  } catch {}
  return vars;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env");
  process.exit(1);
}

// ── Set numbers from Gemini test ────────────────────────────

const GEMINI_RESULTS = [
  { raw: "40725", source: "IMG_8651.HEIC", geminiName: "Cherry Blossoms" },
  { raw: "10307", source: "browser-screenshot2.png", geminiName: "Eiffel Tower" },
  { raw: "40522", source: "catalog 1.jpg", geminiName: "Valentine Lovebirds" },
  { raw: "41722", source: "catalog 2.jpg", geminiName: "Horse Show Trailer" },
  { raw: "40492", source: "catalog 3.jpg", geminiName: "Stranger Things BrickHeadz" },
];

// ── Normalize (same logic as pipeline) ──────────────────────

function normalizeSetNum(input) {
  const trimmed = input.trim().replace(/[^\d-]/g, "");
  if (!trimmed.includes("-")) return `${trimmed}-1`;
  return trimmed;
}

// ── Supabase REST query ─────────────────────────────────────

async function lookupSet(setNum) {
  const url = `${SUPABASE_URL}/rest/v1/lego_sets?select=set_num,name,year,num_parts,img_url,theme_id&set_num=eq.${encodeURIComponent(setNum)}`;

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!response.ok) {
    return { error: `HTTP ${response.status}` };
  }

  const data = await response.json();
  return data.length > 0 ? data[0] : null;
}

// ── Rebrickable fallback ────────────────────────────────────

const REBRICKABLE_KEY = env.REBRICKABLE_KEY;

async function lookupRebrickable(setNum) {
  if (!REBRICKABLE_KEY) return null;

  const url = `https://rebrickable.com/api/v3/lego/sets/${encodeURIComponent(setNum)}/?key=${REBRICKABLE_KEY}`;
  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  return {
    set_num: data.set_num,
    name: data.name,
    year: data.year,
    num_parts: data.num_parts,
  };
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`  DATABASE LOOKUP TEST`);
  console.log(`  Supabase: ${SUPABASE_URL}`);
  console.log(`  Sets to check: ${GEMINI_RESULTS.length}`);
  console.log(`${"=".repeat(70)}\n`);

  const results = [];

  for (const item of GEMINI_RESULTS) {
    const normalized = normalizeSetNum(item.raw);

    console.log(`${"─".repeat(70)}`);
    console.log(`  SET: ${item.raw} -> normalized: ${normalized}`);
    console.log(`  Source: ${item.source}`);
    console.log(`  Gemini said: "${item.geminiName}"`);

    // Tier 1: Local DB
    const dbResult = await lookupSet(normalized);

    if (dbResult && !dbResult.error) {
      console.log(`\n  TIER 1 (Local DB): FOUND`);
      console.log(`    name:      ${dbResult.name}`);
      console.log(`    year:      ${dbResult.year}`);
      console.log(`    parts:     ${dbResult.num_parts}`);
      console.log(`    theme_id:  ${dbResult.theme_id}`);

      const nameMatch = dbResult.name.toLowerCase().includes(item.geminiName.toLowerCase().split(" ")[0]);
      console.log(`\n  NAME CHECK: ${nameMatch ? "MATCH" : "MISMATCH"} (DB: "${dbResult.name}" vs Gemini: "${item.geminiName}")`);

      results.push({ ...item, normalized, tier: 1, found: true, dbName: dbResult.name, nameMatch });
    } else {
      console.log(`\n  TIER 1 (Local DB): NOT FOUND`);

      // Tier 3: Rebrickable
      console.log(`  TIER 3 (Rebrickable API): checking...`);
      const rbResult = await lookupRebrickable(normalized);

      if (rbResult) {
        console.log(`  TIER 3: FOUND`);
        console.log(`    name:  ${rbResult.name}`);
        console.log(`    year:  ${rbResult.year}`);
        console.log(`    parts: ${rbResult.num_parts}`);
        results.push({ ...item, normalized, tier: 3, found: true, dbName: rbResult.name });
      } else {
        console.log(`  TIER 3: NOT FOUND`);
        results.push({ ...item, normalized, tier: null, found: false });
      }
    }

    console.log();
  }

  // Summary
  console.log(`${"=".repeat(70)}`);
  console.log(`  SUMMARY`);
  console.log(`${"=".repeat(70)}\n`);

  const found = results.filter((r) => r.found).length;
  const tier1 = results.filter((r) => r.tier === 1).length;
  const tier3 = results.filter((r) => r.tier === 3).length;
  const notFound = results.filter((r) => !r.found).length;

  console.log(`  Found: ${found}/${results.length} (Tier 1: ${tier1}, Tier 3: ${tier3}, Not found: ${notFound})\n`);

  for (const r of results) {
    const tierLabel = r.tier ? `Tier ${r.tier}` : "MISS";
    console.log(`    ${r.raw.padEnd(8)} -> ${r.normalized.padEnd(10)} ${tierLabel.padEnd(8)} ${r.found ? r.dbName : "NOT FOUND"}`);
  }

  console.log(`\n${"=".repeat(70)}\n`);
}

main().catch(console.error);
