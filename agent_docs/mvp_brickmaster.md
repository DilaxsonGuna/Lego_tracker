# BrickMaster — MVP Status & Launch Plan

> **Date:** 2026-06-17
> **Supersedes the MVP definitions in** `release_v1.md` **and** `product_strategy.md` — both predate the competitive analysis below and contradict each other. This is the source of truth.

---

## 0. Strategic context (why this MVP looks the way it does)

The competitor **Brickd** is the only other social LEGO tracker — but it's a **one-person, part-time side project** (Greg Avola, ex-Untappd), ~3,000 users in 2 years, no funding, no word-of-mouth, and its own users call the community **"not overly sociable"** with gamification that **rewards spending, not building**. It already has a web app + public profiles, so "we're the web one" is **not** a moat.

The **value/investment lane is closed** (GameSetBrick, Brickfact, BrickEconomy own price/ROI tracking — and they are _not_ social).

**Our wedge:** the social + community + gamified experience executed _deeply and full-time_, where the incumbent is shallow and distracted. Engagement that rewards **building and connecting**, not buying.

**Therefore this MVP:**

- **KEEPS** everything social/gamified (that's the differentiation — do NOT strip it, contra `release_v1.md`).
- **DOES NOT** gate launch on price data or CSV import (not our headline, contra `product_strategy.md`).
- **ADDS** one new feature — theme completion — because it's social, viral, and cheap.
- **PRIORITIZES** measurement, because the whole launch is a test of whether the social loop fires.

---

## 1. Actual current state (verified in code, 2026-06-17)

### ✅ Done / working

| Area                                                                                                                | Status                                      |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Social graph: follow/unfollow, feed, suggestions, **overlap score**, **mutual followers**, **social proof on sets** | Shipped (this is the moat)                  |
| Gamification: Brick Score, 5 rank tiers, leaderboard, milestone celebrations                                        | Shipped                                     |
| Analytics dashboard (4 charts, KPIs) — free where competitors paywall                                               | Shipped                                     |
| Auth (signup, login, reset, onboarding)                                                                             | Shipped                                     |
| Vault (collection + wishlist, sort, filter, grid/list, bulk)                                                        | Shipped                                     |
| Set detail + browse/search                                                                                          | Shipped                                     |
| Settings (profile, privacy toggle, theme)                                                                           | Shipped                                     |
| **Price data surfaced in UI** (set detail, vault cards/list)                                                        | Shipped _(keep, but not the headline)_      |
| Legal: Privacy policy (133 lines), Terms (111 lines), delete-account flow                                           | Shipped                                     |
| "Not affiliated with LEGO" disclaimer                                                                               | Present (sidebar, settings, privacy, terms) |
| SEO: `robots.ts` + `sitemap.ts`                                                                                     | Shipped                                     |
| Sentry SDK installed (`@sentry/nextjs`) + config files                                                              | Installed (needs DSN to activate)           |

### ⚠️ In progress / incomplete

| Item                       | State                                                                                                                                                                                                                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Rename → "BrickMaster"** | ~90% done. Title is "BrickMaster", name in 16 files. **3 files still say "LegoFlex":** `app/auth/layout.tsx`, `components/shared/sidebar.tsx`, `components/shared/mobile-header.tsx`. Logo file still named `components/shared/legoflex-logo.tsx`. No OG/favicon assets in `app/` root. |

### ❌ Missing

| Item                                   | Note                                                                                           |
| -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **DOB collection** still in onboarding | `app/auth/onboarding/actions.ts:63` writes `date_of_birth`. GDPR exposure — remove or justify. |
| **Product analytics (PostHog)**        | Not installed. Required to measure the social loop.                                            |
| **Theme completion tracking**          | Not built. The one new feature worth adding pre-launch.                                        |
| **CI/CD**                              | No `.github/workflows`. Tests exist but don't run on PRs. Fast-follow, not a launch blocker.   |

---

## 2. The MVP scope (decision)

### KEEP (already built — this IS the product)

Full social layer · Brick Score + leaderboard + milestones · free analytics · vault · auth · settings.

### ADD (one new build)

- **Theme completion tracking** — "You own 42 of 87 Star Wars sets (48%)". `GROUP BY theme` over `user_sets` × `lego_sets` + a progress bar. Social, shareable, completionist-bait, low effort. This is our "tell a friend" feature.

### DEFER (explicitly NOT in this MVP)

- CSV import / export — matters for poaching _existing_ collectors; our first cohort starts fresh. Later.
- Pro tier / monetization — premature before product-market fit.
- AI / photo scanning — high effort; Brickd's is unproven anyway. Month 2–3 "wow" feature.
- Native app — responsive web is fine for launch.
- Further price-data investment — it's surfaced; leave it, don't build more. Not our lane.

---

## 3. What I need to launch — remaining task list

### 🔴 Blockers (must do before any user sees it)

| #   | Task                                                    | Where                                                                                                   | Effort |
| --- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------ |
| 1   | Finish the rename to **BrickMaster**                    | 3 string files above + rename `legoflex-logo.tsx` → `brickmaster-logo.tsx` (+ component name + imports) | 1–2h   |
| 2   | Create OG image + favicon for BrickMaster               | `app/opengraph-image`, `app/icon`, `app/favicon.ico`                                                    | 1h     |
| 3   | Remove DOB from onboarding (or document a real purpose) | `app/auth/onboarding/actions.ts:63` + the onboarding form                                               | 30m    |

### 🟡 Required for validation (the launch is a test — instrument it)

| #   | Task                                               | Why                                                         | Effort |
| --- | -------------------------------------------------- | ----------------------------------------------------------- | ------ |
| 4   | Install + wire **PostHog**                         | Must measure the social loop, not vanity signups            | 2–3h   |
| 5   | Activate **Sentry** (set `NEXT_PUBLIC_SENTRY_DSN`) | SDK is already installed; just needs the DSN + a smoke test | 30m    |

### 🟢 Differentiator (do before the cold-community push, can trail the seed cluster)

| #   | Task                                                               | Effort |
| --- | ------------------------------------------------------------------ | ------ |
| 6   | **Theme completion tracking** (query + progress UI + share string) | ~1 day |

### 🟠 Full UI/UX review + refactor (do before the cold-community push)

**This is strategic, not cosmetic.** Our entire wedge is "the social experience done _well_" — and Brickd's own users say it's **slow** and **"not overly sociable."** Polish, speed, and a UI that actively pulls people into the social loop ARE the differentiation. A rough or confusing UI on a cold-community launch burns a first impression we can't get back.

| #   | Task                                                                                                                                         | Effort      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 7   | **Full UI/UX audit** — heuristic + accessibility pass across every screen (vault, profile, feed, set detail, onboarding, settings, mobile)   | 1–2d        |
| 8   | **UX refactor** — fix the audit findings: visual hierarchy, spacing/consistency, perceived speed, mobile touch targets, empty/loading states | 2–4d        |
| 9   | **Social-loop UX** — make follow / feed / overlap / leaderboard the _obvious_ things to do; reduce friction on the core add-set flow         | (part of 8) |

Scope notes:

- **Mobile-first.** 70%+ of use is mobile and we're responsive web (no native app) — the mobile experience must be genuinely good, not an afterthought.
- **Don't gold-plate before the seed cluster.** The warm circle tolerates rough edges; use their feedback to _target_ the refactor. Full polish lands before the cold push.
- Watch scope creep — this is a focused quality pass, not a redesign. The information architecture stays; we're elevating execution.

### ⚪ Fast-follow (not a launch blocker)

- CI/CD pipeline (run the existing tests on PRs).
- Re-confirm price data has real values loaded (sync script ran).

**Total to a measurable launch: ~1.5–2 focused days** (tasks 1–5) for the seed cluster. Theme completion (~1 day) and the UI/UX review + refactor (~3–6 days) land before the wider cold-community push.

---

## 4. The metrics that decide success

Brickd's flat growth is ambiguous — part-time, or weak demand? Our seed-cluster launch resolves it. **Track engagement, not signups:**

| Metric                                                                                                | What it proves                           |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| **% of seed users who follow ≥1 other user**                                                          | The social graph forms at all            |
| **D7 return rate**                                                                                    | People come back without prompting       |
| **Social interactions / user / week** (feed views, overlap checks, leaderboard visits, profile views) | The loop is _alive_, not a one-time look |
| **Theme-completion shares**                                                                           | The viral mechanic works                 |

> "My co-founder likes it" is **not** a metric. The seed cluster's _behavior_ is.

---

## 5. Launch sequence (ties to the GTM plan)

1. **Finish blockers + instrumentation** (tasks 1–5) → deploy to Vercel.
2. **Tester #1:** co-founder runs usability/bug pass. Exit bar = "not embarrassing, no data loss" — _not_ "stable forever."
3. **Seed cluster (10–30):** co-founder's warm LEGO circle, people who'll follow each other. _This_ tests the loop. Low-stakes, forgiving of rough edges. Ship theme completion in parallel; use their feedback to target the UI/UX refactor.
4. **UI/UX review + refactor (tasks 7–9):** act on the audit + seed-cluster feedback. Get it fast, polished, and social-loop-obvious **before** exposing it to cold communities.
5. **Cold community push:** only after the loop visibly fires _and_ the UX is polished. One first impression per subreddit — make it count. This is the real demand test (warm circle is biased upward).

---

## 6. Open questions / risks

- **Demand risk (the big one):** does any cohort engage _socially_, or just log sets once and leave? If even a warm cluster won't follow/return, reconsider before scaling.
- **Rename completeness:** confirm zero "LegoFlex" strings, assets, and DB/storage references remain before public launch.
- **"BrickMaster" trademark check:** verify it's clear (no LEGO mark; confirm no conflicting registered mark). Backups: BrickVault, StudTracker, SetShelf.
- **Mobile:** Brickd is mobile-native; we're responsive web. Acceptable for launch, but mobile UX must be genuinely good since 70%+ of use is mobile.
