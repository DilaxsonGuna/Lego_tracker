# User Research: LEGO Collection Tracking Apps

> **Date:** March 2026
> **Methodology:** Web research across Reddit, Eurobricks, BrickLink forums, Trustpilot, App Store reviews, LEGO community blogs, and competitor analysis.

---

## Table of Contents

1. [Community Complaints & Wishlists](#1-community-complaints--wishlists)
2. [App Store Reviews — What Users Love and Hate](#2-app-store-reviews)
3. [Top 10 Most-Requested Features](#3-top-10-most-requested-features)
4. [Top 5 Pain Points](#4-top-5-pain-points)
5. [User Personas](#5-user-personas)
6. [Switching Triggers](#6-switching-triggers)
7. [Competitive Landscape](#7-competitive-landscape)
8. [Prioritized Feature Roadmap for LegoFlex](#8-prioritized-feature-roadmap-for-legoflex)

---

## 1. Community Complaints & Wishlists

### Reddit (r/lego, r/legomarket, r/legoinvesting)

**Fragmented tooling is the #1 complaint.** Collectors routinely use 3-4 tools simultaneously: Brickset for set database/news, Rebrickable for parts inventory, BrickLink for pricing, and a separate mobile app for scanning. No single solution covers the full workflow.

Common themes from community discussions:

- **"Why can't one app do everything?"** — Users express frustration at needing Brickset for set data, Rebrickable for parts/MOC building, BrickLink for market prices, and Brickd for social features. They want a unified experience.
- **Value tracking is primitive** — Brickset shows estimated values but they are often outdated. Users want real-time market data like BrickLink prices integrated into their collection view.
- **Social features are an afterthought** — Brickset allows collection sharing via URL, but there is no feed, no discovery, no way to see what friends are collecting. Brickd introduced social features but limits free users to 550 sets.
- **Mobile experience is poor** — Brickset and Rebrickable are desktop-first websites. Mobile apps (myBricks, etc.) are third-party wrappers with inconsistent quality.
- **No retirement alerts** — Users frequently ask when sets are retiring. This data exists (BrickLink, BrickNav) but is not integrated into collection trackers.
- **Data export/import friction** — Switching between platforms requires CSV exports with part numbering mismatches. "Different part number schemes between websites" cause import errors and warnings.

### Eurobricks Forums

- Users discuss inventory software needs, with BrickStock mentioned for serious MOC builders who need spreadsheet-style part tracking.
- Frustration with the LEGO Group's own digital tools — the official LEGO app focuses on instructions and shopping, not collection management.
- Community members want better integration between digital building tools (Studio, LDraw) and collection trackers.

### BrickLink Forums

- Wishlist features exist but are marketplace-focused (price alerts for BrickLink stores), not collection-management-focused.
- Users want to know "what can I build with what I have?" — a feature Rebrickable provides but BrickLink does not.
- Discussion around wanting a unified view: owned sets + their current market value + retirement status.

---

## 2. App Store Reviews

### Brickd (iOS/Android)

**What users love:**
- Clean, modern UI — described as "beautifully designed"
- Social feed showing what friends are building in real-time
- Build Notes with step-by-step progress photos and bag numbers
- Badge/achievement system for completing builds
- Free core features

**What users hate:**
- **550-set limit on free tier** — serious collectors hit this fast
- Limited to sets — no parts-level inventory tracking
- No value/pricing data
- No barcode scanning on all platforms
- No data import from Brickset/Rebrickable (recently added but still limited)

### Tracker for LEGO (iOS)

**What users love:**
- Parts tracking — shows which pieces are missing per set
- Clean search interface

**What users hate:**
- **Aggressive ads and subscription upsells** — "scroll through ads every time" even after paying
- Pricing based on "outdated all-time averages rather than current market value"
- Adding sets is unintuitive — users expect an "Add" button but have to figure out search
- Missing retirement date information (later added after user complaints)

### Brick Search (iOS)

**What users love:**
- Barcode scanning
- Five useful features in one app

**What users hate:**
- **App updates erased entire collections** — catastrophic data loss
- "Severely flawed filtering and searching functionality"
- "Confusing theme organization that makes finding certain items very difficult"
- Monthly subscription pricing model frustrates users who prefer one-time purchase or ads

### omgbricks (iOS)

**What users love:**
- Free with no aggressive paywall
- Retirement date tracking
- Discount/deal notifications
- Simple, fast set addition

**What users hate:**
- Newer app with smaller database
- Limited social features
- No parts-level tracking

### BrickWorth / BrickLens

**What users love:**
- Real-time BrickLink and eBay pricing
- Portfolio value tracking
- Retirement alerts (premium)
- Price alerts at target prices

**What users hate:**
- Premium features behind paywall
- Focused on value, not collection management
- No social features

### Brickset (Website + Third-Party Apps)

**Trustpilot complaints (Dec 2024):**
- "Full of ads with floating videos on top of floating ads, ads on the page, ads on the header and footer"
- Website "completely unusable" when not logged in due to auto-playing video ads
- Spelling errors in database ("seperator" vs "separator") make part searching frustrating
- Scam confusion — third-party sites impersonating Brickset

**What users love:**
- Comprehensive database — the gold standard for set information
- Collection statistics and charts
- Years of historical data
- Active community reviews

**What users hate:**
- Desktop-first, dated UI
- Excessive advertising for non-subscribers
- No real-time market pricing (Amazon affiliate restrictions prevent historical price display)
- Rejected user suggestions for quantity tracking, historical pricing, pre-1990s parts data
- No social/community features beyond basic collection sharing via URL

---

## 3. Top 10 Most-Requested Features

Ranked by frequency and intensity of demand across all sources:

| Rank | Feature | Demand Level | Available Anywhere? |
|------|---------|-------------|-------------------|
| 1 | **Real-time collection value tracking** | Critical | BrickWorth, BrickLens (limited) |
| 2 | **Retirement date alerts** | Critical | omgbricks, BrickWorth Pro, BrickNav |
| 3 | **Barcode/QR scanning for quick add** | High | Brickd, Brick Search, BrickLens |
| 4 | **Price drop & deal alerts** | High | omgbricks, Brickfact, BrickWorth Pro |
| 5 | **Social feed & collection sharing** | High | Brickd only |
| 6 | **Parts-level inventory ("what can I build?")** | High | Rebrickable only |
| 7 | **Unified all-in-one experience** | High | Nobody does this well |
| 8 | **Data import/export (Brickset, Rebrickable, CSV)** | Medium-High | Partial across apps |
| 9 | **Purchase price tracking & ROI calculation** | Medium | BrickWorth (basic) |
| 10 | **Offline access & reliable data persistence** | Medium | Most apps fail at this |

### Notable runner-ups:
- Minifigure collection tracking (separate from sets)
- Custom tags/labels for organization
- Build progress tracking with photos
- Missing parts identification per set
- Price history charts per set
- Condition tracking (new/used/open/sealed)
- Display/storage location tracking
- Insurance documentation support

---

## 4. Top 5 Pain Points

### 1. Tool Fragmentation — "I need 4 apps to do what 1 should"

The LEGO tracking ecosystem is deeply fragmented. A typical serious collector uses:
- **Brickset** for the set database and collection catalog
- **Rebrickable** for parts inventory and MOC building
- **BrickLink** for market pricing and buying/selling
- **A mobile app** (Brickd, omgbricks, etc.) for scanning and on-the-go access

No single tool covers sets + parts + pricing + social. This is the single biggest opportunity for a new entrant.

### 2. Outdated or Missing Pricing Data

Brickset cannot show historical Amazon pricing due to affiliate restrictions. Most apps show "estimated values" based on stale data. Users want real-time BrickLink/eBay market data integrated directly into their collection view, not as a separate tool. The gap between "what I paid" and "what it's worth now" is the killer metric collectors want but rarely get.

### 3. Poor Mobile Experience

Brickset and Rebrickable are desktop websites from the 2010s. Third-party mobile apps (myBricks for Brickset) are wrappers with limited functionality. Native mobile-first experiences like Brickd exist but lack depth. Collectors increasingly manage their hobby on phones — at LEGO stores, at conventions, while browsing — but the best tools are desktop-only.

### 4. No Meaningful Social Features

LEGO collecting is inherently social — people share hauls, compare collections, discuss builds, trade. Yet the major tools treat social as an afterthought:
- Brickset: share collection via URL (no feed, no following, no interaction)
- Rebrickable: MOC sharing but no collection social features
- BrickLink: marketplace interactions only
- Brickd: best social features but limited collection depth

There is no "Instagram for LEGO collectors" that combines robust collection management with social discovery.

### 5. Data Lock-in and Migration Pain

Switching apps is painful. CSV exports have part number mismatches. There is no universal standard for LEGO collection data. Users feel trapped — they have invested years building their catalog on Brickset, and migrating means re-entering hundreds of sets manually or dealing with import errors. This creates reluctance to try new tools even when they are better.

---

## 5. User Personas

### Persona 1: The Casual Collector — "Weekend Builder"

**Demographics:**
- Age: 28-45
- Gender: Skews male but rapidly diversifying (LEGO CEO notes adult demographic is "changing," with significant growth in women builders)
- Income: Middle class ($50K-$90K)
- LEGO spending: $500-$1,500/year
- Collection size: 20-80 sets
- Tech comfort: Uses smartphone apps daily, not a power user

**Goals:**
- Keep a simple record of what they own
- Know what they want to buy next (wishlist)
- Avoid accidentally buying duplicates
- Share collection with friends/family casually
- Find deals on sets they want

**Frustrations with current tools:**
- Brickset/Rebrickable feel overwhelming — too many features, ugly UI
- Most apps require too much manual data entry
- Don't care about parts inventory — just want set-level tracking
- Annoyed by aggressive subscriptions for basic features
- "I just want to scan a box and add it to my list"

**What would make them switch to LegoFlex:**
- Beautiful, simple UI that "just works"
- Barcode scanning with one-tap add
- Clean wishlist with deal alerts
- Shareable collection link to send to family
- Free core experience without ads or paywalls
- 30-second onboarding — scan a few boxes, done

**Quote archetype:** *"I don't need a spreadsheet. I just want a nice app where I can see what I have and what I want."*

---

### Persona 2: The Serious Investor — "Brick Banker"

**Demographics:**
- Age: 30-55
- Gender: Predominantly male
- Income: Upper-middle ($80K-$200K+)
- LEGO spending: $3,000-$20,000+/year
- Collection size: 200-1,000+ sets (many sealed)
- Tech comfort: Power user, uses spreadsheets, tracks ROI

**Goals:**
- Track portfolio value in real-time (like a stock portfolio)
- Monitor retirement dates to buy before EOL
- Calculate ROI per set (purchase price vs. current market value)
- Identify undervalued sets with appreciation potential
- Retired sets average 10-15% annual appreciation; Star Wars UCS sets see 20%+ annual gains
- Maintain records for insurance purposes

**Frustrations with current tools:**
- No app provides real portfolio management — forced to use spreadsheets
- BrickLink has pricing data but no portfolio view
- BrickEconomy is informational, not actionable
- Cannot track purchase price, date, condition, and storage location together
- No alerts for "your collection value changed by X" or "Set Y is about to retire"
- Tax implications of selling are not tracked

**What would make them switch to LegoFlex:**
- Real-time portfolio dashboard with total value, gain/loss, ROI percentages
- Retirement countdown timers with alerts
- Price history charts per set (like stock charts)
- Purchase price input with automatic gain/loss calculation
- "Investment score" per set based on theme, piece count, retirement proximity
- Export for insurance documentation
- Integration with BrickLink pricing API

**Quote archetype:** *"The Brick Bank (10251) went from $170 to $450. I need an app that tracks this like Robinhood tracks stocks."*

---

### Persona 3: The Builder/MOC Creator — "Master Builder"

**Demographics:**
- Age: 25-50
- Gender: Mixed
- Income: Varies widely
- LEGO spending: $1,000-$5,000/year (heavy on individual parts)
- Collection: Measured in parts (10,000-100,000+), not sets
- Tech comfort: High — uses Studio, LDraw, Rebrickable daily

**Goals:**
- Know exactly what parts they have across all sets (even disassembled ones)
- Find MOCs they can build with existing parts
- Identify which parts to buy to complete a MOC design
- Source parts at the best price across BrickLink, BrickOwl, ToyPro
- Share their MOC creations with the community

**Frustrations with current tools:**
- Rebrickable is the only serious parts tracker, but its UI is dated and complex
- Part number mismatches between databases cause inventory errors
- "Adding a new set doesn't show 100%" due to inventory discrepancies
- No good mobile experience for checking parts on-the-go (at stores, conventions)
- Building instructions for MOCs vary wildly in quality
- No integration between digital design tools and physical inventory

**What would make them switch to LegoFlex:**
- Accurate parts-level inventory synced from sets
- "What can I build?" engine (like Rebrickable but better UX)
- Integration with Studio/LDraw for checking parts availability against designs
- MOC gallery with build instructions sharing
- Parts sourcing comparison across multiple stores
- Mobile parts lookup at LEGO stores and conventions

**Quote archetype:** *"I have 47,000 parts across 200 sets. I need to know if I have enough dark bluish gray 1x4 plates before I start a build."*

---

### Persona 4: The Social Collector — "Community Builder"

**Demographics:**
- Age: 22-40
- Gender: Mixed, skewing younger
- Income: Variable ($40K-$100K)
- LEGO spending: $1,000-$4,000/year
- Collection size: 50-300 sets
- Tech comfort: Very high — active on Instagram, Reddit, Discord, TikTok

**Goals:**
- Show off collection to friends and the community
- Discover what other collectors are building and buying
- Find collectors with similar tastes and follow them
- Compare collections, find overlaps, trade wishlists
- Participate in community events, challenges, group builds
- Get recommendations based on what similar collectors own

**Frustrations with current tools:**
- Brickset collection sharing is a static URL — no interaction, no feed
- Brickd has social features but limited collection depth (550 set cap on free tier)
- Reddit/Instagram are great for sharing but have no collection data integration
- No way to discover collectors by theme preference or collection overlap
- No "Spotify Wrapped" style yearly collection summary to share
- Cannot see mutual friends' collections or get social recommendations

**What would make them switch to LegoFlex:**
- Rich social feed with collection updates, haul posts, build progress
- Follower system with mutual friends and collection overlap indicators
- Theme-based discovery — find people who collect what you collect
- Collection comparison tool ("You both own 47 sets, here's what they have that you don't")
- Annual collection recap/wrapped to share on social media
- Community challenges and group events
- Leaderboards that are fun, not just competitive

**Quote archetype:** *"I want to see what my LEGO friends are collecting, discover new sets through people with similar taste, and share my hauls without posting to three different platforms."*

---

## 6. Switching Triggers — What Would Make Users Leave Brickset/Rebrickable

### Immediate switching triggers (high urgency):

1. **Data import that actually works** — One-click import from Brickset/Rebrickable/BrickLink with zero data loss. If migration is painless, the biggest barrier evaporates. Support CSV, Brickset XML, and Rebrickable CSV formats.

2. **Real-time pricing that Brickset legally cannot provide** — Brickset is blocked from showing historical Amazon pricing due to affiliate restrictions. An app that shows BrickLink market values, eBay sold prices, and price trends has an unfair advantage.

3. **Mobile-first beautiful UX** — Brickset looks like a 2012 website. Rebrickable is functional but ugly. A modern, polished app experience is a powerful differentiator for younger collectors entering the hobby.

4. **Social features that actually exist** — Brickset has none. Rebrickable has none. This is a blue ocean. Building real social features (feed, following, sharing, discovery) into a collection tracker would be genuinely new.

### Gradual switching triggers (build over time):

5. **Faster, more accurate database** — Brickset relies on LEGO's published data, which has gaps. Community-maintained corrections and faster new set additions create stickiness.

6. **Free tier that is generous** — Brickd's 550-set limit pushes serious collectors away. A generous free tier with premium features (not core features) behind a paywall earns trust.

7. **Retirement intelligence** — Proactive alerts about sets approaching EOL, combined with value appreciation data, would be a unique value proposition that no current tool nails.

8. **Community and network effects** — Once a user's friends are on the platform, switching becomes the default. Social features create lock-in through network effects rather than data lock-in.

### What will NOT trigger switching:

- Another "database of LEGO sets" — Brickset already does this well enough
- Parts-only tracking without set-level management — too niche
- Paid-only apps with no free tier — the community expects free basics
- Apps without barcode scanning — table stakes in 2026

---

## 7. Competitive Landscape

| App | Strengths | Weaknesses | Threat to LegoFlex |
|-----|-----------|------------|-------------------|
| **Brickset** | Gold-standard database, massive user base, years of data | Dated UI, no social, no real-time pricing, ad-heavy | Low (entrenched but stagnant) |
| **Rebrickable** | Best parts inventory, MOC building, "what can I build" | Complex UI, no social, desktop-only, no pricing | Low (different segment) |
| **Brickd** | Best social features, beautiful UI, build notes, badges | 550-set free limit, no pricing, no parts, limited data | **Medium-High** (closest competitor) |
| **BrickWorth** | Real-time pricing, portfolio tracking, retirement alerts | No social, no collection management depth, premium paywall | Medium (feature overlap) |
| **omgbricks** | Free, retirement dates, deal alerts, simple UX | Small database, no social, no parts, newer app | Low-Medium |
| **BrickLink** | Definitive marketplace pricing, huge catalog | Not a collection tracker, marketplace-focused | Low (different purpose) |
| **BrickEconomy** | Best price history/analytics | Read-only, no collection management | Low (informational only) |

### LegoFlex's Positioning Opportunity

LegoFlex sits at the intersection of **collection management + social + analytics** — a space where no competitor is strong across all three. Brickd is the closest competitor but lacks pricing/analytics depth. The key differentiator is combining social features (which LegoFlex already has: followers, leaderboard, brick score, milestone celebrations) with value tracking and discovery features.

---

## 8. Prioritized Feature Roadmap for LegoFlex

Based on demand intensity, competitive gaps, and alignment with LegoFlex's existing social strengths:

### Tier 1 — High Demand, High Differentiation (Build Next)

| Feature | Why | Effort |
|---------|-----|--------|
| **Collection value dashboard** | #1 most-requested feature; no competitor integrates real-time pricing with social collection management | High |
| **Retirement date tracking + alerts** | #2 most-requested; drives engagement and retention | Medium |
| **Barcode/QR scanning** | Table stakes for mobile-first app; removes friction from set entry | Medium |
| **Data import from Brickset/Rebrickable** | Removes the #1 switching barrier; enables migration from incumbents | Medium |

### Tier 2 — High Demand, Extends Social Moat

| Feature | Why | Effort |
|---------|-----|--------|
| **Collection comparison tool** | "Show me what they have that I don't" — unique social feature | Medium |
| **Price drop / deal alerts** | Drives daily engagement; users check for deals frequently | Medium |
| **Annual collection recap ("Wrapped")** | Viral shareability; drives organic growth | Medium |
| **Theme-based collector discovery** | Find people who collect like you; strengthens network effects | Low-Medium |

### Tier 3 — Medium Demand, Deepens Platform

| Feature | Why | Effort |
|---------|-----|--------|
| **Purchase price + ROI tracking** | Investor persona; differentiates from Brickd | Low-Medium |
| **Condition tracking (sealed/open/used)** | Important for value accuracy and investor persona | Low |
| **Build progress with photos** | Brickd has this; social engagement driver | Medium |
| **Set-level parts checklist** | "Which pieces am I missing?" — useful for used set buyers | Medium |

### Tier 4 — Niche but Valuable

| Feature | Why | Effort |
|---------|-----|--------|
| **Parts-level inventory** | Builder persona; would compete with Rebrickable | Very High |
| **MOC gallery + instructions** | Builder persona; content creation platform | High |
| **Insurance export/documentation** | Investor persona; niche but high-value | Low |
| **Display/storage location tracking** | Organizational feature; low effort, nice-to-have | Low |

---

## Key Insight Summary

1. **The market is fragmented, not saturated.** No tool does everything well. The opportunity is integration, not invention.

2. **Social + pricing is the killer combo.** LegoFlex already has social features (followers, leaderboard, milestones). Adding real-time pricing creates a unique value proposition no competitor offers.

3. **Mobile-first wins.** The AFOL demographic is younger and more diverse than ever. 78% of adult LEGO fans cite stress relief as motivation — they are building on weekends, browsing on phones, and sharing on social media. Desktop-first tools will lose this audience.

4. **Painless migration is the unlock.** Every collector has years of data in Brickset or Rebrickable. One-click import with zero data loss is the single most important feature for user acquisition.

5. **Network effects create the moat.** Once your friends are on LegoFlex, you stay on LegoFlex. Social features are not just nice-to-have — they are the defensible competitive advantage that Brickset and Rebrickable cannot easily replicate.

---

## Sources

- [Brickset User Suggestions (Rejected)](https://brickset.com/suggestions/rejected)
- [Brickset Trustpilot Reviews](https://www.trustpilot.com/review/brickset.com)
- [Rebrickable Collection Management](https://rebrickable.com/help/users-lego/)
- [Rebrickable Forum — Inventory Issues](https://forum.rebrickable.com/t/adding-new-set-doesn-t-equal-100/171510)
- [Brickd Features](https://getbrickd.com/features)
- [BrickWorth Collection Tracker](https://cardworth.app/lego-collection-tracker)
- [omgbricks](https://omgbricks.com/)
- [BrickEconomy Market Values](https://www.brickeconomy.com/)
- [BrickNav Retirement Dates](https://bricknav.com/lego-retirement-dates-and-price-per-piece/)
- [Tracker for LEGO — App Store](https://apps.apple.com/us/app/tracker-for-lego/id1602989062)
- [Brick Search — App Store](https://apps.apple.com/us/app/brick-search-the-lego-set-app/id1317166952)
- [LEGO Adult Demographics — Fortune](https://fortune.com/europe/article/lego-kids-toys-kidults-sales/)
- [LEGO Investing Guide — Cardlines](https://cardlines.com/lego-investing-and-collecting/)
- [LEGO Community — BlockApps](https://blockapps.net/blog/joining-the-lego-community-forums-events-and-social-media/)
- [PersonaBuilder — LEGO Analysis](https://personabuilder.co/demo/brand/lego)
- [Eurobricks — Inventory Software Discussion](https://www.eurobricks.com/forum/index.php?/forums/topic/173893-inventory-software/)
- [Brickd — Importing Collections](https://getbrickd.com/help/importing-your-collection)
- [BrickLens Price Checker](https://www.bricklens.shop/)
