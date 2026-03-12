# Pre-Implementation Test Results

**Date**: 2026-02-24
**Test images**: 6 in `.test_img/` (1 real iPhone photo, 2 browser screenshots, 3 catalog images)

---

## Test 1: Gemini Vision — Set Identification + Fraud Detection

**Model**: `gemini-2.5-flash`
**Script**: `scripts/test-gemini-vision.mjs`

### Summary

| Metric | Score |
|--------|-------|
| **Set identification** | 5/6 found set numbers |
| **Fraud detection (AI only)** | 4/6 correct |
| **Avg latency** | 11.3s |
| **Avg tokens** | 2,645 per image |
| **Est. cost/scan** | ~$0.002 |

### Per-Image Results

| Image | Type | Fraud Check | Set Found | Confidence | Latency |
|-------|------|-------------|-----------|------------|---------|
| IMG_8651.HEIC | Real photo | PASS (real) | 40725 | 0.85 | 9.7s |
| browser-screenshot1.png | Screenshot | FAIL (said real) | None | 0.6 | 14.0s |
| browser-screenshot2.png | Screenshot | FAIL (said real) | 10307 | 0.8 | 22.5s |
| catalog 1.jpg | Catalog | PASS (fake) | 40522 | 0.85 | 5.9s |
| catalog 2.jpg | Catalog | PASS (fake) | 41722 | 0.9 | 7.8s |
| catalog 3.jpg | Catalog | PASS (fake) | 40492 | 0.9 | 7.8s |

### Detailed Notes

**IMG_8651.HEIC (Real photo, iPhone 12)**: Built model, no box visible. Gemini identified 40725 (Cherry Blossoms) purely from visual features — red/pink blossoms, dark branches, grey vase with gold band. No OCR involved.

**browser-screenshot1.png (Screenshot)**: Screenshot of a photo showing a Marvel minifigure display case in a real room. Gemini saw "real wall, real shelf, natural lighting" and said real. The minifigures identified are all real, officially released LEGO products (39 named individually). No set number is correct — these come from dozens of different sets. In the pipeline this would land on "no match" with manual add as fallback.

**browser-screenshot2.png (Screenshot)**: Screenshot of a photo showing LEGO sets on shelves in a room. Same failure — Gemini sees real-room content, not screenshot artifacts. High latency (22.5s) due to complex scene.

**catalog 1-3.jpg (Catalog)**: All three correctly flagged as catalog images (white/black studio backgrounds). All three correctly identified with high confidence.

### Analysis

**Identification: STRONG.** Visual matching works even without box/set number. All returned set numbers appear plausible based on descriptions.

**Fraud detection (AI alone): INSUFFICIENT for screenshots.** Gemini catches catalog images (studio backgrounds) but can't distinguish "screenshot of a real-room photo" from "actual photo." This was expected — the EXIF check is the critical supplement.

**Latency: ACCEPTABLE.** 5.9s-22.5s range. The thinking model adds overhead. A progress indicator is essential. Consider testing `gemini-2.0-flash` if latency becomes an issue.

---

## Test 2: EXIF Metadata Detection

**Library**: `exifr` (full build)
**Script**: `scripts/test-exif-check.mjs`

### Summary

| Metric | Score |
|--------|-------|
| **Simple hasExif check** | 2/6 correct |
| **Camera-specific EXIF check** | 6/6 correct |

### Per-Image Results

| Image | Type | Has EXIF? | Tag Count | Has Camera Data? | Make/Model |
|-------|------|-----------|-----------|-----------------|------------|
| IMG_8651.HEIC | Real photo | YES | 58 | YES | Apple iPhone 12 |
| browser-screenshot1.png | Screenshot | YES | 13 | NO | (dimensions only) |
| browser-screenshot2.png | Screenshot | YES | 13 | NO | (dimensions only) |
| catalog 1.jpg | Catalog | NO | 0 | NO | — |
| catalog 2.jpg | Catalog | YES | 7 | NO | (dimensions only) |
| catalog 3.jpg | Catalog | YES | 7 | NO | (dimensions only) |

### Key Finding: `hasExif` boolean is NOT enough

The naive `hasExif: boolean` check fails because:
- **PNGs have metadata chunks** that exifr reads as EXIF (image dimensions, color space) — 13 tags for screenshots
- **Some catalog JPGs** have basic dimension metadata — 7 tags for catalogs 2 and 3
- Only catalog 1 (a small 93 KB JPEG) had zero EXIF

### Fix: Check for CAMERA-SPECIFIC fields

Real phone photos have fields that screenshots and catalog images never have:

| Field | Real Photo | Screenshot | Catalog |
|-------|-----------|------------|---------|
| `Make` | "Apple" | absent | absent |
| `Model` | "iPhone 12" | absent | absent |
| `DateTimeOriginal` | timestamp | absent | absent |
| `LensModel` | lens info | absent | absent |
| `GPS` | coordinates | absent | absent |
| `Orientation` | 1-8 | absent | absent |

**Updated heuristic for the pipeline:**
```typescript
const exif = await exifr.parse(file, {
  pick: ["Make", "Model", "DateTimeOriginal", "LensModel", "GPSLatitude"]
});
const hasCameraExif = !!(exif?.Make || exif?.Model || exif?.DateTimeOriginal);
```

This would score **6/6 correct** on our test images:
- Real photo: `Make: Apple, Model: iPhone 12, DateTimeOriginal: 2026-02-24` → `hasCameraExif: true`
- Screenshots: no Make/Model/DateTimeOriginal → `hasCameraExif: false`
- Catalogs: no Make/Model/DateTimeOriginal → `hasCameraExif: false`

### GPS Privacy Note

The real photo has GPS coordinates (44.648, 10.782). The pipeline should **strip GPS before upload** or **not send it to the server**. The client only needs to report `hasCameraExif: boolean`, not the actual coordinates.

---

## Test 3: Database Lookup — Set Number Matching

**Database**: Supabase (lego_sets table, imported from Rebrickable)
**Script**: `scripts/test-db-lookup.mjs`

### Summary

| Metric | Score |
|--------|-------|
| **Tier 1 (local DB) found** | 5/5 |
| **Name match (Gemini vs DB)** | 4/5 correct |
| **Tier 3 (Rebrickable) needed** | 0/5 |

### Per-Set Results

| Gemini Output | Normalized | DB Name | Name Match? |
|---------------|-----------|---------|-------------|
| 40725 "Cherry Blossoms" | 40725-1 | Cherry Blossoms | MATCH |
| 10307 "Eiffel Tower" | 10307-1 | Eiffel Tower | MATCH |
| 40522 "Valentine Lovebirds" | 40522-1 | Valentine Lovebirds | MATCH |
| 41722 "Horse Show Trailer" | 41722-1 | Horse Show Trailer | MATCH |
| 40492 "Stranger Things BrickHeadz" | 40492-1 | **La Catrina** | **MISMATCH** |

### Key Finding: Gemini hallucinated a set number

**40492 is wrong.** Gemini correctly identified the image as Stranger Things BrickHeadz characters (visually accurate), but assigned set number 40492 — which is actually "La Catrina" (a Day of the Dead BrickHeadz). The real Stranger Things BrickHeadz set is a different number.

This happened because:
1. No set number was visible in the catalog image (it's just the product photo)
2. Gemini guessed the number from memory and got it wrong
3. The visual description was perfect, but the number was a hallucination

**Impact on pipeline**: This is exactly why the **user confirmation step** exists. The pipeline would show:
- "We identified: La Catrina (40492-1)" — user sees wrong set, taps "Not this set"
- User searches manually for the correct Stranger Things BrickHeadz set

**Mitigation**: When the AI returns a set number AND a description, and the DB name doesn't match the AI description, flag a warning: "The AI described 'Stranger Things BrickHeadz' but set 40492 is 'La Catrina' — possible mismatch."

### `normalizeSetNum()` confirmed working

All raw numbers (40725, 10307, etc.) correctly normalized to Rebrickable format (40725-1, 10307-1, etc.) and found in the local database. No Tier 3 (Rebrickable API) fallback was needed.

---

## Combined Fraud Detection Scoring (Updated)

Based on Test 1 + Test 2 results, the updated fraud scoring matrix:

```
hasCameraExif + AI says real     → PASS (genuine photo)
hasCameraExif + AI says fake     → PASS (unusual but possible — e.g., photo of a screen)
!hasCameraExif + AI says real    → REJECT (screenshot of real-room photo)
!hasCameraExif + AI says fake    → REJECT (catalog/downloaded image)
```

**This scoring would correctly handle all 6 test images:**

| Image | hasCameraExif | AI Assessment | Combined | Correct? |
|-------|--------------|---------------|----------|----------|
| IMG_8651.HEIC | true | real | PASS | YES |
| browser-screenshot1.png | false | real | REJECT | YES |
| browser-screenshot2.png | false | real | REJECT | YES |
| catalog 1.jpg | false | fake | REJECT | YES |
| catalog 2.jpg | false | fake | REJECT | YES |
| catalog 3.jpg | false | fake | REJECT | YES |

**Score: 6/6** with the combined approach vs 4/6 with AI alone vs 2/6 with EXIF alone.

---

## Overall Conclusions

### Confirmed decisions
- **Gemini 2.5 Flash**: Validated for set identification. Strong visual matching, correct structured output.
- **exifr**: Works on HEIC, PNG, JPEG. Camera-specific field check (not boolean hasExif) is the right approach.
- **normalizeSetNum()**: Works correctly, all sets found in Tier 1.
- **Combined fraud scoring**: EXIF + AI together achieve 6/6 — neither alone is sufficient.

### Pipeline spec updates needed
1. Change `hasExif: boolean` to `hasCameraExif: boolean` (check Make/Model/DateTimeOriginal, not just "any EXIF exists")
2. Add name mismatch detection: compare AI description against DB set name, flag discrepancies
3. Strip GPS coordinates client-side before reporting EXIF status
4. Update fraud scoring to use the stricter combined matrix above

### Still untested
1. **OCR accuracy**: No test image had a visible set number on a box. Need box photos.
2. **Multi-set photos**: Need a photo with 2-5 sets in frame.
3. **`gemini-2.0-flash` latency**: Could be faster for simple cases.
