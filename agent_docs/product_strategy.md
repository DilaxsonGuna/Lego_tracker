# LegoFlex Product Strategy & Competitive Analysis

> Generated 2026-03-23 from full codebase audit + competitive research.

---

## 1. Competitive Landscape

### Competitor Feature Matrix

| Feature | Brickset | Rebrickable | BrickEconomy | brickd | LegoFlex |
|---------|----------|-------------|--------------|--------|----------|
| Set collection tracking | Yes | Yes | Yes | Yes | **Yes** |
| Wishlist | Yes | Yes | No | Yes | **Yes** |
| Part-level inventory | Yes | **Yes (best)** | No | No | No |
| Minifigure tracking | Yes | Yes | No | No | No |
| Price/value tracking | Yes (basic) | No | **Yes (best)** | No | Partial (schema exists, no data) |
| Market value forecasting | No | No | **Yes (Pro)** | No | No |
| Theme/year charts | Yes (basic bar) | No | Yes | No | **Yes (4 chart types, free)** |
| Collection analytics | Basic | No | Pro-gated | No | **Yes (KPIs + charts, free)** |
| Social graph (follow) | No | No | No | Yes | **Yes** |
| Activity feed | No | No | No | Yes | **Yes** |
| Follow suggestions algo | No | No | No | No | **Yes (unique)** |
| Collection overlap score | No | No | No | No | **Yes (unique)** |
| Mutual followers | No | No | No | No | **Yes (unique)** |
| Social proof on sets | No | No | No | No | **Yes (unique)** |
| Gamification (ranks) | No | No | No | Badges | **Yes (Brick Score + 5 tiers)** |
| Leaderboard | No | No | No | No | **Yes** |
| Milestone celebrations | No | No | No | No | **Yes (confetti + share)** |
| CSV/data export | Yes | Yes | No | No | No |
| Barcode/photo scanning | No | No | No | No | Planned (T-060) |
| Mobile app (native) | Via 3rd party | No | No | Yes | No (responsive web) |
| Import from other tools | No | **Yes (best)** | No | No | No |
| Change log / history | No | **Yes** | No | No | No |
| Set reviews/ratings | Yes | No | No | No | No |
| Building instructions | No | **Yes** | No | No | No |
| Retirement date tracking | No | No | Yes | No | No |
| Public API | Yes | **Yes** | No | No | No |

### Competitor Positioning Summary

- **Brickset**: The encyclopedia. Largest database, set reviews, basic collection management. No social. Feels like a reference site, not a product.
- **Rebrickable**: The parts expert. Best for MOC builders and part-level inventory. Import/export interop. Zero social or gamification.
- **BrickEconomy**: The investor tool. Best price tracking and market forecasting. Pro-gated analytics. No community.
- **brickd**: The closest social competitor. Has chat, virtual build events, badges. But limited analytics, newer, smaller user base.
- **LegoFlex**: The social collector. Strongest social graph features (follow suggestions, overlap scores, mutual followers, social proof). Free analytics. Gamification with rank tiers + leaderboard. Weakest on data breadth (no parts, no minifigs, no import).

---

## 2. What LegoFlex Already Does That Competitors Don't

### Verified in Code (all shipped and functional)

| Feature | Code Location | Status |
|---------|--------------|--------|
| Follow suggestions algorithm (friends-of-friends x3 + shared themes x2 scoring) | `lib/queries/social.ts:getSuggestedUsers` | **Shipped** |
| Collection overlap score (Jaccard similarity between two users) | `lib/queries/social.ts:getCollectionOverlap`, `components/social/collection-overlap.tsx` | **Shipped** |
| Mutual followers on profile pages ("Followed by X, Y you follow") | `lib/queries/social.ts:getMutualFollowers`, `components/social/mutual-followers.tsx` | **Shipped** |
| Social proof on set pages ("X, Y you follow own this set") | `lib/queries/social.ts:getFollowersWhoOwnSet`, `components/social/social-proof-badge.tsx`, rendered in `app/(app)/set/[setNum]/page.tsx` | **Shipped** |
| Brick Score gamification (pieces x1 + sets x100, 5 rank tiers) | `lib/brick-score.ts`, `lib/commands/user-stats.ts` | **Shipped** |
| Rank progress tracking (% to next tier, pieces/sets needed) | `lib/brick-score.ts:calculateRankProgress` | **Shipped** |
| Global leaderboard with position tracking | `lib/queries/leaderboard.ts`, `app/(app)/leaderboard/page.tsx` | **Shipped** |
| Milestone celebration modals with confetti + Web Share API | `components/profile/milestone-celebration.tsx` | **Shipped** |
| Milestone vault (badge collection display) | `components/profile/milestone-vault.tsx` | **Shipped** |
| Collection analytics dashboard (4 chart types, KPIs, notable sets) | `lib/queries/analytics.ts`, `components/analytics/*`, `app/(app)/vault/analytics/page.tsx` | **Shipped** |
| Following activity feed on dashboard | `lib/queries/home.ts:getFollowingActivity`, `components/home/following-activity.tsx` | **Shipped** |
| Cursor-based paginated follow lists with search | `lib/queries/social.ts:getFollowersPaginated`, `components/social/follow-list.tsx` | **Shipped** |
| Denormalized follower/following counts via PostgreSQL triggers | `profiles.follower_count`, `profiles.following_count` (migration 014) | **Shipped** |

**Bottom line**: LegoFlex has the most advanced social features of any LEGO collection tracker. No competitor offers follow suggestions, collection overlap, social proof on sets, or a gamified leaderboard. The analytics dashboard is free where BrickEconomy charges.

---

## 3. What's Missing for Launch (Table Stakes)

### Critical Gaps vs. Competitor Minimum

| Gap | Why It's Table Stakes | Competitors That Have It | Impact on Adoption |
|-----|----------------------|--------------------------|-------------------|
| **Price data** (T-030) | "#1 requested feature across all personas." Collection value is the primary reason people track sets. Showing $0 undermines credibility. | Brickset, BrickEconomy | **Blocker** -- users will leave immediately without value data |
| **CSV export** (T-036) | Serious collectors maintain spreadsheets. No export = data hostage anxiety. Rebrickable users won't migrate without it. | Brickset, Rebrickable | **High friction** -- prevents power user adoption |
| **Import from Brickset/Rebrickable** | Nobody wants to re-enter 200 sets manually. Migration path is essential for switching costs. | Rebrickable (imports from Brickset, BrickLink, BrickOwl) | **Blocker** -- no existing collector will switch without import |
| **Search/browse UX** (barcode scan or faster add) | Users complain about friction adding sets. Current flow: Explore -> search -> find set -> add. Competitors offer barcode scan or quick-add. | BrickSearch, brickd | **High friction** -- daily use pain point |
| **Privacy policy** (T-070) | Legal requirement for any app collecting user data. EU users = GDPR. Dead link currently exists. | All competitors | **Legal blocker** |
| **Error visibility** (T-043) | Query failures show empty states. Users think they have no sets when DB times out. | N/A (quality issue) | **Trust destroyer** -- silent data loss appearance |
| **Monitoring** (T-041) | Zero production error visibility. Cannot diagnose issues reported by users. | N/A (operational) | **Operational blocker** |

### Nice-to-Have Before Launch (Not Blockers)

| Gap | Notes |
|-----|-------|
| Part-level inventory | Only Rebrickable does this well. Not expected from a social tracker. |
| Minifigure tracking | Differentiator for Brickset but not table stakes for set collectors. |
| Set reviews/ratings | Brickset territory. Not aligned with social positioning. |
| Building instructions | Rebrickable territory. Not aligned with collection focus. |
| Native mobile app | Responsive web is acceptable for launch. PWA (T-063) covers the gap. |

---

## 4. Feature Prioritization Matrix

### Impact x Effort x Differentiation

| Task | Feature | Impact (1-5) | Effort (1-5) | Differentiation (1-5) | Priority Score | Current Priority |
|------|---------|:---:|:---:|:---:|:---:|:---:|
| T-030 | Price data integration | 5 | 4 | 2 | **8.3** | P3 |
| T-070 | Privacy policy + GDPR | 5 | 2 | 1 | **8.0** | P7 |
| T-041 | Monitoring (Sentry) | 4 | 2 | 1 | **6.0** | P4 |
| T-043 | Error logging in queries | 4 | 1 | 1 | **6.7** | P4 |
| NEW | CSV import from Brickset/Rebrickable | 5 | 3 | 2 | **8.0** | Not planned |
| T-036 | CSV/PDF export | 4 | 2 | 1 | **6.0** | P3 |
| T-065 | Landing page + SEO | 5 | 3 | 3 | **8.3** | P6 |
| T-040 | robots.txt + sitemap | 3 | 1 | 1 | **5.0** | P4 |
| T-071 | Trademark risk evaluation | 4 | 1 | 1 | **6.7** | P7 |
| T-072 | Remove DOB from onboarding | 3 | 1 | 1 | **5.0** | P7 |
| T-060 | AI set verification (Scan) | 4 | 5 | 5 | **8.0** | P6 |
| T-062 | Theme completion tracking | 4 | 2 | 5 | **8.3** | P6 |
| T-050 | PostHog analytics | 4 | 3 | 1 | **5.3** | P5 |
| T-051 | WAC metric tracking | 3 | 2 | 1 | **4.0** | P5 |
| T-061 | Pro tier (monetization) | 3 | 4 | 2 | **4.3** | P6 |
| T-063 | PWA support | 3 | 2 | 2 | **5.0** | P6 |
| T-064 | Email notifications | 3 | 3 | 2 | **4.7** | P6 |
| T-081 | Bottom mobile nav bar | 3 | 2 | 1 | **4.7** | Backlog |
| T-080 | Avatar image upload | 2 | 2 | 1 | **3.3** | Backlog |
| T-088 | CI/CD pipeline | 4 | 2 | 1 | **6.0** | Backlog |
| T-086 | "Year in Bricks" recap | 3 | 4 | 5 | **6.7** | Backlog |
| T-085 | Referral program | 2 | 3 | 2 | **3.3** | Backlog |
| T-042 | Parallelize vault queries | 2 | 2 | 1 | **3.3** | P4 |

> **Priority Score** = (Impact x 2 + Differentiation) / (Effort x 0.5 + 1), normalized. Higher = do first.

---

## 5. Killer Feature Identification

### The "Tell a Friend" Feature: Theme Completion Tracking (T-062)

**"You own 42 of 87 Star Wars sets (48%)"**

Why this is the killer feature:

1. **No competitor offers it.** Brickset shows how many sets exist in a theme. Rebrickable tracks parts. Nobody combines "your sets" with "all sets in theme" into a completion percentage.

2. **It triggers the completionist psychology.** LEGO collectors are, by nature, completionists. Showing 48% completion on their favorite theme creates an irresistible urge to reach 50%, then 75%, then 100%.

3. **It's inherently shareable.** "I'm 73% complete on my Harry Potter collection" is a sentence someone would post on Reddit, Twitter, or a LEGO forum. It's a brag, a flex, and a conversation starter.

4. **It drives purchases.** Unlike price tracking (which serves existing inventory), completion tracking actively suggests what to buy next. This creates a natural "missing sets" wishlist.

5. **It's low effort to build.** The data already exists: `user_sets` has the user's collection, `lego_sets` has all sets with `theme_id`. It's a GROUP BY + COUNT query and a progress bar UI.

6. **It compounds with existing social features.** "Alice is 89% complete on Star Wars. You're at 48%." Combined with the leaderboard, this creates theme-specific competition.

### Runner-Up: AI Set Verification / Photo Scan (T-060)

The "point your camera at a LEGO set and instantly add it" flow is magical and demo-worthy. However, it's high-effort (5/5) and depends on Gemini API costs. Best positioned as the Month 2-3 "wow factor" feature after the foundation is solid.

---

## 6. Task List Audit: Reprioritization Recommendations

### Tasks That Should Be Higher Priority

| Task | Current | Recommended | Rationale |
|------|---------|-------------|-----------|
| T-070 (Privacy + GDPR) | P7 | **P1** | Legal blocker. Cannot launch publicly without a privacy policy. Dead link is actively harmful. |
| T-071 (Trademark risk) | P7 | **P1** | "LegoFlex" contains LEGO trademark. A cease-and-desist on day 1 kills the project. Evaluate before investing more. |
| T-072 (Remove DOB) | P7 | **P1** | GDPR violation. Collecting DOB without purpose = legal exposure. 5-minute fix. |
| T-065 (Landing page) | P6 | **P2** | Without a landing page, there's no way to acquire users. SEO takes months to compound; start now. |
| T-030 (Price data) | P3 | **P1** | Collection value is the #1 reason people use trackers. Without it, the vault feels hollow. |
| T-088 (CI/CD) | Backlog | **P2** | 271 tests exist but don't run automatically. PRs could break the build undetected. |
| T-062 (Theme completion) | P6 | **P2** | Killer differentiator. Low effort, high impact. Ship before Pro tier. |
| NEW (CSV import) | Not planned | **P1** | Without import, no existing collector will switch. This is a migration-path blocker. |

### Tasks That Can Be Deprioritized

| Task | Current | Recommended | Rationale |
|------|---------|-------------|-----------|
| T-042 (Parallelize vault queries) | P4 | **P5** | 200-400ms savings. Real, but not user-facing. Optimize after launch. |
| T-061 (Pro tier) | P6 | **P7** | Monetization before product-market fit is premature. Need WAC data first. |
| T-085 (Referral program) | Backlog | **Backlog (keep)** | Referrals only work with a product people love. Ship core features first. |
| T-064 (Email notifications) | P6 | **P6 (keep)** | Nice retention tool but not urgent pre-launch. |

---

## 7. MVP Definition: Minimum Viable Launch

### Must-Have for Public Launch

These are the features that must work on day 1 for users to take LegoFlex seriously:

| Category | Feature | Status |
|----------|---------|--------|
| **Collection** | Add/remove sets to collection + wishlist | Done |
| **Collection** | Search and browse sets (by theme, name, popularity) | Done |
| **Collection** | Vault with grid/list view, sort, search, theme filter | Done |
| **Collection** | Set detail page with stats and related sets | Done |
| **Social** | Follow/unfollow users | Done |
| **Social** | Activity feed (what friends are adding) | Done |
| **Social** | Follow suggestions | Done |
| **Social** | Public profiles with follower/following lists | Done |
| **Gamification** | Brick Score + rank tiers | Done |
| **Gamification** | Leaderboard | Done |
| **Gamification** | Milestone celebrations | Done |
| **Analytics** | Collection analytics dashboard (themes, years, growth, KPIs) | Done |
| **Auth** | Sign up, login, password reset, onboarding | Done |
| **Settings** | Edit profile, theme preferences, privacy toggle | Done |
| **Data** | Price data on sets (at minimum retail price) | **Not done (T-030)** |
| **Data** | CSV import from Brickset/Rebrickable | **Not planned** |
| **Legal** | Privacy policy page | **Not done (T-070)** |
| **Legal** | Trademark disclaimer | **Not done (T-071)** |
| **Legal** | Remove DOB or justify it | **Not done (T-072)** |
| **Infra** | Error monitoring (Sentry) | **Not done (T-041)** |
| **Infra** | Error logging in queries | **Not done (T-043)** |
| **Infra** | CI/CD (tests on PR) | **Not done (T-088)** |
| **Growth** | Landing page with email capture | **Not done (T-065)** |
| **SEO** | robots.txt + sitemap | **Not done (T-040)** |

### MVP Readiness Score: 60%

The product's social and gamification features are complete and differentiated. The gaps are in data (price), legal (privacy/trademark), infrastructure (monitoring/CI), and growth (landing page/import). These are all solvable in 4-6 weeks of focused work.

---

## 8. Roadmap Recommendation

### Month 1: "Launch-Ready" (Weeks 1-4)

**Goal**: Remove all blockers for a soft launch to 50-100 users.

| Week | Tasks | Rationale |
|------|-------|-----------|
| Week 1 | T-071 (trademark evaluation), T-072 (remove DOB), T-043 (error logging), T-040 (SEO basics) | Quick wins. Legal safety. Operational foundation. |
| Week 2 | T-070 (privacy policy + GDPR), T-088 (CI/CD pipeline), T-041 (Sentry monitoring) | Legal compliance. Quality gates. Production visibility. |
| Week 3 | T-030 (price data -- Rebrickable API integration, retail prices) | Table stakes feature. Collection value display. |
| Week 4 | NEW: CSV import (Brickset format first, then Rebrickable), T-036 (CSV export) | Migration path for existing collectors. Data portability. |

**Soft launch milestone**: Invite 50 LEGO community members from Reddit r/lego and r/legomarket.

### Month 2-3: "Differentiate & Grow" (Weeks 5-12)

**Goal**: Ship killer features, start organic growth, measure retention.

| Week | Tasks | Rationale |
|------|-------|-----------|
| Week 5-6 | T-062 (theme completion tracking) | Killer differentiator. Low effort, high viral potential. |
| Week 7-8 | T-065 (landing page + email capture), T-050 (PostHog analytics) | Growth engine. Measurement infrastructure. |
| Week 9-10 | T-060 (AI set verification / photo scan) | "Wow factor" feature. Demo-worthy. PR-worthy. |
| Week 11-12 | T-063 (PWA), T-081 (bottom mobile nav) | Mobile experience polish for the 70%+ mobile audience. |

**Growth milestone**: 500 registered users, 20% WAC (Weekly Active Collectors).

### Month 4-6: "Monetize & Scale" (Weeks 13-24)

**Goal**: Introduce Pro tier, build retention loops, prepare for scale.

| Phase | Tasks | Rationale |
|-------|-------|-----------|
| Month 4 | T-051 (WAC metric), T-061 (Pro tier with Stripe), T-064 (email notifications) | Revenue. Retention loops. Data-driven decisions. |
| Month 5 | T-086 ("Year in Bricks" annual recap -- start building for December), T-080 (avatar upload) | Viral mechanic. Social polish. |
| Month 6 | T-085 (referral program), T-042 (vault query optimization), scale infrastructure | Growth loop. Performance at scale. |

**Revenue milestone**: 3-5% Pro conversion rate. Target $1.5K MRR by Month 6.

---

## 9. Strategic Positioning Statement

**LegoFlex is the only LEGO collection tracker built for collectors who want to connect, not just catalog.**

While Brickset is an encyclopedia, Rebrickable is a parts database, and BrickEconomy is an investment tool, LegoFlex is the social layer that makes collecting fun. Follow friends, see what they're building, compete on the leaderboard, celebrate milestones together, and discover sets through your network -- not just a search bar.

### Key Messaging Pillars

1. **"See what your friends are building"** -- Activity feed, social proof on sets
2. **"Know your rank"** -- Brick Score, leaderboard, milestone celebrations
3. **"Understand your collection"** -- Free analytics (where competitors charge)
4. **"Complete the theme"** -- Theme completion tracking (unique to LegoFlex)

### Target Personas (in priority order)

1. **The Social Collector** (primary): Owns 20-100 sets. Active on Reddit/Discord LEGO communities. Wants to show off and compare collections with friends. Motivated by social validation.
2. **The Completionist** (secondary): Owns 50-300 sets. Focuses on 2-3 themes. Wants to track progress toward completing a theme. Motivated by completion percentage.
3. **The Casual Tracker** (tertiary): Owns 5-20 sets. Just wants a simple list of what they have. Motivated by organization.

### What LegoFlex Is NOT

- Not a parts database (Rebrickable owns that)
- Not an investment tool (BrickEconomy owns that)
- Not an encyclopedia (Brickset owns that)
- Not a marketplace (BrickLink owns that)

---

## 10. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|:---:|:---:|------------|
| LEGO trademark cease-and-desist on "LegoFlex" name | High | Critical | Evaluate immediately (T-071). Prepare backup names. Add disclaimer. |
| Price data API costs / reliability | Medium | High | Start with Rebrickable free tier. Cache aggressively. Fall back to manual data. |
| No users switch due to missing import | High | High | Build CSV import before public launch. Support Brickset format first (largest user base). |
| brickd catches up on social features | Low | Medium | LegoFlex's social features are deeper (overlap scores, suggestions algo). Ship theme completion + scan to widen the moat. |
| Mobile experience too limited without native app | Medium | Medium | PWA (T-063) + bottom nav (T-081) cover 90% of the gap. Revisit native if WAC > 5K. |

---

_Last updated: 2026-03-23_
