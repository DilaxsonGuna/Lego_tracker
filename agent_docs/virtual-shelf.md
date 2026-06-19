# Virtual Shelf — 3D Collection Display (Moat Feature)

> **Status:** Planned. Build after current in-flight work is finished.
> **Goal:** A 3D room where the user's collection sits as box-art boxes on shelves they can
> orbit, zoom, and curate. The emotional payoff of _displaying_ a collection — the thing
> spreadsheet competitors (Brickset, Rebrickable, BrickEconomy) cannot do.

## Why this is the moat

Collecting is about display and showing off. Every competitor is a spreadsheet with thumbnails.
The Virtual Shelf makes the collection _feel_ owned: a personal, screenshot-able room. It is the
retention driver (you return to curate it) and feeds the social/profile features already built.

Companion feature (later, for virality): **Brick Mountain** — total `numParts` rendered as a
growing pile of bricks. Cheap to build, very shareable. Out of scope for v1 but share the same
renderer wrapper.

## Tech decision

- **Three.js** (not raw WebGL) via **`@react-three/fiber`** (r3f) + **`@react-three/drei`** helpers.
- Rationale: r3f makes 3D objects React components and fits the existing Next.js/React 19 app. The
  pure scene logic (`lib/shelf/`) is plain Three.js + math, so it ports across web, WebView, and
  (with caveats — see Mobile reuse) native. **drei** is a must-have: it ships ready-made
  `<OrbitControls>`, `<Detailed>` (LOD), `<Bounds>`, loaders, and `useTexture`/`useGLTF.preload()`,
  saving large amounts of boilerplate.

> **Next.js gotcha (verified):** the `<Canvas>` component must be `'use client'` **and** imported
> via `next/dynamic` with `{ ssr: false }`, or you get hydration errors — Three.js cannot run
> during server rendering. This is the standard, documented r3f + App Router pattern.
>
> ```tsx
> // app/(app)/shelf/page.tsx (server) renders a client wrapper:
> import dynamic from "next/dynamic";
> const ShelfCanvas = dynamic(() => import("@/components/shelf/shelf-canvas"), { ssr: false });
> ```

## Cross-platform architecture (CRITICAL — build this way from day one)

The single most important rule: **keep the scene as platform-agnostic data + builder functions,
separated from the React/renderer glue.** This is what makes the mobile app inherit ~70–85% of the work.

```
lib/shelf/                      # PURE — no React, no DOM, no Next.js. Reusable on web + native.
  layout.ts                     # buildShelfLayout(sets, opts) -> ShelfLayout (positions, slots, ghosts)
  scene-model.ts                # types: BoxSpec, ShelfSpec, ShelfLayout (plain data)
  textures.ts                   # box-art URL -> texture descriptor (platform loads it)
  grouping.ts                   # sort/group by theme, favorites, year (reuse VaultSortOption logic)

components/shelf/               # WEB glue (r3f). Mirror later in mobile app with expo-three.
  shelf-canvas.tsx              # <Canvas> wrapper, lights, camera, OrbitControls
  set-box.tsx                   # one box mesh; front face = setImgUrl texture
  shelf-rack.tsx                # the wood shelf planes
  shelf-scene.tsx              # consumes ShelfLayout, maps to <SetBox/> + <ShelfRack/>
  shelf-controls.tsx           # UI overlay: sort, group, zoom, screenshot

app/(app)/shelf/                # new sidebar page (use /new-page conventions)
  page.tsx                      # server: fetch vault sets, pass to client scene
  actions.ts                    # (later) persist custom box arrangement
```

Platform split:

- **Shared (web + native):** everything in `lib/shelf/` — layout math, grouping, specs.
- **Web-only:** `components/shelf/*` (r3f `<Canvas>`, mouse OrbitControls).
- **Mobile (future):** WebView-first (reuse the web glue as-is) or, with caveats, native
  `expo-gl`/`expo-three` components. Either way they consume the same `ShelfLayout`, so only the thin
  renderer + input layer changes. See **Mobile reuse summary** for the 2026 reality check.

## Data mapping (no schema change needed for MVP)

Source: `VaultSet` (`types/vault.ts`) via `lib/queries/vault.ts`.

| VaultSet field   | Shelf use                                                                        |
| ---------------- | -------------------------------------------------------------------------------- |
| `setImgUrl`      | Texture on the box front face                                                    |
| `collectionType` | `collection` -> solid box · `wishlist` -> ghost/outline box (empty slot to fill) |
| `isFavorite`     | Subtle highlight / spotlight / front-row placement                               |
| `themeName`      | Group into shelves / color-code by theme                                         |
| `numParts`       | Box depth/size scaling (bigger set = chunkier box)                               |
| `name`, `setNum` | Hover/tap label, click-through to set detail                                     |

Box geometry: a simple `BoxGeometry` with the official box image mapped to the front face looks
great and is cheap — **do NOT model every set in 3D for v1.** Per-set 3D models are a far-future v3.

## Build phases

### Phase 0 — Spike (½–1 day)

- `npm i three @react-three/fiber @react-three/drei`
- One `<Canvas>` with a single rotating box textured with a real `setImgUrl`. Confirm textures load.
- **CORS reality check (gates everything):** WebGL textures are subject to cross-origin rules. Setting
  `crossOrigin` on the loader (drei's `useTexture` / `THREE.TextureLoader`) only makes the browser
  _send_ a CORS request — it does **not** bypass anything. The image host (Rebrickable's
  `cdn.rebrickable.com`) **must** return `Access-Control-Allow-Origin`. If it doesn't, the texture
  silently fails / taints the canvas (also breaks the Phase 2 screenshot export). Mitigation if
  blocked: proxy/cache set images through your own domain or Supabase Storage and serve them with
  permissive CORS headers — decide this in Phase 0, it shapes the whole data path.

### Phase 1 — Static shelf MVP (2–4 days)

- `buildShelfLayout(sets)` → grid of boxes on 2–3 wood shelves.
- OrbitControls (rotate/zoom/pan). Solid boxes for collection, ghost boxes for wishlist.
- Click a box → navigate to existing set detail page.
- New `/shelf` sidebar page fed by the vault query.

### Phase 2 — Curation + polish (3–5 days)

- Sort/group controls (reuse `VaultSortOption`): by theme, favorites-first, year, size.
- Favorite spotlight, theme color-coding, hover labels, ambient lighting pass.
- "Download screenshot" button (canvas → PNG) for sharing → ties into social/share features.

### Phase 3 — Persisted arrangement (optional)

- Let users drag boxes; persist positions. New table e.g. `shelf_layouts(user_id, set_num, x, y, shelf, rot)`
  with RLS (own-rows-only, like all user tables). Use `/db-migrate`.

## Performance budget (design for mobile from day one)

Target: **100 visible boxes at 60fps on a mid-range Android.** Concrete, research-backed rules:

- **Draw calls — keep under ~100/frame.** Each separately-textured box is its own draw call, so a
  naive 200-box collection tanks. The big lever is **`InstancedMesh`**: one geometry + material drawn
  once for all instances (real demos cut 9,000 → 300 draw calls, or 1,000 boxes → 1 draw call).
  Caveat: instancing shares one material, so per-box _front-face art_ needs a **texture atlas** (pack
  many box images into one texture, offset UVs per instance) — otherwise fall back to a small number
  of shared materials and accept a few hundred draw calls.
- **Textures are the real memory cost.** A 200KB PNG can occupy **20MB+ of GPU memory uncompressed**.
  Rules: size textures to **powers of two** (256/512/1024), prefer **KTX2/Basis compression** (~10×
  VRAM reduction; UASTC for quality, ETC1S for size), and **cap concurrent texture loads** for big
  collections. Lazy-load box art as it scrolls into view (IntersectionObserver / drei `<Bounds>`).
- **`frameloop="demand"` on `<Canvas>`.** The shelf is static between interactions — render on demand
  and call `invalidate()` only when something changes, instead of burning 60fps forever. Huge battery
  win on mobile.
- **Limit DPR:** `<Canvas dpr={[1, 2]}>` (or pin to 1 on low-end) — uncapped devicePixelRatio on
  retina/phone screens quadruples fragment work.
- **LOD:** drei `<Detailed>` — distant boxes drop to flat sprites/lower geometry.
- **Dispose on unmount:** `geometry.dispose()`, `material.dispose()`, `texture.dispose()`; watch
  `renderer.info.memory` for leaks. r3f disposes automatically for declarative objects, but anything
  you create imperatively (manual `TextureLoader`, atlases) you must dispose yourself.
- **Virtualize huge collections (>200 sets):** only build boxes for what the camera can see.
- Lazy-load the whole 3D bundle with `next/dynamic` (`ssr: false`) so it never blocks first paint.

## Mobile reuse summary (REVISED after research — read this before betting on native)

The pure `lib/shelf/` layer ports everywhere; what differs is the renderer. **As of 2026 the native
r3f story is genuinely rough**, so the recommendation has changed:

- **Recommended path — WebView.** Render the existing web shelf inside a React Native WebView
  (`react-native-webview`) or an Expo Router DOM component (`'use dom'`). ~100% reuse, ships with the
  web feature, no native-3D dependency hell. Slightly lower perf and a JS-bridge boundary, but for a
  static shelf that's fine. **This is the pragmatic default.**
- **Native path — `expo-gl` + `expo-three` (caution).** Renders the same `lib/shelf/` layout on a real
  GPU surface (~70–85% shared; rewrite only renderer wrapper + touch gestures). **But:** pmndrs marks
  React Native support as community-maintained/spare-time, and there is a **persistent `expo-gl`
  version mismatch** (r3f has historically pinned older `expo-gl` while recent Expo SDKs ship newer
  ones, e.g. SDK 53 `expo-gl@15` vs r3f's `@11`), which has **broken builds on real devices**
  through 2025–2026. iOS Simulator / Android emulator also don't render EXGL well — you must test on
  physical devices. If you go native: pin exact `expo` + `expo-gl` + `three` + r3f versions known to
  work together, and budget time for dependency debugging.
- **Verdict:** build web first; ship mobile via WebView; only invest in native r3f if the WebView
  perf proves inadequate AND the version situation has stabilized. Either way, keeping `lib/shelf/`
  pure is what protects the investment — the renderer is replaceable, the layout logic isn't.

## Open questions / risks

- Image host CORS for WebGL textures (verify before Phase 0 — gates everything).
- Bundle size of three.js (~150KB+ gzipped) — mitigate with dynamic import / route-level code split.
- Box-art-on-box vs. true 3D models — v1 uses box-art; revisit only if it underwhelms.
- Whether `/shelf` is its own page or a view-mode toggle inside `/vault` (lean: separate page first).

## References (consulted 2026-06)

- [r3f — Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) — `frameloop="demand"`, DPR, instancing.
- [r3f — Installation (native notes)](https://r3f.docs.pmnd.rs/getting-started/installation)
- [Codrops — Building Efficient Three.js Scenes (2025)](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/)
- [100 Three.js Tips That Actually Improve Performance (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips) — draw-call/texture/KTX2 numbers.
- [Three.js with Next.js Integration Guide (2026)](https://threejsresources.com/frameworks/three-js-nextjs) — dynamic import / `ssr:false` pattern.
- [three.js forum — TextureLoader & CORS](https://discourse.threejs.org/t/textureloader-with-external-image-link-cors/2343)
- [expo-three (npm)](https://www.npmjs.com/package/expo-three) + [pmndrs/react-three-fiber #3517 "React Native no longer supported"](https://github.com/pmndrs/react-three-fiber/issues/3517) — native caveats / expo-gl mismatch.
- Inspiration: [Bruno Simon's portfolio](https://bruno-simon.com), [Awwwards Three.js gallery](https://www.awwwards.com/websites/three-js/).
