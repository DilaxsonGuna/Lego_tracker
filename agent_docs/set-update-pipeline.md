# Image Verification Pipeline for LEGO Set Collection

## Goal

Replace "Add to Collection" with a photo verification pipeline. Users photograph their LEGO sets, the system verifies it's a real photo, identifies the set(s) via AI, and adds to collection. Wishlist remains manual.

---

## Flow

### Step 0: Client-Side Prep (browser, before upload)

1. User takes/selects photo (1-5 sets per photo)
2. `exifr` reads camera-specific EXIF fields (`Make`, `Model`, `DateTimeOriginal`)
   - `hasCameraExif = true` if any camera field exists
   - PNGs and catalog JPGs have dimension metadata that looks like EXIF — only camera fields count
   - GPS coordinates are read but NOT sent to server (privacy)
3. Canvas API resizes to max 1600px, JPEG 85%, applies orientation correction
4. Result: clean JPEG blob (~500KB-1.5MB) + `hasCameraExif: boolean`

### Step 1: Upload (client -> Supabase Storage, bypasses Vercel)

1. Client requests a signed upload URL from server action
2. Client uploads JPEG directly to Supabase Storage at `{user_id}/{uuid}.jpg`
   - Why presigned: Vercel has a 4.5MB body limit. Image never touches Vercel.
3. Client calls `POST /api/verify-set` with `{ storagePath, hasCameraExif, setNum? }`

### Step 2: Fraud Detection (server)

Two signals combined — neither alone is sufficient (tested 6/6 correct combined, 4/6 AI-only, 2/6 EXIF-only):

| hasCameraExif | AI says | Result |
|--------------|---------|--------|
| true | real | PASS |
| true | fake | PASS (edge case — photo of a screen) |
| false | real | REJECT (screenshot of real-room photo) |
| false | fake | REJECT (catalog / downloaded image) |

If rejected → update record `status: 'rejected'`, return "Photo Issue" to user.

### Step 3: AI Identification (server, single Gemini 2.5 Flash call)

One API call does both fraud assessment + set identification via structured output (function calling).

AI returns per image:
- `set_numbers[]` — set numbers it found (OCR from box or guessed from visual)
- `description` — what it sees ("red/pink blossoms, dark branches, grey vase")
- `theme` — Star Wars, Technic, City, etc.
- `confidence` — 0.0 to 1.0
- `is_real_photo` — fraud signal
- `reasoning` — how it identified the set

Two identification paths:
- **Path 1 (OCR)**: AI reads printed set number from box → high confidence (0.9-1.0)
- **Path 2 (visual)**: No number visible, AI matches visual features from training data → medium confidence (0.5-0.9). Can hallucinate wrong set numbers.

### Step 4: Database Matching (server, 3-tier cascade)

For each set number the AI returned:

**Tier 1**: Direct lookup → `lego_sets WHERE set_num = '{number}-1'`
- If found, compare DB name vs AI description
- If names align → **confirmed match** (green card)
- If names DON'T align → **hallucinated number** (yellow card, see Step 5)

**Tier 2**: Fuzzy search (only if Tier 1 found nothing)
- Use AI's description/theme as keywords → existing `search_sets` RPC
- Return top 3 results as suggestions

**Tier 3**: Rebrickable API (only if Tier 1 had a number but it wasn't in local DB)
- Fetch set metadata from Rebrickable → upsert into `lego_sets` → return match

### Step 5: Results UI (client)

Photo displayed at top. Below it, each detected set shown as a card in one of three states:

**Confirmed match** (number + DB match + names align):
```
[x] Cherry Blossoms #40725-1
    430 pcs | 2024 | Botanical
    Confidence: 85%              [Add]
```
User taps "Add" → `addUserSet()` with `verificationId`.

**Fuzzy match** (AI described it correctly but number wrong or missing):
```
[?] "Stranger Things BrickHeadz"
    Couldn't match exactly.
    Did you mean:
    > 40581 BrickHeadz Eleven & Demogorgon
    > 40560 BrickHeadz ...
    > [Search manually]
```
Auto-triggered when: AI returns a set number, DB lookup finds it, but DB name doesn't match AI description. Falls back to fuzzy search using the AI description.

**Manual search** (AI found nothing, or user says "Not this set"):
```
Missing a set? [Search & Add Manually]
```
Opens existing set search UI. Selected set linked to same `verificationId`.

### Step 6: Confirmation (client -> server)

For each set the user confirms:
1. `addUserSet(setNum, 1, "collection", verificationId)` — requires `verificationId` for collection adds
2. Verification record updated to `status: 'confirmed'`
3. `recalculateUserStats()` runs automatically

---

## Entry Points

| From | Action | URL |
|------|--------|-----|
| Nav bar / mobile bottom nav | "Scan" button | `/scan` |
| Explore card | Camera icon (replaces old Plus button) | `/scan?setNum=75375` |
| Set detail page | "Verify & Add" button | `/scan?setNum=75375` |
| Vault wishlist | "Move to Collection" | `/scan?setNum=75375&fromWishlist=true` |

When `setNum` is provided, the AI prompt changes to: "Verify that this photo shows set #75375-1 (Millennium Falcon)". UI shows focused confirmation instead of open identification.

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| AI can't identify | "No match" screen → "Search & Add Manually" + "Try Again" |
| AI misses 1 of 3 sets | User adds detected ones, searches for missed one manually (same verificationId) |
| AI returns wrong set number | Name mismatch detected → auto-fuzzy-search using AI description → user picks correct one |
| Multiple sets in one photo | AI identifies each, UI shows checkable list, all linked to same verification record |
| Set not in local DB but number is valid | Rebrickable API fetch → upsert into `lego_sets` → add to collection |
| Low confidence (< 0.3) | "No confident match found" with manual add |
| Low confidence (0.3-0.5) | Show results with warning banner |
| Not a LEGO set | AI returns confidence ~0 → "Doesn't appear to be a LEGO set" |
| User already owns the set | Check `user_sets` before confirm → "Already in collection" |
| Screenshot of a real-room photo | `hasCameraExif: false` + AI says "real" → REJECT |
| Catalog image with studio background | AI catches it (white/black bg) → REJECT |
| HEIC from iPhone | `accept` attribute excludes `image/heic` → iOS auto-converts to JPEG |
| HEIC slips through | Detect `file.type`, show "Please re-select from Photos app" |
| Image too large after resize | Canvas API keeps output at ~500KB-1.5MB, well under 4.5MB Vercel limit |
| Gemini API timeout (>30s) | Retry once, then show error with "Try Again" |
| Supabase upload failure | Show error, don't create verification record |
| Rebrickable API down | Silently skip Tier 3 (non-critical) |
| Rate limiting | Max 10/hour, 50/day per user (count recent `set_verifications` records) |

---

## Architecture Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Vision AI | Gemini 2.5 Flash (`gemini-2.5-flash`) | 30x cheaper than Claude, 1-2s latency, free dev tier, structured output |
| Backend | Next.js API Route on Vercel | Same codebase, free Hobby plan, 300s timeout, no CPU limit |
| Upload | Presigned URL → Supabase Storage | Bypasses Vercel 4.5MB body limit |
| EXIF | `exifr` mini (~9 kB), client-side | Check camera fields only (Make/Model/DateTimeOriginal), not raw hasExif |
| Image resize | Canvas API, client-side | Zero deps, ~20 lines of code |
| HEIC | Excluded from `accept` attribute | iOS auto-converts; avoids 2.7MB heic2any bundle |
| Perceptual hashing | Skipped for v1 | AI + EXIF combo catches catalog images without it |
| Async processing | Skipped for v1 | Pipeline takes ~10-15s, synchronous with progress stepper is fine |

---

## Cost

| Component | Per scan | 2,000 scans/month |
|-----------|---------|-------------------|
| Gemini 2.5 Flash | ~$0.002 | ~$4 |
| Supabase Storage | — | Free (< 1GB) |
| Rebrickable API | — | Free |
| Vercel Hobby | — | Free |
| **Total** | | **~$4/month** |

---

## Future Enhancements

- Async pipeline with Supabase Realtime notifications
- Bounding box overlays on photo showing where each set was detected
- `gemini-2.0-flash` fast path for simple box-number-visible cases
- Google Cloud Vision OCR pre-step if Gemini OCR proves unreliable on small text
- Verification history in user settings
- Minifigure-level collection tracking (Gemini already identifies individual minifigs)
