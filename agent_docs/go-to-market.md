# Go-to-Market Operational Playbook

This playbook connects the strategy in `phase4/monetization-strategy.md` and `phase4/business-analytics.md` to executable workflows using available AI tools.

Use `/growth-ops` to route any marketing/launch/growth task to the right tool.

---

## Pre-Launch Checklist

### Product Blockers
- [ ] Price data integration (Rebrickable API) — Pro tier needs value tracking, "$0" breaks trust
- [ ] PostHog analytics integrated (use event schema from `phase4/business-analytics.md`)
- [ ] Collection Card viral loop tested end-to-end (share → view → sign up)
- [ ] Fix all P0 friction points from `phase1/user-research.md`

### Marketing Prep
- [ ] Brand guidelines doc → use `brand-guardian` persona
- [ ] SEO keyword research for collector terms → use `seo-specialist` persona
- [ ] Landing page with email capture (pre-launch lead collection)
- [ ] Content calendar: launch week + 4 weeks post-launch → use `content-creator` persona
- [ ] 10-20 seed Reddit posts in r/lego (authentic, value-first) → use `reddit-builder` persona
- [ ] Create shareable launch assets per platform → use `content-engine` ECC skill

### Analytics Setup
- [ ] PostHog Cloud account (free tier: 1M events/month)
- [ ] Track North Star: Weekly Active Collectors (WAC)
- [ ] Key events: sign_up, set_added, collection_shared, profile_viewed, leaderboard_visited
- [ ] Activation metric: 5+ sets added within 24 hours (target: 30-40%)
- [ ] Set up D1/D7/D30 retention cohorts

---

## Launch Week Workflow

```
Day 1: Soft Launch
├── Post to Reddit (r/lego, r/legomarket) → reddit-builder persona
├── Share on personal social → crosspost skill
└── Monitor PostHog: sign-ups, activation rate

Day 2-3: Content Push
├── article-writing → launch blog post
├── content-engine → platform-specific variants (X thread, IG carousel, TikTok)
├── crosspost → distribute across platforms
└── Monitor: which channel drives most sign-ups

Day 4-5: Community Engagement
├── reddit-builder → respond to comments, answer questions authentically
├── Engage with collector communities on Discord
└── feedback-synthesizer → analyze first user reactions

Day 6-7: Analysis
├── growth-hacker → review week 1 metrics vs targets
├── PostHog: activation rate, retention, top user actions
└── Adjust strategy based on data
```

### Week 1 Targets (from phase4)
- 50-100 sign-ups
- 30-40% activation (5+ sets added in 24h)
- Collection Card shared by 10%+ of users

---

## Post-Launch Growth Loop

```
growth-hacker: design experiment (channel, message, mechanic)
    → content-engine: create content for experiment
    → crosspost: distribute to target channel
    → PostHog: measure results (sign-ups, activation, retention)
    → feedback-synthesizer: analyze user responses
    → iterate (keep what works, drop what doesn't)
```

### Monthly Cadence
- **Week 1:** trend-researcher → market scan, competitor check, emerging opportunities
- **Week 2:** content-engine → batch create month's content
- **Week 3:** growth-hacker → review metrics, propose 2-3 experiments
- **Week 4:** feedback-synthesizer → user feedback synthesis, roadmap input

### Growth Targets (from phase4)
| Period | Sign-ups | D7 Retention | Referral Rate |
|--------|----------|-------------|---------------|
| Month 1 | 200-400 | 10-15% | — |
| Month 3 | 1,000-2,000 | 15-20% | 10-15% |
| Month 6 | 3,000-5,000 | 20-25% | 15-20% |

---

## Pro Tier Launch (Week 6-8)

Don't launch Pro on day 1. Wait until you have:
- Active free user base (500+ WAC)
- Proven activation and retention
- Price data working (primary Pro value prop)

### Pro Launch Workflow
1. `article-writing` → "Why serious collectors need analytics" blog post
2. `content-engine` → Pro feature spotlight series (5 posts over 2 weeks)
3. `growth-hacker` → conversion funnel optimization
4. A/B test: pricing page variants, trial length (7 vs 14 days), feature gates
5. Monitor: conversion rate target 3-5% (conservative → optimistic)

### Pro Features (from phase4)
- Collection value tracking (primary driver)
- Advanced analytics (theme distribution, trends)
- Unlimited collection cards (no watermark)
- CSV/PDF export
- Set status tracking (Built/In Box/Missing/For Sale)
- Theme completion tracking

### Revenue Projections (from phase4)
| Scenario | M6 ARR | M12 ARR |
|----------|--------|---------|
| Conservative (3%) | $4.5K | $18K |
| With 60% annual plan | $5.85K | $23.4K |
| Optimistic (5%) | — | $39K |

---

## Viral Mechanics

### Collection Card (Primary)
Spotify Wrapped for LEGO — shareable image showing collection stats, rank, top themes.
- Already built at `/api/og/collection/`
- Share flow: Profile → Share button → generates OG image → social post
- Track: `collection_card_shared`, `collection_card_viewed`, `sign_up_from_card`

### Milestone Sharing
Celebration modal when hitting milestones (10 sets, 50 sets, new rank).
- Share button in modal → generates achievement image
- Track: `milestone_reached`, `milestone_shared`

### Year in Bricks (December)
Annual recap: sets added, rank progression, top themes, collection growth.
- Time-limited viral event (like Spotify Wrapped)
- Track: `year_in_bricks_viewed`, `year_in_bricks_shared`

---

## Channel Strategy

### Primary: Reddit
- r/lego (2M+ members), r/legomarket, r/legodeal
- Authentic engagement via `reddit-builder` persona
- Don't spam — provide value first (collection tips, interesting stats)
- "What's your LEGO rank?" hook drives curiosity

### Secondary: TikTok + Instagram
- Short-form collection showcases, unboxings, "collection tour" format
- Use Collection Card as visual hook
- Target: Gen-Z and millennial AFOL collectors

### Tertiary: YouTube
- Partner with BrickTubers for feature showcases
- Tutorial: "How to track your LEGO collection (and find out your rank)"

### SEO (Long-term)
- Target: "best lego collection tracker", "lego inventory app", "track my lego collection"
- Use `seo-specialist` persona for keyword strategy
- `article-writing` for SEO-optimized blog content

---

## Competitive Positioning

From phase4 analysis:
- **Brickset:** 350K+ members, dated UI, no social/gamification, free
- **BrickLink:** Marketplace (owned by LEGO), no social
- **Rebrickable:** Freemium ($3-5/mo), part-level, no social/gamification
- **LegoFlex:** Social-first + gamification + modern UI (competitors ignore all three)

Key differentiator: **Nobody else has social + gamification.** Lead with this.

---

## Tool Quick Reference

| Task | Tool |
|------|------|
| Competitive research | `market-research` or `deep-research` |
| Blog post | `article-writing` |
| Social content plan | `content-engine` + `content-creator` persona |
| Post to social | `crosspost` |
| Reddit engagement | `reddit-builder` persona |
| Growth experiments | `growth-hacker` persona |
| SEO strategy | `seo-specialist` persona |
| Brand consistency | `brand-guardian` persona |
| User feedback | `feedback-synthesizer` persona |
| Market trends | `trend-researcher` persona |
| Pitch deck | `investor-materials` |
| Investor emails | `investor-outreach` |
| Automated monitoring | `data-scraper-agent` |
