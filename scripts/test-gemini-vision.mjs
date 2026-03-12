/**
 * Test script: Validate Gemini 2.5 Flash for LEGO set identification
 *
 * Tests:
 * 1. OCR accuracy — can it read set numbers from box photos?
 * 2. Fraud detection — can it distinguish real photos from catalog/screenshots?
 * 3. Identification quality — confidence, theme, description
 *
 * Usage:
 *   GOOGLE_AI_API_KEY=your-key node scripts/test-gemini-vision.mjs
 *   or: add GOOGLE_AI_API_KEY to .env, then: node scripts/test-gemini-vision.mjs
 */

import fs from "node:fs";
import path from "node:path";

// ── Config ──────────────────────────────────────────────────

// Try loading from .env file
function loadEnvKey() {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    const content = fs.readFileSync(envPath, "utf-8");
    const match = content.match(/^GOOGLE_AI_API_KEY=(.+)$/m);
    if (match) return match[1].trim();
  } catch {}
  return null;
}

const API_KEY = process.env.GOOGLE_AI_API_KEY || loadEnvKey();
if (!API_KEY) {
  console.error("Missing GOOGLE_AI_API_KEY. Set it in .env or pass as env var.");
  process.exit(1);
}

const MODEL = "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
const TEST_DIR = path.resolve(process.cwd(), ".test_img");

// ── Prompt (same as pipeline spec) ──────────────────────────

const IDENTIFICATION_PROMPT = `You are a LEGO set identification expert. Analyze this image carefully.

## PHOTO AUTHENTICITY CHECK
First, determine if this is a REAL photograph taken by the user:
- Real photos have: natural lighting, real-world backgrounds, perspective distortion,
  sometimes hands/surfaces visible, floor/table/shelf surfaces
- Downloaded/fake images show: perfect studio lighting, white backgrounds, promotional
  angles, screenshot borders, screen pixels, moire patterns
- Set is_real_photo to false if this looks like a catalog image, screenshot, or stock photo

## SET IDENTIFICATION
Look for these identifiers (in order of reliability):
1. SET NUMBERS: Check the box top, side panels, instruction booklet, or any printed
   text. LEGO set numbers are 4-6 digits, sometimes followed by "-1"
2. SET NAME: Read any text on the box or packaging
3. THEME: Identify from branding, color schemes, and subject matter
   (Star Wars, Technic, City, Creator, etc.)
4. VISUAL FEATURES: Distinctive elements — minifigures, unique pieces, the built
   model's shape and color
5. PIECE COUNT: If visible on the box, note the count

## MULTIPLE SETS
If multiple LEGO sets are visible in the image, identify each one separately.
List all set numbers found.

## CONFIDENCE GUIDELINES
- Set number clearly readable: 0.9-1.0
- Box art visible, can identify by visual match: 0.7-0.9
- Built model visible, can identify by features: 0.5-0.7
- Partial view, uncertain identification: 0.3-0.5
- Cannot identify or not a LEGO set: 0.0-0.3

Use the identify_lego_set function to return your findings.`;

// ── Tool definition ─────────────────────────────────────────

const TOOL_DECLARATION = {
  functionDeclarations: [
    {
      name: "identify_lego_set",
      description: "Extract LEGO set information from the image",
      parameters: {
        type: "OBJECT",
        properties: {
          set_numbers: {
            type: "ARRAY",
            items: { type: "STRING" },
            description:
              "LEGO set numbers visible (e.g., '75375', '75375-1')",
          },
          description: {
            type: "STRING",
            description: "Visual description of the LEGO set(s)",
          },
          theme: {
            type: "STRING",
            description: "LEGO theme (Star Wars, Technic, City, etc.)",
          },
          estimated_parts: {
            type: "NUMBER",
            description: "Estimated piece count if visible",
          },
          minifigures: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "Descriptions of visible minifigures",
          },
          confidence: {
            type: "NUMBER",
            description: "Identification confidence, 0.0 to 1.0",
          },
          is_real_photo: {
            type: "BOOLEAN",
            description:
              "true if real photo, false if screenshot/catalog/stock",
          },
          photo_assessment: {
            type: "STRING",
            description: "Why you think this is/isn't a real photo",
          },
          reasoning: {
            type: "STRING",
            description: "How you identified this set",
          },
        },
        required: [
          "set_numbers",
          "description",
          "confidence",
          "is_real_photo",
          "photo_assessment",
          "reasoning",
        ],
      },
    },
  ],
};

// ── Helpers ──────────────────────────────────────────────────

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".heic": "image/heic",
    ".heif": "image/heif",
  };
  return map[ext] || "application/octet-stream";
}

function getImageType(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes("screenshot")) return "SCREENSHOT";
  if (lower.includes("catalog")) return "CATALOG";
  if (lower.startsWith("img_") || lower.includes("photo")) return "REAL PHOTO";
  return "UNKNOWN";
}

async function analyzeImage(filePath) {
  const filename = path.basename(filePath);
  const mimeType = getMimeType(filePath);
  const base64 = fs.readFileSync(filePath).toString("base64");

  const body = {
    contents: [
      {
        parts: [
          { inlineData: { mimeType, data: base64 } },
          { text: IDENTIFICATION_PROMPT },
        ],
      },
    ],
    tools: [TOOL_DECLARATION],
    toolConfig: {
      functionCallingConfig: {
        mode: "ANY",
        allowedFunctionNames: ["identify_lego_set"],
      },
    },
  };

  const start = performance.now();
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const elapsed = ((performance.now() - start) / 1000).toFixed(1);

  if (!response.ok) {
    const error = await response.text();
    return { filename, error: `HTTP ${response.status}: ${error}`, elapsed };
  }

  const data = await response.json();

  // Extract function call result
  const candidate = data.candidates?.[0];
  const parts = candidate?.content?.parts || [];
  const fnCall = parts.find((p) => p.functionCall);

  if (!fnCall) {
    return {
      filename,
      error: "No function call in response",
      rawParts: parts,
      elapsed,
    };
  }

  // Token usage
  const usage = data.usageMetadata;

  return {
    filename,
    result: fnCall.functionCall.args,
    tokens: {
      input: usage?.promptTokenCount,
      output: usage?.candidatesTokenCount,
      total: usage?.totalTokenCount,
    },
    elapsed,
  };
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  const files = fs
    .readdirSync(TEST_DIR)
    .filter((f) => !f.startsWith("."))
    .sort();

  console.log(`\n${"=".repeat(70)}`);
  console.log(`  GEMINI 2.5 FLASH — LEGO SET IDENTIFICATION TEST`);
  console.log(`  Model: ${MODEL}`);
  console.log(`  Images: ${files.length} in .test_img/`);
  console.log(`${"=".repeat(70)}\n`);

  const results = [];

  for (const file of files) {
    const filePath = path.join(TEST_DIR, file);
    const imageType = getImageType(file);
    const fileSize = (fs.statSync(filePath).size / 1024).toFixed(0);

    console.log(`\n${"─".repeat(70)}`);
    console.log(`  FILE: ${file}`);
    console.log(`  Type: ${imageType} | Size: ${fileSize} KB | MIME: ${getMimeType(filePath)}`);
    console.log(`${"─".repeat(70)}`);

    try {
      const analysis = await analyzeImage(filePath);

      if (analysis.error) {
        console.log(`  ERROR: ${analysis.error}`);
        results.push({ file, imageType, pass: false, error: analysis.error });
        continue;
      }

      const r = analysis.result;
      const tokens = analysis.tokens;

      // Display results
      console.log(`\n  FRAUD CHECK:`);
      console.log(`    is_real_photo: ${r.is_real_photo}`);
      console.log(`    assessment:    ${r.photo_assessment}`);

      console.log(`\n  IDENTIFICATION:`);
      console.log(`    set_numbers:   ${JSON.stringify(r.set_numbers)}`);
      console.log(`    description:   ${r.description}`);
      console.log(`    theme:         ${r.theme || "—"}`);
      console.log(`    parts:         ${r.estimated_parts || "—"}`);
      console.log(`    minifigures:   ${JSON.stringify(r.minifigures || [])}`);
      console.log(`    confidence:    ${r.confidence}`);
      console.log(`    reasoning:     ${r.reasoning}`);

      console.log(`\n  METRICS:`);
      console.log(`    latency:       ${analysis.elapsed}s`);
      console.log(`    tokens:        ${tokens.input} in / ${tokens.output} out / ${tokens.total} total`);

      // Evaluate pass/fail
      const fraudCorrect =
        (imageType === "REAL PHOTO" && r.is_real_photo === true) ||
        (imageType === "SCREENSHOT" && r.is_real_photo === false) ||
        (imageType === "CATALOG" && r.is_real_photo === false);

      const hasSetNumbers = r.set_numbers && r.set_numbers.length > 0;

      console.log(`\n  VERDICT:`);
      console.log(
        `    fraud detection: ${fraudCorrect ? "PASS" : "FAIL"} (expected ${imageType === "REAL PHOTO" ? "real" : "fake"}, got ${r.is_real_photo ? "real" : "fake"})`
      );
      console.log(
        `    set identified:  ${hasSetNumbers ? "PASS" : "FAIL"} (${r.set_numbers?.join(", ") || "none found"})`
      );

      results.push({
        file,
        imageType,
        fraudCorrect,
        hasSetNumbers,
        setNumbers: r.set_numbers,
        confidence: r.confidence,
        isRealPhoto: r.is_real_photo,
        latency: analysis.elapsed,
        tokens: tokens.total,
      });
    } catch (err) {
      console.log(`  ERROR: ${err.message}`);
      results.push({ file, imageType, pass: false, error: err.message });
    }
  }

  // ── Summary ──────────────────────────────────────────────

  console.log(`\n\n${"=".repeat(70)}`);
  console.log(`  SUMMARY`);
  console.log(`${"=".repeat(70)}\n`);

  const total = results.length;
  const fraudPasses = results.filter((r) => r.fraudCorrect).length;
  const idPasses = results.filter((r) => r.hasSetNumbers).length;
  const avgLatency = (
    results.reduce((sum, r) => sum + (parseFloat(r.latency) || 0), 0) / total
  ).toFixed(1);
  const avgTokens = Math.round(
    results.reduce((sum, r) => sum + (r.tokens || 0), 0) / total
  );

  console.log(`  Fraud detection:  ${fraudPasses}/${total} correct`);
  console.log(`  Set identified:   ${idPasses}/${total} found set numbers`);
  console.log(`  Avg latency:      ${avgLatency}s`);
  console.log(`  Avg tokens:       ${avgTokens} per image`);
  console.log(`  Est. cost/scan:   ~$${((avgTokens * 0.15) / 1_000_000 + (avgTokens * 0.6) / 1_000_000).toFixed(5)}`);

  console.log(`\n  Per-image breakdown:`);
  for (const r of results) {
    const fraud = r.fraudCorrect ? "OK" : "FAIL";
    const id = r.hasSetNumbers ? r.setNumbers.join(",") : "none";
    console.log(
      `    ${r.file.padEnd(30)} fraud:${fraud.padEnd(5)} sets:${id.padEnd(15)} conf:${r.confidence ?? "—"} ${r.latency ?? "—"}s`
    );
  }

  console.log(`\n${"=".repeat(70)}\n`);
}

main().catch(console.error);
