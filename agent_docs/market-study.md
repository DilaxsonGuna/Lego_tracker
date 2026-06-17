# LegoFlex Market Study

> **Unified Executive Report** -- Synthesized from market analysis, user research, product strategy, growth strategy, and community ecosystem research.
>
> **Date:** March 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Key Findings (Top 10 Insights)](#2-key-findings-top-10-insights)
3. [Recommended MVP Feature Set for Launch](#3-recommended-mvp-feature-set-for-launch)
4. [Go-to-Market Strategy (First 90 Days)](#4-go-to-market-strategy-first-90-days)
5. [Risk Assessment](#5-risk-assessment)
6. [Updated Task List Recommendations](#6-updated-task-list-recommendations)

---

## 1. Executive Summary

The LEGO collector market represents a $12.9B primary market growing at 16% year-over-year, with a $705M+ secondary resale economy and an adult (AFOL) segment that now drives 25% of all LEGO revenue -- up from 5% just five years ago. Retired LEGO sets appreciate at 11% annually, outperforming gold, large-cap stocks, and bonds. The collector base is large (estimated 2-5M active AFOLs globally), affluent (55% earn $80K+), and digitally active across Reddit (3.4M+ in LEGO subreddits), YouTube, TikTok, Instagram, and 300+ organized LEGO User Groups worldwide.

Despite this scale, the digital tooling landscape is deeply fragmented. Collectors routinely use 3-4 separate tools: Brickset for the set database, Rebrickable for parts inventory, BrickLink for market pricing, and a mobile app for scanning. No single web-based platform combines collection management, social features, analytics, and gamification. Brickd comes closest on social but is iOS-only and lacks pricing data. BrickEconomy leads on investment analytics but has zero community features. Brickset has the largest database but is ad-heavy with a dated UI and no social layer.

LegoFlex occupies the one gap no competitor has filled: a **web-based social collection tracker** with follow suggestions, collection overlap scoring, mutual followers, social proof on set pages, a gamified leaderboard with Brick Score rankings, milestone celebrations with sharing, and free analytics that competitors charge for. These features are all shipped and functional. The product is 60% launch-ready, with the remaining gaps concentrated in data (price integration), legal compliance (privacy policy, trademark evaluation), infrastructure (monitoring, CI/CD), and growth (landing page, data import).

**Why now:** The AFOL segment is growing faster than any other LEGO demographic. Rebrickable added 500K new users in 2025 alone. BrickLink's suspension of marketplace operations in 35 countries has created user displacement. The comparable app playbook is proven -- Letterboxd grew from 1.8M to 17M users in four years through community-first, shareable-content-driven growth, the exact model LegoFlex is built for.

**Why LegoFlex:** Network effects create the moat. Features can be copied; community cannot. LegoFlex's social graph, once seeded with the right early adopters, becomes self-reinforcing. The first web-based platform to make LEGO collecting a social activity wins.

---

## 2. Key Findings (Top 10 Insights)

### 1. The market is fragmented, not saturated -- integration is the opportunity

Collectors use an average of 3-4 tools simultaneously (Brickset + Rebrickable + BrickLink + a mobile app). No platform unifies set tracking, social features, pricing, and analytics. The #7 most-requested feature across all user research is simply a "unified all-in-one experience" -- and nobody delivers it. LegoFlex does not need to invent new categories; it needs to integrate existing ones under a social layer.

### 2. Social + pricing is the killer combination that no competitor offers

The #1 requested feature is real-time collection value tracking. The #5 is a social feed and collection sharing. No platform combines both. BrickEconomy has pricing but zero social. Brickd has social but zero pricing. LegoFlex already has the deepest social features of any LEGO tracker (follow suggestions, overlap scores, social proof, leaderboard). Adding price data transforms it into the only platform where collectors can see what their collection is worth AND share that with friends.

### 3. The AFOL segment is growing explosively and is digitally native

Adults now represent 25% of LEGO sales (~$3.2B annually), up from 5% five years ago. The core demographic is 25-44 years old, earning $80K+, and active on Reddit, Discord, Instagram, and TikTok. Rebrickable added 500K users in 2025 alone. This audience expects modern, mobile-friendly, social-first digital experiences -- exactly what Brickset and Rebrickable fail to deliver with their desktop-era UIs.

### 4. Painless data migration is the single biggest unlock for user acquisition

Every serious collector has years of data locked in Brickset or Rebrickable. CSV import with zero data loss is the difference between "I'll try it" and "I can't switch." User research ranks this as a top switching trigger, and the product strategy audit identifies it as a launch blocker that is not currently on the task list. Without import, LegoFlex can only acquire new collectors, not convert existing ones.

### 5. Theme completion tracking is the highest-impact, lowest-effort differentiator

No competitor shows "You own 42 of 87 Star Wars sets (48%)." This triggers completionist psychology (the dominant collector motivation), is inherently shareable ("I'm 73% complete on Harry Potter"), drives purchases (natural "missing sets" wishlist), and compounds with LegoFlex's existing social features (theme-specific leaderboards). The data already exists in the database. This is a GROUP BY query and a progress bar.

### 6. Network effects are the only defensible moat -- features alone are not enough

Comparable app studies confirm this: Letterboxd, Goodreads, Strava, and Untappd all grew through community, not features. Brickset has 20+ years of data and still has no social features. Brickd has social features but a small user base. The winning strategy is to seed the right early adopters (Star Wars UCS collectors, modular building collectors, LEGO investors), let them set the culture, and let network effects do the rest.

### 7. The LEGO investment angle is massively underserved and high-value

LEGO sets appreciate at 11% annually post-retirement. Star Wars UCS sets average 15-20%. Modular buildings have produced 2,000%+ returns. The r/legoinvesting subreddit (25K members), Brickpicker forums, and investment-focused YouTubers (Investabrick, Republic Bricks) represent a concentrated, high-value early adopter segment. These users maintain spreadsheets because no tool gives them a portfolio view. A "Robinhood for LEGO" positioning resonates strongly.

### 8. Collection Cards are LegoFlex's primary viral loop -- optimize them ruthlessly

Spotify Wrapped generated 200M+ user engagements in 24 hours and 2.1M social media mentions in 48 hours. LegoFlex's Collection Cards (shareable branded images of collection stats) are the micro-version of this mechanic. Combined with milestone celebrations (already built), "Year in Bricks" annual recap (planned), and an embeddable collection widget (not yet planned), the estimated viral coefficient reaches 0.4-0.7. Optimizing share rates on milestone celebrations from current baseline to 20-35% is the highest-leverage growth action.

### 9. Micro-influencer partnerships are the most cost-effective acquisition channel

LEGO YouTube and TikTok creators with 10K-100K followers have high engagement, authentic collector audiences, and low partnership costs ($100-500 or free Pro access). Channels like Investabrick (~100K subs, investment-focused), Republic Bricks (~400K, Star Wars investment), and @brickcollectorco (~740K TikTok, collection content) are exact-fit audiences. Twenty to thirty micro-influencer partnerships in the first 90 days can generate 500K-2M impressions at near-zero cost.

### 10. Legal risk on the "LegoFlex" name is the single highest-impact threat

LEGO Group aggressively protects its trademark. "LegoFlex" incorporates the LEGO trademark directly. A cease-and-desist on launch day would force an emergency rebrand, losing all SEO equity, brand recognition, and creator partnerships built during pre-launch. This must be evaluated before any public marketing begins. Backup names (BrickVault, BrickFlex, StudTracker) should be prepared now.

---

## 3. Recommended MVP Feature Set for Launch

### Must Have (Launch Blockers)

These features must work on day one for users to take LegoFlex seriously.

| Category         | Feature                                                             | Status           | Rationale                                                                           |
| ---------------- | ------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------- |
| **Collection**   | Add/remove sets, search/browse, vault with sort/filter              | DONE             | Core product loop                                                                   |
| **Social**       | Follow/unfollow, activity feed, follow suggestions, public profiles | DONE             | Primary differentiator                                                              |
| **Gamification** | Brick Score, rank tiers, leaderboard, milestone celebrations        | DONE             | Engagement + viral loops                                                            |
| **Analytics**    | Collection analytics dashboard (themes, years, growth, KPIs)        | DONE             | Free where competitors charge                                                       |
| **Auth**         | Sign up, login, password reset, onboarding                          | DONE             | Table stakes                                                                        |
| **Data**         | Price data on sets (minimum: retail price from Rebrickable API)     | NOT DONE (T-030) | #1 requested feature; without it, collection value shows nothing                    |
| **Data**         | CSV import from Brickset/Rebrickable                                | NOT PLANNED      | Migration path is a launch blocker -- no existing collector will re-enter 200+ sets |
| **Legal**        | Privacy policy page                                                 | NOT DONE (T-070) | Legal requirement; current dead link is actively harmful                            |
| **Legal**        | Trademark disclaimer ("Not affiliated with LEGO Group")             | NOT DONE (T-071) | Protect against cease-and-desist                                                    |
| **Legal**        | Remove DOB from onboarding or justify it                            | NOT DONE (T-072) | GDPR violation; 5-minute fix                                                        |
| **Infra**        | Error logging in queries                                            | NOT DONE (T-043) | Silent failures destroy trust                                                       |
| **Infra**        | Error monitoring (Sentry)                                           | NOT DONE (T-041) | Cannot diagnose production issues                                                   |
| **Infra**        | CI/CD pipeline (tests on PR)                                        | NOT DONE (T-088) | 271 tests exist but do not run automatically                                        |
| **Growth**       | Landing page with value proposition + email capture                 | NOT DONE (T-065) | No acquisition funnel without it                                                    |
| **SEO**          | robots.txt + sitemap.xml                                            | NOT DONE (T-040) | Public profiles and set pages should be indexable                                   |

### Nice to Have (Ship Within 30 Days Post-Launch)

| Category           | Feature                      | Status           | Rationale                                   |
| ------------------ | ---------------------------- | ---------------- | ------------------------------------------- |
| **Differentiator** | Theme completion tracking    | NOT DONE (T-062) | Killer feature, low effort                  |
| **Export**         | CSV/PDF export               | NOT DONE (T-036) | Data portability reduces lock-in anxiety    |
| **Mobile**         | PWA support                  | NOT DONE (T-063) | "Add to Home Screen" for mobile users       |
| **Mobile**         | Bottom navigation bar        | NOT DONE (T-081) | One-tap access to core destinations         |
| **Analytics**      | PostHog event tracking       | NOT DONE (T-050) | Measure activation, retention, virality     |
| **Social**         | Embeddable collection widget | NOT PLANNED      | Goodreads-style distribution via LEGO blogs |

### Not Required for Launch

| Feature                 | Rationale                                                 |
| ----------------------- | --------------------------------------------------------- |
| Parts-level inventory   | Rebrickable owns this; not expected from a social tracker |
| Minifigure tracking     | Differentiator for Brickset, not table stakes             |
| Native mobile app       | Responsive web + PWA is acceptable for v1                 |
| Pro tier / monetization | Premature before product-market fit                       |
| AI set scanning (T-060) | High-effort "wow factor" -- better as Month 2-3 feature   |
| Referral program        | Only works when the product is already loved              |

### MVP Readiness: 60% Complete

The social and gamification features -- LegoFlex's primary differentiators -- are complete. The remaining 40% is concentrated in four areas: data (price + import), legal (privacy + trademark), infrastructure (monitoring + CI), and growth (landing page + SEO). All are solvable in 4-6 weeks of focused work.

**Next steps:** Execute the Month 1 roadmap below to close all launch blockers.

---

## 4. Go-to-Market Strategy (First 90 Days)

### Pre-Launch: Days 1-14

**Goal:** Resolve all launch blockers. Build community presence. Prepare marketing assets.

| Day   | Engineering                                                                                                             | Growth                                                                                                       | Success Metric                                                            |
| ----- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| 1-2   | T-071: Trademark evaluation + backup names. T-072: Remove DOB from onboarding. T-043: Add error logging to all queries. | Begin genuine Reddit participation (r/lego, r/legoinvesting, r/legomarket). Join top 5 LEGO Discord servers. | Legal risk assessed. 20+ genuine community interactions.                  |
| 3-5   | T-070: Privacy policy + GDPR compliance. T-088: CI/CD pipeline (GitHub Actions). T-041: Sentry monitoring.              | Compile micro-influencer outreach list (30 creators). Prepare Product Hunt listing assets.                   | Legal compliance done. CI running on PRs. 30 outreach targets identified. |
| 6-9   | T-030: Price data integration (Rebrickable API, retail prices). T-040: robots.txt + sitemap.                            | Send outreach to 15 micro-influencers. Write "Show HN" and Reddit launch post drafts.                        | Price data visible on sets. SEO basics live. 15 outreach emails sent.     |
| 10-14 | NEW: CSV import (Brickset format first, then Rebrickable). T-036: CSV export. T-065: Landing page with email capture.   | Seed 5-10 collection profiles (team + friends). Final QA on Collection Card sharing flow.                    | Import/export working. Landing page live. Share flow verified end-to-end. |

**Pre-launch milestone:** All launch blockers resolved. Landing page collecting emails. 50+ genuine Reddit/Discord interactions completed.

### Launch Week: Days 15-21

**Goal:** 200-400 sign-ups. Establish presence on Product Hunt, Reddit, Hacker News.

| Day      | Action                                                                                       | Channel                | Success Metric                                                    |
| -------- | -------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------- |
| 15 (Mon) | Soft launch: "I built a social LEGO collection tracker" post                                 | r/lego                 | 50+ upvotes, 20+ comments                                         |
| 15       | Share beta invite in LEGO Discord servers                                                    | Discord                | 30+ sign-ups from Discord                                         |
| 16 (Tue) | Respond to every Reddit/Discord comment. Email confirmed micro-influencers with beta access. | Reddit, Discord, Email | 100% response rate. 5+ creator confirmations.                     |
| 17 (Wed) | Product Hunt launch                                                                          | Product Hunt           | Top 10 of the day                                                 |
| 17       | Twitter/X launch thread (development story + screenshots)                                    | Twitter/X              | 50+ retweets                                                      |
| 18 (Thu) | "Show HN: I built a social LEGO collection tracker"                                          | Hacker News            | Front page (target)                                               |
| 19-21    | Monitor activation rate. Collect first user feedback. Fix critical bugs.                     | All channels           | 30% of sign-ups add 5+ sets in 24h. 10+ feedback items collected. |

**Launch week targets:** 200-400 sign-ups. 30-40% activation rate (5+ sets added). 10%+ share a Collection Card.

### Post-Launch Growth: Days 22-90

#### Weeks 4-5: Retention & Differentiation

| Focus          | Actions                                                                                                                   | Targets                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Retention      | Improve onboarding based on drop-off data. Add "quick add" for popular sets. Send re-engagement emails to inactive users. | D7 retention: 15-20%                                    |
| Killer feature | Ship theme completion tracking (T-062).                                                                                   | Feature live, first "I'm 73% complete" shares appearing |
| Content        | Publish first 4 SEO blog posts targeting "how much is my lego collection worth" and "lego collection tracker."            | 2 posts/week cadence established                        |

#### Weeks 6-8: Amplification

| Focus       | Actions                                                                                                | Targets                        |
| ----------- | ------------------------------------------------------------------------------------------------------ | ------------------------------ |
| Creators    | First 5-10 micro-influencer videos/posts go live. Amplify creator content on LegoFlex social channels. | 300-800 sign-ups from creators |
| Measurement | Deploy PostHog analytics (T-050). Set up activation funnel + retention cohorts.                        | Data-driven decisions enabled  |
| Mobile      | Ship PWA support (T-063) + bottom mobile nav (T-081).                                                  | Mobile experience competitive  |

#### Weeks 9-12: Scale

| Focus             | Actions                                                                                          | Targets                          |
| ----------------- | ------------------------------------------------------------------------------------------------ | -------------------------------- |
| Community         | Launch LegoFlex Discord server. Host first "Collection Showdown" event. Start weekly newsletter. | 200+ Discord members             |
| Mid-tier creators | Partner with 3-5 creators (100K+ subs). Sponsor "collection tour" videos.                        | 500-1,000 sign-ups from creators |
| Widget            | Release embeddable collection widget. Outreach to 20+ LEGO bloggers for placement.               | 20+ widget embeds                |
| LUGs              | Partner with 3-5 LEGO User Groups. Offer group features and free Pro accounts.                   | 3+ LUG partnerships              |

### 90-Day Success Metrics

| Metric                           | Day 30 Target | Day 90 Target |
| -------------------------------- | ------------- | ------------- |
| Total sign-ups                   | 500           | 2,500         |
| WAC (Weekly Active Collectors)   | 150           | 600           |
| Activation rate (5+ sets in 24h) | 30%           | 35%           |
| D7 retention                     | 15%           | 20%           |
| D30 retention                    | --            | 10%           |
| Collection Cards shared/week     | 30            | 150           |
| Share-to-signup conversion       | 3%            | 5%            |
| Pro conversion                   | --            | 3-5%          |

**Next steps:** Begin Day 1 engineering tasks immediately. Start Reddit/Discord community participation in parallel.

---

## 5. Risk Assessment

| #   | Risk                                                                                                                                                                                                                                         | Likelihood | Impact | Mitigation Strategy                                                                                                                                                                                                                                                                                                                                                                   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------: | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **LEGO trademark cease-and-desist on "LegoFlex" name.** LEGO Group aggressively defends its trademark. The name directly incorporates "LEGO."                                                                                                |   **H**    | **H**  | Evaluate immediately (T-071). Prepare 3 backup names (BrickVault, BrickFlex, StudTracker). Add "Not affiliated with the LEGO Group" disclaimer to every page. Use "LEGO" only as an adjective in all copy. Do not launch public marketing until this is resolved.                                                                                                                     |
| 2   | **No users switch due to missing data import.** Existing collectors have years of data in Brickset/Rebrickable. Without one-click import, only brand-new collectors will sign up -- a much smaller addressable market.                       |   **H**    | **H**  | Build CSV import before public launch (Brickset XML format first, then Rebrickable CSV). Support the most common export formats. Test with real exports from both platforms. Promote "Import your collection in 30 seconds" as a launch headline.                                                                                                                                     |
| 3   | **Price data API costs, reliability, or legal restrictions.** Rebrickable's free API has rate limits. BrickLink's API requires LEGO Group approval. BrickEconomy has no public API. Without price data, the #1 requested feature is missing. |   **M**    | **H**  | Start with Rebrickable free tier for retail prices (sufficient for MVP). Cache aggressively (prices do not change hourly). Build a fallback to manual/community-sourced data. Gate real-time market value tracking behind Pro tier to manage API costs.                                                                                                                               |
| 4   | **Cold start problem with social features.** Social features (feed, leaderboard, follow suggestions) are meaningless with 10 users. New users see empty feeds and no one to follow, then leave.                                              |   **M**    | **H**  | Seed 50-100 profiles before public launch (team, friends, beta testers). Curate a "featured collectors" list for new users to follow. Pre-populate the leaderboard. Ensure the product is useful solo (collection tracking, analytics) before social features matter. Target tight-knit communities (Star Wars UCS, modular building collectors) where users already know each other. |
| 5   | **LEGO Group builds social features into BrickLink.** LEGO acquired BrickLink in 2019 and could add collection tracking + social features to their own platform, leveraging their existing user base and brand trust.                        |   **L**    | **H**  | Move fast. BrickLink's 3.2-star rating, country suspensions, and slow feature development suggest this is unlikely in the near term. Build community moat (network effects, creator partnerships, LUG relationships) that is harder to replicate than features. First-mover advantage in social LEGO tracking creates switching costs.                                                |
| 6   | **Brickd expands to web and adds analytics.** Brickd is the closest social competitor (iOS-only). If they launch a web version with pricing and analytics, they become a direct threat.                                                      |   **M**    | **M**  | LegoFlex's social features are already deeper (follow suggestions algorithm, collection overlap scores, social proof on set pages -- none of which Brickd has). Ship theme completion tracking and value tracking before Brickd can catch up. The web-first advantage means LegoFlex reaches Android users and desktop users that Brickd cannot.                                      |
| 7   | **Community backlash against self-promotion.** Reddit's r/lego has strict 90/10 rules. Premature or heavy-handed promotion leads to post removal, downvotes, and reputational damage in the exact communities LegoFlex needs.                |   **H**    | **M**  | Complete 4+ weeks of genuine participation before any mention of LegoFlex. Frame the launch as a personal project and ask for authentic feedback. Never post more than once per week. Maintain 90%+ non-promotional activity indefinitely. Have the product speak for itself through Collection Card shares by early adopters, not founder posts.                                     |

**Next steps:** Resolve risks #1 (trademark) and #2 (data import) before any public launch activity. These are the only two risks that are both high-likelihood and high-impact.

---

## 6. Updated Task List Recommendations

### Tasks to ADD (Not Currently on the Task List)

| New Task                                 | Recommended Priority | Justification                                                                                                                                                                                                                                                                                                |
| ---------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **CSV import from Brickset/Rebrickable** | **P1 (Pre-Launch)**  | User research identifies migration friction as the #1 barrier to switching. Product strategy audit calls it a "launch blocker." No existing collector will re-enter 200+ sets manually. Support Brickset XML and Rebrickable CSV formats.                                                                    |
| **Embeddable collection widget**         | **P3 (Post-Launch)** | Goodreads grew significantly through embeddable blog widgets. A small widget showing collection size, Brick Score, and top themes -- placed on LEGO blogs, YouTube descriptions, and forum signatures -- creates free, persistent acquisition. Growth strategy estimates K-factor contribution of 0.10-0.20. |
| **"Nice Brick!" reaction system**        | **P3 (Post-Launch)** | Strava's "Kudos" system was a key driver of casual user engagement and sharing. A lightweight reaction on milestone celebrations and collection updates increases social engagement without requiring full comments. Strengthens the social moat.                                                            |
| **Collection comparison tool**           | **P3 (Post-Launch)** | User research Persona 4 (Social Collector) explicitly requests "Show me what they have that I don't." Collection overlap is already computed (Jaccard similarity). Extending this to a side-by-side comparison view is medium effort, high social engagement.                                                |

### Tasks to REPRIORITIZE (Move Up)

| Task                                  | Current Priority | Recommended Priority | Justification                                                                                                                                                                                                                                                                                                  |
| ------------------------------------- | :--------------: | :------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **T-070: Privacy policy + GDPR**      |        P7        |        **P0**        | Legal blocker. Cannot launch publicly without a privacy policy. The current dead link is actively harmful. GDPR applies to any EU users. Product strategy scores this 8.0 on the priority matrix.                                                                                                              |
| **T-071: Trademark evaluation**       |        P7        |        **P0**        | Risk assessment rates this High likelihood / High impact. "LegoFlex" contains the LEGO trademark. A cease-and-desist on day one kills the project. Must evaluate before investing more in branding, SEO, or creator partnerships.                                                                              |
| **T-072: Remove DOB from onboarding** |        P7        |        **P0**        | GDPR data minimization violation. Collecting date of birth without stated purpose is illegal in the EU. This is a 5-minute fix with outsized legal risk reduction.                                                                                                                                             |
| **T-065: Landing page + SEO**         |        P6        |        **P1**        | Without a landing page, there is no acquisition funnel. SEO takes months to compound -- every day of delay costs future organic traffic. Growth strategy identifies "lego collection tracker" (1,000-2,500 monthly searches) and "how much is my lego collection worth" (2,000-5,000) as high-intent keywords. |
| **T-030: Price data integration**     |        P3        |        **P1**        | The #1 most-requested feature across all user research. Collection value is the primary reason people track sets. Showing $0 undermines credibility. Product strategy scores this 8.3 on the priority matrix -- highest of any task.                                                                           |
| **T-088: CI/CD pipeline**             |     Backlog      |        **P1**        | 271 tests exist but do not run automatically. Any PR could break the build undetected. This is a 2-4 hour setup (GitHub Actions) with high ongoing value. Product strategy scores effort at 2/5.                                                                                                               |
| **T-062: Theme completion tracking**  |        P6        |        **P2**        | Product strategy identifies this as the "killer feature" -- highest differentiation score (5/5), low effort (2/5), no competitor offers it. Ship within 30 days of launch.                                                                                                                                     |
| **T-040: robots.txt + sitemap**       |        P4        |        **P1**        | SEO basics. Public profiles and set pages should be indexable. Takes 1-2 hours. Growth strategy depends on organic search as a primary long-term channel.                                                                                                                                                      |

### Tasks to DEPRIORITIZE (Move Down or Defer)

| Task                                 | Current Priority |      Recommended Priority      | Justification                                                                                                                                                                                                                                                       |
| ------------------------------------ | :--------------: | :----------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **T-042: Parallelize vault queries** |        P4        |             **P5**             | 200-400ms savings are real but not user-facing at current scale. Product strategy scores this 3.3 -- lowest of any active task. Optimize after launch when performance data from real users exists.                                                                 |
| **T-061: Pro tier (monetization)**   |        P6        |             **P7**             | Monetization before product-market fit is premature. Growth strategy targets 3% Pro conversion at Month 3, but this requires a user base first. Community sentiment strongly resists paywalls for basic features. Ship Pro only after WAC data validates retention. |
| **T-060: AI set scanning**           |        P6        | **P6 (keep, but after T-062)** | High effort (5/5) and dependent on Gemini API costs. Product strategy positions this as a Month 2-3 "wow factor" feature. Theme completion tracking (T-062) delivers more impact at lower cost and should ship first.                                               |
| **T-085: Referral program**          |     Backlog      |       **Backlog (keep)**       | Growth strategy analysis confirms: the most successful niche apps (Letterboxd, Untappd) rely on natural virality over formal referral programs. Referrals only amplify existing viral loops -- they do not create them. Ship after the product is loved.            |
| **T-064: Email notifications**       |        P6        |         **P6 (keep)**          | Nice retention mechanism but not urgent pre-launch. Growth strategy places email re-engagement in the Month 2-3 timeframe. Focus on acquisition and activation first.                                                                                               |

### Summary of Recommended Priority Order

**Immediate (Week 1-2):**

1. T-071 -- Trademark evaluation (existential risk)
2. T-072 -- Remove DOB (5-minute GDPR fix)
3. T-070 -- Privacy policy (legal blocker)
4. T-043 -- Error logging (trust)
5. T-040 -- robots.txt + sitemap (SEO foundation)

**Week 2-3:** 6. T-088 -- CI/CD pipeline (quality gate) 7. T-041 -- Sentry monitoring (production visibility) 8. T-030 -- Price data integration (table stakes)

**Week 3-4:** 9. NEW -- CSV import from Brickset/Rebrickable (migration path) 10. T-036 -- CSV export (data portability) 11. T-065 -- Landing page + email capture (acquisition funnel)

**Post-Launch (Week 5-8):** 12. T-062 -- Theme completion tracking (killer differentiator) 13. T-050 -- PostHog analytics (measurement) 14. T-063 -- PWA support (mobile) 15. T-081 -- Bottom mobile nav (mobile UX)

**Next steps:** Begin with T-071 (trademark evaluation) today. This is the single decision that gates all other work -- if the name must change, it must change before any public-facing marketing, SEO, or creator partnerships are built.

---

_Synthesized from: market_analysis.md, user_research.md, product_strategy.md, growth_strategy.md, community_report.md. Last updated: 2026-03-23._
