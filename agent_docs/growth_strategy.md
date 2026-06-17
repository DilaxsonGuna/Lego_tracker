# LegoFlex Growth Strategy

> Viral & acquisition analysis for a social LEGO collection tracker.
> Last updated: 2026-03-23

---

## Table of Contents

1. [Comparable App Growth Studies](#1-comparable-app-growth-studies)
2. [LegoFlex Viral Loop Analysis](#2-legoflex-viral-loop-analysis)
3. [LEGO Creator Landscape & Partnerships](#3-lego-creator-landscape--partnerships)
4. [SEO Keyword Strategy](#4-seo-keyword-strategy)
5. [First 1,000 Users Playbook](#5-first-1000-users-playbook)
6. [Pricing Strategy](#6-pricing-strategy)
7. [Referral Program Design](#7-referral-program-design)
8. [Acquisition Channels Ranked](#8-acquisition-channels-ranked)
9. [90-Day Launch Playbook](#9-90-day-launch-playbook)

---

## 1. Comparable App Growth Studies

### Letterboxd (Film Tracking) — 1.8M to 17M users in 4 years

**What worked:**
- **Community-first, marketing-last.** Letterboxd grew without heavy marketing spend. Awareness spread organically through loyal ambassadors who brought friends to a platform they loved.
- **Shareable content as product.** Every review and list is a piece of shareable social content. Users post their Letterboxd ratings on social media as cultural signaling — "I rated this film 4.5 stars" became identity expression.
- **Demographic targeting.** Half of users are under 35, with 16-24 as the largest segment. The product resonated with film students, critics, and festival-goers first, who then shaped the platform's tone.
- **Engagement flywheel.** Reviews grew from 300K/year (2012) to nearly 100M/year (2024) — a 3,300% increase. Users logged 1 billion films total, with 700M+ in 2024 alone.

**LegoFlex takeaway:** Build for the most passionate collectors first (AFOLs). They will set the culture and bring others. Shareable collection stats = shareable film ratings.

### Goodreads (Book Tracking) — 0 to 50M users

**What worked:**
- **80/20 rule.** Founder Otis Chandler spent 80% of time improving the product and 20% on growth channels. Product quality drove retention, which enabled word-of-mouth.
- **Blog widgets.** Goodreads created embeddable widgets showing users' bookshelves. Bloggers placed them on personal sites, each one linking back to Goodreads — free distribution at scale.
- **Viral coefficient targeting.** Chandler obsessed over getting one user to invite one friend within 24 hours (viral factor 1.0). Anything above 1.0 creates exponential growth.
- **Content as SEO.** The strategy was "as many reviews across as many books as possible." User-generated content became long-tail SEO fuel.

**LegoFlex takeaway:** Build an embeddable collection widget (sidebar badge showing collection size, rank, top themes). Target LEGO bloggers and YouTubers for distribution. Obsess over the 24-hour invite metric.

### Untappd (Beer Tracking) — 0 to 9M+ users, $1K initial investment

**What worked:**
- **Side project with no marketing budget.** Growth was 100% word-of-mouth. A single Mashable article spiked DAU from 100 to 5,000 overnight.
- **Community-driven gamification.** Every two months, the community voted on the next wave of badges. This created dual engagement: voting participation + repeated check-ins to earn new badges.
- **Focus and time management.** With limited resources, they prioritized ruthlessly — only building features that directly served community engagement.
- **B2B pivot.** Untappd for Business became a significant revenue stream, selling analytics and digital menus to bars and breweries.

**LegoFlex takeaway:** Gamification badges voted on by the community. One viral press hit can change trajectory. Consider a B2B angle (LEGO stores, conventions) later.

### Discogs (Vinyl/Music Tracking) — 101M+ items in collections, 20+ years

**What worked:**
- **Database-first approach.** Discogs built the most comprehensive music database through community contributions, making it indispensable for cataloging.
- **Collection + marketplace flywheel.** Users came to catalog, stayed to buy/sell. Vinyl sales on the marketplace grew 51% since 2020.
- **Mobile scanning.** 60% of activity is mobile, with barcode scanning for in-store browsing.
- **Value tracking.** Real-time collection value based on marketplace sales history became a key retention feature.

**LegoFlex takeaway:** Value tracking is the killer Pro feature. Integrate marketplace price data. Consider barcode/set-number scanning for quick entry.

### Strava (Fitness Tracking) — 0 to 120M+ users, $1.5B valuation

**What worked:**
- **Seed users with hardware.** Founders sent 10 Garmin units to passionate cyclists on East and West coasts, then created competition between them during the 2008 Tour de France. Manufactured rivalry = engagement.
- **Every workout = shareable content.** Virality was baked into the product DNA. Each activity was a piece of social currency.
- **Gamification layers.** Segment rankings, "Local Legend" badges, and the Kudos system turned fitness into a game. Kudos specifically attracted casual users who were intimidated by pure performance metrics.
- **Multi-sport expansion.** Adding new sports created "a really fascinating viral effect" — existing users expanded with the platform and brought friends from new communities.

**LegoFlex takeaway:** Manufacture friendly competition (East vs. West coast collectors, theme-based rivalries). The Kudos equivalent could be "Nice Brick!" reactions on collection milestones. Multi-theme expansion mirrors multi-sport expansion.

---

## 2. LegoFlex Viral Loop Analysis

### Viral Coefficient Estimates

| Feature | Viral Coefficient (K) | Effort to Build | Priority |
|---------|----------------------|-----------------|----------|
| Collection Cards (shareable images) | 0.15-0.25 | Built | P0 |
| Milestone celebrations + share CTA | 0.10-0.20 | Built | P0 |
| "Year in Bricks" annual recap | 0.30-0.50 | Planned | P1 |
| Leaderboard competition | 0.05-0.10 | Built | P1 |
| "X friends own this set" social proof | 0.08-0.15 | Planned | P2 |
| Collection overlap score | 0.05-0.10 | Planned | P2 |
| Embeddable collection widget | 0.10-0.20 | Not planned | P1 |
| Referral program (2-sided) | 0.15-0.30 | Planned | P1 |

**Combined estimated viral coefficient: 0.4-0.7** (good but sub-viral). Target 0.8+ to approach organic growth sustainability.

> **Note on K-factor:** A viral coefficient of 1.0 means each user brings one new user. Above 1.0 = exponential growth. Most successful niche apps operate at 0.5-0.8 and supplement with paid/organic acquisition.

### Collection Cards — Primary Viral Loop

This is LegoFlex's equivalent of Spotify Wrapped at a micro level. The loop:

```
User hits milestone → Celebration modal → "Share your collection" CTA
    → Generates branded image (collection stats, rank, top themes)
    → User shares to Instagram/X/Reddit/TikTok
    → Viewer sees stats, wants to know their own rank
    → Clicks link → Signs up → Adds sets → Hits milestone → Shares...
```

**Optimization levers:**
- Image must be visually striking (LEGO yellow, bold typography, brick textures)
- Include a clear CTA on the image: "Find your Brick Score at legoflex.app"
- 9:16 format for Instagram/TikTok Stories (Spotify Wrapped lesson)
- Include a QR code for frictionless mobile sign-up
- A/B test image templates — different layouts for different milestones

**Spotify Wrapped reference data:**
- 60M Wrapped stories shared in 2021
- 156M users engaged in 2022
- 200M+ users engaged in first 24 hours of 2025 launch
- 2.1M social media mentions in 48 hours for 2024 Wrapped
- 20% boost in app downloads during Wrapped launch (2020)

### "Year in Bricks" — Seasonal Viral Event

LegoFlex's biggest viral opportunity. Release annually in December alongside holiday LEGO buying season.

**Content to include:**
- Total sets added this year
- Collection value change (requires price data)
- Rank progression (Brick Collector -> Brick Master, etc.)
- Most-added theme
- "Rarest set" in collection
- Comparison to community averages
- Total pieces owned milestone

**Distribution strategy:**
- Time-limited availability (2 weeks in December) creates urgency
- Pre-generate for all active users, push notification to view
- Optimize sharing for every platform (Stories, feed posts, tweets)
- Encourage creators to share with #YearInBricks hashtag

**Target metrics (Year 1):**
- 40% of MAU view their recap
- 15% share to at least one platform
- 5% of shares convert to a new sign-up

### Milestone Celebrations — Continuous Micro-Virality

Unlike Year in Bricks (annual), milestones create ongoing sharing moments:

| Milestone | Trigger | Share Rate Target |
|-----------|---------|-------------------|
| First Set | 1 set added | 20% |
| Getting Started | 5 sets | 15% |
| Serious Collector | 25 sets | 12% |
| Centurion | 100 sets | 25% |
| Brick Master | 500 sets | 30% |
| New Rank Achieved | Rank change | 20% |
| Theme Completionist | 100% of a theme | 35% |
| Rare Set Added | Top 5% rarity | 25% |

**Key insight from Strava:** The "Kudos" system (lightweight social validation) increased sharing because users wanted to show off their achievements and receive recognition. LegoFlex's equivalent: "Nice Brick!" reactions from followers when milestones are hit.

### Embeddable Collection Widget (New Recommendation)

Inspired by Goodreads' blog widget strategy. Build a small embeddable component showing:
- User's avatar + username
- Collection size + Brick Score
- Top 3 themes
- "Track your LEGO on LegoFlex" link

**Distribution targets:**
- LEGO bloggers embed on sidebars
- Forum signatures on Eurobricks, BrickLink
- YouTube channel descriptions
- Reddit flair integration (if possible)

---

## 3. LEGO Creator Landscape & Partnerships

### Top YouTube Creators

| Creator | Subscribers | Content Type | Partnership Fit |
|---------|------------|--------------|-----------------|
| Brick Technology | 2.5M | Pushing LEGO limits, engineering | Medium — tech-focused audience |
| Brick Science | 2.2M | Fun LEGO builds | Medium — younger audience |
| NEO25 | 1.2M | Stop motion, toys | Low — entertainment focus |
| Brick Clicker | ~500K | Leaks, news, reviews | High — collector audience |
| MandRproductions | ~800K | Reviews, news, hauls | High — collector audience |
| Jang (jangbricks) | ~1.5M | Detailed reviews, city builds | Very High — serious AFOL |
| Bricksie | ~400K | MOCs, community features | Very High — community focus |

### Top TikTok Creators

| Creator | Followers | Content Type | Partnership Fit |
|---------|-----------|--------------|-----------------|
| @epikbricks | 1.2M | LEGO content | High |
| @bricksiej | 1.5M | LEGO builds | High |
| @jkbrickworks | 1.3M | Kinetic LEGO art | Medium |
| @BrixAndBros | 70K | Humor/relatable content | High — engaged niche |

### Partnership Strategy

**Tier 1 — Micro-influencers (10K-100K followers): Priority**
- Cost: Free product / Pro subscription / small fee ($100-500)
- Approach: "We built this for collectors like you — want early access?"
- Ask: Honest review video, collection card share, link in bio
- Target: 20-30 micro-influencers in first 90 days
- Expected reach: 500K-2M impressions

**Tier 2 — Mid-tier creators (100K-500K): Month 2-3**
- Cost: $500-2,000 per integration
- Approach: Sponsored "collection tour" video using LegoFlex
- Ask: Full video walkthrough of adding collection, sharing stats
- Target: 5-10 creators
- Expected reach: 2M-5M impressions

**Tier 3 — Major creators (500K+): Month 3+**
- Cost: $2,000-10,000 per integration
- Only pursue after product-market fit is validated
- Approach: Long-term ambassador partnership with revenue share

**What creators will promote and why:**
- Collection tracking solves a real pain point (most track in spreadsheets)
- Shareable collection cards = content for their channels
- Leaderboard gives them status to show off
- "Find out your Brick Score" is a natural CTA for videos
- Value tracking helps justify their hobby to partners/family

### LEGO Ambassador Network

The LEGO Ambassador Network (LAN) connects the most active AFOL communities. Recognized LEGO User Groups (LUGs) get:
- Exclusive events and product previews
- Direct feedback channels with LEGO Group
- Community networking

**Opportunity:** Partner with LUGs to get LegoFlex adopted as their collection tracking tool. Offer LUG-specific features (group collection stats, LUG leaderboards).

---

## 4. SEO Keyword Strategy

### Primary Keywords (Estimated Monthly Search Volume)

| Keyword | Est. Volume | Competition | Intent | Priority |
|---------|------------|-------------|--------|----------|
| lego collection tracker | 1,000-2,500 | Medium | High intent | P0 |
| lego inventory app | 500-1,500 | Medium | High intent | P0 |
| how much is my lego collection worth | 2,000-5,000 | Low | Very high intent | P0 |
| lego set value | 5,000-10,000 | High | High intent | P1 |
| lego price tracker | 1,000-3,000 | Medium | High intent | P1 |
| track my lego collection | 500-1,000 | Low | Very high intent | P0 |
| best lego sets 2026 | 10,000-30,000 | High | Discovery | P2 |
| lego investment guide | 500-1,500 | Low-Medium | High intent | P1 |
| retired lego sets value | 2,000-5,000 | Medium | High intent | P1 |

### Long-Tail Keywords (Lower Volume, Higher Conversion)

| Keyword | Est. Volume | Conversion Potential |
|---------|------------|---------------------|
| best app to track lego collection | 100-500 | Very High |
| lego collection spreadsheet alternative | 50-200 | Very High |
| how to organize lego collection | 1,000-3,000 | Medium |
| lego collection display ideas | 2,000-5,000 | Low-Medium |
| is my lego worth money | 1,000-3,000 | High |
| lego set retirement dates 2026 | 500-1,500 | High |
| lego minifigure collection tracker | 200-500 | Very High |

### SEO Content Strategy

**Blog posts to target high-intent keywords (publish 2/week):**

1. "How Much Is Your LEGO Collection Worth? (Free Calculator)" — targets the highest-intent query
2. "Best LEGO Collection Tracker Apps in 2026 (Compared)" — own the comparison keyword, position LegoFlex favorably
3. "LEGO Sets Retiring in 2026: Complete Guide" — evergreen traffic magnet
4. "From Spreadsheets to Smart Tracking: The Modern Collector's Guide" — targets frustrated Brickset/spreadsheet users
5. "LEGO Investment Guide: Which Sets Appreciate Most?" — targets value-conscious collectors
6. "The Complete LEGO Theme Guide: [Theme Name]" — create one per major theme for long-tail SEO

**Technical SEO:**
- Ensure each set page is indexable with proper schema markup (Product schema)
- Implement set-level pages that rank for "[set name] value" and "[set number] price"
- User collection pages (when public) become indexable content
- Add structured data for reviews, ratings, and price ranges

---

## 5. First 1,000 Users Playbook

### Where LEGO Collectors Gather Online

| Community | Size | Promotion Rules | Approach |
|-----------|------|-----------------|----------|
| r/lego | 2M+ members | Strict 90/10 rule, no spam | Value-first engagement for weeks before any mention |
| r/legomarket | 100K+ | Marketplace focused | Less relevant, but collectors browse |
| r/legodeal | 200K+ | Deal focused | Sponsor deal alerts from LegoFlex |
| Eurobricks Forum | 50K+ members | Community rules vary | Long-form posts, genuine participation |
| BrickLink Forum | Active | Collector-focused | Technical discussions, advanced users |
| Just LEGO Things (Discord) | 26K+ members | Varies | Direct engagement, beta invite |
| Brickset Discord | Active | Community-run | AFOL discussions |
| Facebook LEGO groups | Many, 10K-500K each | Group admin approval | Share collection cards organically |
| LEGO Ambassador Network | Official LUGs | Formal partnership | LUG-specific features pitch |

### Reddit Strategy (Primary Channel)

**Phase 1 — Become a community member (Weeks 1-4):**
- Create accounts on r/lego, r/legomarket, r/legodeal
- Post genuine content: collection photos, set reviews, questions
- Comment helpfully on others' posts (aim for 50+ genuine interactions)
- Build karma and recognition before ANY mention of LegoFlex

**Phase 2 — Soft introduction (Weeks 5-6):**
- Post a "I built a tool to track my LEGO collection" story post
- Frame as personal project, show authentic development journey
- Include screenshots, ask for feedback genuinely
- Respond to every comment within 1 hour
- If it gains traction, offer beta access to interested commenters

**Phase 3 — Community integration (Weeks 7+):**
- Share interesting data insights from LegoFlex ("The most-owned set among our users is...")
- Post collection comparison content ("How does your collection compare to the average?")
- Never post more than once per week, maintain 90% non-promotional activity

**Expected outcome:** 200-500 sign-ups from Reddit in first 90 days if executed well.

### Discord Strategy

- Join the top 5 LEGO Discord servers
- Participate genuinely for 2-3 weeks
- Offer exclusive beta access to active members
- Create a LegoFlex Discord server for beta users (feedback loop)
- Target: 100-200 sign-ups from Discord in first 90 days

### Direct Outreach Strategy

**LEGO bloggers (20-30 targets):**
- Personalized email: "I noticed you track your collection on [Brickset/spreadsheet]. I built something you might like."
- Offer lifetime Pro for honest review
- Ask for embeddable widget placement

**YouTubers (10-15 targets):**
- Start with micro-influencers (10K-50K subs)
- Offer early access + Pro subscription
- Provide a unique referral link to track attribution

**LUG leaders (5-10 targets):**
- Email through LEGO Ambassador Network contacts
- Pitch: "Free group collection tracking for your LUG"
- Offer custom LUG leaderboard features

### Launch Day Tactics

- **Product Hunt launch** — Target a Tuesday/Wednesday for best visibility
- **Hacker News "Show HN"** — "Show HN: I built a social LEGO collection tracker"
- **Twitter/X thread** — Development story thread with screenshots
- **Reddit post** — Soft launch post in r/lego (only if Phase 1-2 is complete)
- **Email to beta list** — If pre-launch email capture exists

---

## 6. Pricing Strategy

### Competitive Landscape

| App | Free Tier | Premium Price | Key Premium Features |
|-----|-----------|--------------|---------------------|
| Brickset | Full features, ad-supported | Free (login removes ads) | Donation-based |
| Rebrickable | Basic tracking | ~$10/mo (creator tools) | MOC publishing, analytics |
| BrickEconomy | Limited lookups | Unknown | Full price history |
| Brickfact | Basic tracking | Freemium | Price alerts, deals |
| iCollect Everything | Basic | $2.99/mo or $24.99/yr | Unlimited items, cloud sync |
| CardWorth/BrickWorth | Basic tracking | Freemium | Advanced value tracking |

### Recommended Pricing for LegoFlex

**Free Tier (generous — this drives growth):**
- Unlimited set tracking
- Basic collection stats (total sets, pieces, themes)
- Brick Score and rank
- Social features (follow, followers, feed)
- 3 collection card shares/month
- Basic milestone celebrations
- Leaderboard participation

**Pro Tier — $4.99/month or $39.99/year (33% annual discount):**
- Collection value tracking (real-time market prices)
- Advanced analytics (theme distribution, trends, value over time)
- Unlimited collection card shares (no watermark)
- Custom collection card templates
- CSV/PDF export
- Set status tracking (Built / In Box / Missing / For Sale)
- Theme completion tracking
- Priority set retirement alerts
- Early access to new features

**Why $4.99/month:**
- Below Rebrickable's ~$10/mo (price advantage)
- Above commodity apps at $2.99/mo (signals quality)
- $39.99/year is psychologically under $40 and represents clear value
- Aligns with "coffee money" framing ($1/week)

### Conversion Rate Targets

| Period | Free Users | Pro Conversion | Pro Users | MRR |
|--------|-----------|---------------|-----------|-----|
| Month 3 | 1,500 | 3% | 45 | $225 |
| Month 6 | 4,000 | 4% | 160 | $800 |
| Month 12 | 10,000 | 5% | 500 | $2,500 |

> Industry benchmark: freemium apps convert at 2-5% median. Niche hobby apps with passionate users can hit 5-8%.

### Conversion Triggers

The free tier must be genuinely useful (Goodreads lesson: "not a glorified ad for paid"). But specific moments create upgrade desire:

1. **Value curiosity:** "Your collection is worth $___. Upgrade to Pro to track value changes." (Show the number, gate the history)
2. **Share limit hit:** "You've used 3/3 collection card shares this month. Go Pro for unlimited."
3. **Analytics tease:** Show a blurred advanced analytics dashboard with "Unlock with Pro"
4. **Theme completion:** "You're 85% complete on Star Wars. Pro tracks completion across all themes."
5. **Export need:** "Export your collection to CSV" — natural Pro gate for serious collectors

---

## 7. Referral Program Design

### Learnings from Comparable Apps

**Strava:** Both referrer and referee get 2 months of Premium. No referral limits. Milestone bonuses for continuous referrals. Sharing happens through natural social connections.

**Letterboxd:** No formal referral program. Growth is purely organic through social sharing and word-of-mouth. The product itself is the referral mechanism (every list and review links back to the platform).

**Untappd:** Friend connections drive growth, but no formal incentive program. Community voting on badges creates engagement that naturally leads to word-of-mouth.

**Key insight:** The most successful niche apps rely more on natural virality (shareable content, social features) than formal referral incentive programs. A referral program should amplify existing viral loops, not replace them.

### Recommended Referral Program

**Two-sided reward structure:**

| Action | Referrer Gets | Referee Gets |
|--------|--------------|--------------|
| Friend signs up | 50 bonus Brick Score points | Welcome bonus: 50 Brick Score points |
| Friend adds 5+ sets (activation) | 1 month Pro free | 1 week Pro trial |
| 5 successful referrals | "Community Builder" badge | — |
| 10 successful referrals | 3 months Pro free | — |
| 25 successful referrals | Lifetime Pro + "Ambassador" badge | — |

**Why this works:**
- Brick Score points have intrinsic value (leaderboard ranking)
- Pro trials expose users to premium features (conversion driver)
- Badges provide social status (visible on profile)
- Tiered rewards encourage ongoing referral behavior
- Lifetime Pro at 25 referrals is highly aspirational but achievable

**Referral mechanics:**
- Unique referral link per user (trackable)
- Share via: copy link, WhatsApp, X, Instagram DM, email
- Referral dashboard showing: invites sent, sign-ups, activations, rewards earned
- Monthly "Top Referrers" spotlight in community feed

**Referral rate targets:**
- Month 1-3: 5-10% of users make at least one referral
- Month 6: 15-20% referral participation
- Target: Each referring user brings 1.5-2.5 new users on average

---

## 8. Acquisition Channels Ranked

### By Cost-Effectiveness (Best to Worst)

| Rank | Channel | CAC | Effort | Time to Impact | Expected Users (90 days) |
|------|---------|-----|--------|---------------|-------------------------|
| 1 | Reddit (organic) | $0 | High (time) | 4-8 weeks | 200-500 |
| 2 | Collection Card virality | $0 | Low (built) | Immediate | 100-300 |
| 3 | Micro-influencer partnerships | $50-500/creator | Medium | 2-4 weeks | 300-800 |
| 4 | Product Hunt launch | $0 | Medium | 1 day spike | 200-1,000 |
| 5 | SEO content | $0 (time) | High | 3-6 months | 50-200 (growing) |
| 6 | Discord communities | $0 | Medium | 2-4 weeks | 100-200 |
| 7 | Hacker News | $0 | Low | 1 day spike | 100-500 |
| 8 | YouTube creator partnerships | $500-2,000/video | Medium | 1-2 weeks | 200-500 |
| 9 | Facebook groups | $0 | Medium | 2-4 weeks | 50-150 |
| 10 | TikTok (organic) | $0 | High | Variable | 0-5,000 (hit-driven) |
| 11 | Referral program | Pro cost | Low (built) | Ongoing | 50-150 |
| 12 | LUG partnerships | $0 | Medium | 4-8 weeks | 50-200 |
| 13 | Paid ads (Reddit/Instagram) | $2-8/install | Low | Immediate | Depends on budget |
| 14 | BrickLink/Eurobricks forums | $0 | Medium | 2-4 weeks | 50-100 |

### Channel Strategy by Phase

**Phase 1 (Days 1-30): Seed**
- Reddit organic engagement (start immediately, soft launch week 5-6)
- Discord community seeding
- Direct outreach to 20 micro-influencers
- Product Hunt launch (day 14-21)

**Phase 2 (Days 31-60): Amplify**
- First micro-influencer videos go live
- SEO content publishing begins (2 posts/week)
- Referral program launches
- Facebook group engagement
- Hacker News "Show HN" post

**Phase 3 (Days 61-90): Scale**
- Mid-tier creator partnerships
- Year in Bricks development begins (for December)
- LUG partnership outreach
- Evaluate paid acquisition (only if organic CAC is known)
- Embeddable widget launches

---

## 9. 90-Day Launch Playbook

### Pre-Launch (Days -14 to 0)

| Day | Action | Owner | Success Metric |
|-----|--------|-------|----------------|
| -14 | Begin genuine Reddit participation (r/lego, r/legomarket) | Growth | 20+ genuine interactions |
| -14 | Join top 5 LEGO Discord servers | Growth | Active in 5 servers |
| -10 | Compile micro-influencer outreach list (30 creators) | Growth | 30 names + contact info |
| -7 | Prepare Product Hunt listing (assets, copy, supporters) | Growth | Listing draft complete |
| -7 | Write "Show HN" post draft | Growth | Draft reviewed |
| -7 | Set up PostHog analytics with viral tracking events | Eng | Events firing |
| -5 | Send outreach to 15 micro-influencers | Growth | 15 emails sent |
| -3 | Final QA on collection card sharing flow | Eng | Share → view → sign-up works |
| -1 | Seed 5-10 collection profiles (team + friends) | Team | Profiles populated |

### Week 1: Soft Launch

| Day | Action | Success Metric |
|-----|--------|----------------|
| 1 | Reddit soft launch post: "I built a LEGO collection tracker" | 50+ upvotes, 20+ comments |
| 1 | Share in LEGO Discord servers (beta invite framing) | 30+ sign-ups |
| 2 | Respond to every Reddit/Discord comment | 100% response rate |
| 2 | Email micro-influencers who responded with beta access | 5+ confirmations |
| 3 | Product Hunt launch | Top 10 of the day |
| 3 | Twitter/X launch thread | 50+ retweets |
| 4-5 | Monitor activation rate (target: 30% add 5+ sets in 24h) | Track in PostHog |
| 6-7 | Collect and act on first user feedback | 10+ feedback items |

**Week 1 targets:** 100-300 sign-ups, 30-40% activation, 10%+ share a collection card.

### Week 2-4: Foundation Building

| Week | Focus | Actions | Targets |
|------|-------|---------|---------|
| 2 | Retention | Improve onboarding based on drop-off data. Add "quick add" for popular sets. Send re-engagement emails to inactive users. | D7 retention: 15-20% |
| 3 | Content | Publish first 4 SEO blog posts. Create "How to use LegoFlex" YouTube tutorial. Share community highlights on social. | 2 posts/week cadence |
| 4 | Social proof | Feature top collections on social. Share aggregate data ("Our users own X sets worth $Y"). First micro-influencer content goes live. | 500+ total sign-ups |

### Month 2: Amplification

| Week | Focus | Actions | Targets |
|------|-------|---------|---------|
| 5 | Referral launch | Launch referral program. Email existing users about referral rewards. Add referral prompt to milestone celebrations. | 5% referral participation |
| 6 | Creator wave | 5-10 micro-influencer videos/posts go live. Amplify creator content on LegoFlex social. | 500+ sign-ups from creators |
| 7 | Community | Launch LegoFlex Discord server. Host first "Collection Showdown" community event. Start weekly community newsletter. | 200+ Discord members |
| 8 | Widget launch | Release embeddable collection widget. Outreach to LEGO bloggers for placement. | 20+ widget embeds |

**Month 2 targets:** 1,000-1,500 total sign-ups, 15-20% D7 retention, 3-5% Pro conversion.

### Month 3: Scale & Optimize

| Week | Focus | Actions | Targets |
|------|-------|---------|---------|
| 9 | Mid-tier creators | Partner with 3-5 creators (100K+ subs). Sponsor "collection tour" videos. | 1,000+ sign-ups from creators |
| 10 | SEO momentum | 12+ blog posts published. Monitor organic search rankings. Optimize top-performing posts. | First page for 2+ target keywords |
| 11 | Pro optimization | A/B test conversion triggers. Optimize pricing page. Launch limited Pro trial offer. | 5% Pro conversion |
| 12 | LUG outreach | Partner with 3-5 LUGs. Offer group features. Present at virtual LUG meetup. | 3+ LUG partnerships |

**Month 3 targets:** 2,000-3,000 total sign-ups, 20%+ D7 retention, 5% Pro conversion, $500+ MRR.

### Key Metrics Dashboard

Track daily in PostHog:

| Metric | Definition | Day 30 Target | Day 90 Target |
|--------|-----------|--------------|--------------|
| Total sign-ups | Cumulative registered users | 500 | 2,500 |
| WAC (Weekly Active Collectors) | Users who log in + perform action in 7 days | 150 | 600 |
| Activation rate | % of sign-ups who add 5+ sets in 24h | 30% | 35% |
| D7 retention | % of cohort active 7 days after sign-up | 15% | 20% |
| D30 retention | % of cohort active 30 days after sign-up | — | 10% |
| Collection cards shared | Total shares per week | 30/week | 150/week |
| Share-to-signup conversion | % of card views that lead to sign-up | 3% | 5% |
| Referral rate | % of users who refer at least one person | — | 10% |
| Pro conversion | % of users on Pro plan | 2% | 5% |
| MRR | Monthly recurring revenue | $50 | $500 |

### Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Reddit post removed for self-promotion | High | Medium | Complete 4+ weeks of genuine participation before any mention. Have backup accounts with history. |
| Low activation rate (<20%) | Medium | High | Simplify onboarding. Add set scanning. Pre-populate popular sets. Reduce friction to first "aha" moment. |
| Creators don't respond | Medium | Medium | Cast wide net (30+ outreach). Offer genuinely useful Pro features. Follow up 2x. |
| SEO takes too long | High | Low | SEO is a long game. Supplement with community channels in months 1-3. |
| Price data unavailable | Medium | High | Value tracking is the #1 Pro feature. Prioritize Rebrickable/BrickLink price integration. |
| Competitor copies social features | Low | Medium | Move fast. Build community moat (network effects). First-mover advantage in social LEGO tracking. |

---

## Appendix: Competitive Moat Analysis

LegoFlex's long-term defensibility comes from network effects, not features:

1. **Social graph moat.** Once a user's friends are on LegoFlex, switching costs are high. This is why Brickset (330K+ members, 20+ years) has no social features — they missed the window, and adding them now is too late without the user base.

2. **Data moat.** User-generated data (reviews, ratings, collection correlations) becomes more valuable as the user base grows. "Collectors who own this set also own..." requires scale.

3. **Content moat.** Collection cards, Year in Bricks recaps, and community content create brand awareness that compounds over time.

4. **Community moat.** Active Discord, Reddit presence, LUG partnerships, and creator relationships create a community that's hard to replicate.

**Bottom line:** Features can be copied. Community cannot. Every growth strategy should prioritize community building alongside user acquisition.
