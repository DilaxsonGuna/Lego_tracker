/**
 * Test script: Validate EXIF metadata detection on test images
 *
 * Tests whether exifr can distinguish real photos (with EXIF) from
 * screenshots and catalog images (without EXIF).
 *
 * Usage:
 *   node scripts/test-exif-check.mjs
 */

import fs from "node:fs";
import path from "node:path";

const TEST_DIR = path.resolve(process.cwd(), ".test_img");

// Dynamically import exifr — check if installed, suggest install if not
let exifr;
try {
  exifr = await import("exifr");
  exifr = exifr.default || exifr;
} catch {
  console.error("exifr not installed. Run: npm install --save-dev exifr");
  process.exit(1);
}

function getExpectedType(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes("screenshot")) return { type: "SCREENSHOT", expectExif: false };
  if (lower.includes("catalog")) return { type: "CATALOG", expectExif: false };
  if (lower.startsWith("img_") || lower.includes("photo")) return { type: "REAL PHOTO", expectExif: true };
  return { type: "UNKNOWN", expectExif: null };
}

async function checkExif(filePath) {
  const buffer = fs.readFileSync(filePath);

  // Full EXIF parse
  let fullExif = null;
  try {
    fullExif = await exifr.parse(buffer);
  } catch {}

  // Specific checks
  let orientation = null;
  try {
    orientation = await exifr.orientation(buffer);
  } catch {}

  let gps = null;
  try {
    gps = await exifr.gps(buffer);
  } catch {}

  const hasExif = fullExif !== null && fullExif !== undefined;

  // Extract key fields if present
  const fields = {};
  if (hasExif && fullExif) {
    if (fullExif.Make) fields.make = fullExif.Make;
    if (fullExif.Model) fields.model = fullExif.Model;
    if (fullExif.DateTimeOriginal) fields.dateTime = fullExif.DateTimeOriginal;
    if (fullExif.Software) fields.software = fullExif.Software;
    if (fullExif.ImageWidth) fields.width = fullExif.ImageWidth;
    if (fullExif.ImageHeight) fields.height = fullExif.ImageHeight;
    if (fullExif.ExifImageWidth) fields.exifWidth = fullExif.ExifImageWidth;
    if (fullExif.ExifImageHeight) fields.exifHeight = fullExif.ExifImageHeight;
    if (fullExif.ColorSpace) fields.colorSpace = fullExif.ColorSpace;
    if (fullExif.LensModel) fields.lens = fullExif.LensModel;
  }

  return { hasExif, orientation, gps, fields, tagCount: hasExif ? Object.keys(fullExif).length : 0 };
}

async function main() {
  const files = fs.readdirSync(TEST_DIR).filter((f) => !f.startsWith(".")).sort();

  console.log(`\n${"=".repeat(70)}`);
  console.log(`  EXIF METADATA DETECTION TEST`);
  console.log(`  Library: exifr`);
  console.log(`  Images: ${files.length} in .test_img/`);
  console.log(`${"=".repeat(70)}\n`);

  const results = [];

  for (const file of files) {
    const filePath = path.join(TEST_DIR, file);
    const { type, expectExif } = getExpectedType(file);
    const fileSize = (fs.statSync(filePath).size / 1024).toFixed(0);

    console.log(`${"─".repeat(70)}`);
    console.log(`  FILE: ${file}`);
    console.log(`  Expected: ${type} (EXIF: ${expectExif === null ? "unknown" : expectExif ? "yes" : "no"}) | Size: ${fileSize} KB`);

    try {
      const result = await checkExif(filePath);

      console.log(`\n  EXIF PRESENT: ${result.hasExif}`);
      console.log(`  TAG COUNT:    ${result.tagCount}`);
      console.log(`  ORIENTATION:  ${result.orientation ?? "none"}`);
      console.log(`  GPS:          ${result.gps ? `${result.gps.latitude}, ${result.gps.longitude}` : "none"}`);

      if (Object.keys(result.fields).length > 0) {
        console.log(`  KEY FIELDS:`);
        for (const [key, val] of Object.entries(result.fields)) {
          console.log(`    ${key}: ${val instanceof Date ? val.toISOString() : val}`);
        }
      }

      const correct =
        expectExif === null ? null :
        expectExif === result.hasExif;

      console.log(`\n  VERDICT: ${correct === null ? "N/A" : correct ? "PASS" : "FAIL"}`);

      results.push({ file, type, expectExif, hasExif: result.hasExif, correct, tagCount: result.tagCount, gps: !!result.gps, fields: result.fields });
    } catch (err) {
      console.log(`  ERROR: ${err.message}`);
      results.push({ file, type, expectExif, error: err.message });
    }

    console.log();
  }

  // Summary
  console.log(`${"=".repeat(70)}`);
  console.log(`  SUMMARY`);
  console.log(`${"=".repeat(70)}\n`);

  const testable = results.filter((r) => r.correct !== null && r.correct !== undefined);
  const passes = testable.filter((r) => r.correct).length;

  console.log(`  EXIF detection: ${passes}/${testable.length} correct\n`);

  for (const r of results) {
    const status = r.correct === null ? "N/A " : r.correct ? "PASS" : "FAIL";
    const exif = r.hasExif ? `YES (${r.tagCount} tags)` : "NO";
    console.log(`    ${r.file.padEnd(30)} expected:${(r.expectExif === null ? "?" : r.expectExif ? "yes" : "no").padEnd(4)} actual:${exif.padEnd(16)} ${status}`);
  }

  console.log(`\n${"=".repeat(70)}\n`);
}

main().catch(console.error);
