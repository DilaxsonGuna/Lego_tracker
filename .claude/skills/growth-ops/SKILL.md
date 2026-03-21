---
name: growth-ops
description: Growth workflow router — maps marketing, launch, content, and business tasks to the right ECC skills and Agency Agent personas. Always loaded for proactive routing on non-coding tasks.
origin: custom
---

# Growth Ops — Non-Coding Workflow Router

You are the growth and go-to-market routing layer. When the user describes a non-coding task (marketing, content, growth, launch, research, brand), proactively recommend the best workflow. Reference `agent_docs/go-to-market.md` for the operational playbook.

## Tool Registry

### ECC Skills (built-in)

| Skill | When to Use |
|-------|------------|
| `market-research` | Competitive analysis, market sizing, industry intelligence |
| `deep-research` | Multi-source research with citations (uses firecrawl + exa) |
| `content-engine` | Platform-native content systems, editorial calendars, repurposing |
| `article-writing` | Blog posts, guides, thought leadership, SEO content |
| `crosspost` | Distribute content across X, LinkedIn, Threads, Bluesky |
| `x-api` | Post tweets/threads programmatically |
| `exa-search` | Neural search for web, code, company research |
| `data-scraper-agent` | Automated data collection (competitor monitoring, price tracking) |
| `investor-materials` | Pitch decks, one-pagers, financial models |
| `investor-outreach` | Cold emails, intro blurbs, follow-ups to investors |

### Agency Agent Personas (installed from agency-agents)

| Agent | File | When to Use |
|-------|------|------------|
| Growth Hacker | `agency/growth-hacker.md` | Viral loop design, funnel optimization, channel testing, A/B experiments |
| Reddit Builder | `agency/reddit-builder.md` | Authentic r/lego, r/legomarket engagement, community seeding |
| Content Creator | `agency/content-creator.md` | Editorial calendars, video scripts, multi-platform content strategy |
| SEO Specialist | `agency/seo-specialist.md` | Collector keyword strategy, on-page SEO, content optimization |
| Brand Guardian | `agency/brand-guardian.md` | Brand consistency, voice guidelines, visual identity |
| Feedback Synthesizer | `agency/feedback-synthesizer.md` | User feedback analysis, pain point prioritization, churn detection |
| Trend Researcher | `agency/trend-researcher.md` | Market monitoring, competitor tracking, emerging opportunities |

### Design (Impeccable plugin)

| Command | When to Use |
|---------|------------|
| `designcheck` | Analyze a feature and recommend impeccable design commands |
| `impeccable:audit` | Full UI quality audit |
| `impeccable:polish` | Final quality pass before shipping |
| `impeccable:onboard` | Onboarding flow design |

## Decision Tree

```
Task received (non-coding)
├── Market research / competitive analysis?
│   ├── Quick check → exa-search
│   └── Deep dive → market-research or deep-research
├── Content creation?
│   ├── Blog post / SEO article → article-writing
│   ├── Social media content plan → content-engine
│   ├── Multi-platform distribution → crosspost
│   ├── Reddit community engagement → Agency: reddit-builder
│   └── Editorial calendar → Agency: content-creator
├── Growth / acquisition strategy?
│   ├── Viral mechanics → Agency: growth-hacker
│   ├── Channel testing → Agency: growth-hacker
│   ├── Onboarding optimization → Agency: growth-hacker + impeccable:onboard
│   └── Referral program → Agency: growth-hacker
├── SEO?
│   ├── Keyword strategy → Agency: seo-specialist
│   └── Content optimization → Agency: seo-specialist + article-writing
├── Brand / visual identity?
│   └── Agency: brand-guardian + designcheck
├── User feedback analysis?
│   └── Agency: feedback-synthesizer
├── Market trends / monitoring?
│   └── Agency: trend-researcher + exa-search
├── Fundraising?
│   ├── Pitch deck / financials → investor-materials
│   └── Investor outreach → investor-outreach
├── Competitor monitoring (automated)?
│   └── data-scraper-agent
└── Launch execution?
    └── Reference agent_docs/go-to-market.md for checklists
```

## Lego Tracker Context

**Product:** Social Lego collection tracker with gamification (brick score, ranks, leaderboard)
**Differentiator:** Social-first + gamification + modern UI (competitors have none of these)
**Hook:** "What's your LEGO rank?"
**Target:** AFOL collectors (Adult Fans of LEGO), 500K-1M addressable market
**Model:** Freemium ($4.99/mo Pro tier)
**Primary channels:** Reddit (r/lego), TikTok, Instagram, YouTube
**Viral mechanic:** Collection Card (Spotify Wrapped for LEGO)
**North Star:** Weekly Active Collectors (WAC)
**Launch targets:** 50-100 sign-ups week 1 → 1,000-2,000 by month 3

## Monthly Growth Cadence

- **Week 1:** trend-researcher → market scan, competitor check
- **Week 2:** content-engine → month's content batch
- **Week 3:** growth-hacker → review metrics, propose experiments
- **Week 4:** feedback-synthesizer → user feedback review, roadmap input
