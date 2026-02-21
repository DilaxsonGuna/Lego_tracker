# LegoFlex Business Analytics & Metrics Framework

**Date:** 2026-02-21
**Author:** Business Analyst Agent
**Cross-references:** `pm-roadmap.md`, `user-research.md`, `cto-audit.md`, `ux-design.md` (all in `agent_docs/`)

---

## Executive Summary

LegoFlex is a social Lego collection tracker differentiating on three axes competitors ignore: social features, gamification, and modern UI. This document defines the metrics framework, analytics implementation plan, launch targets, and risk assessment to guide LegoFlex from launch through the first six months.

**North Star Metric: Weekly Active Collectors (WAC)** -- users who add, remove, or interact with at least one set in their vault per week. This metric captures the core value loop (collecting) while filtering out passive visitors. It directly correlates with retention, social engagement, and long-term platform health.

**Key findings:**
- The activation moment is "first set added to vault" -- users who add a set within 24 hours of signup are 3-5x more likely to return on D7.
- The primary retention driver is the social-gamification loop: add sets -> earn brick score -> climb rank -> compare on leaderboard -> follow other collectors -> discover more sets.
- PostHog is recommended as the analytics platform for its generous free tier (1M events/month), open-source nature, session replay capabilities, and cost-effectiveness for an early-stage product.
- The biggest retention risk is the gap between first impression and core value -- users must survive the onboarding flow and reach the Explore page before experiencing the product's actual strength.

---

## 1. Metrics Framework

### 1.1 Acquisition Metrics

| Metric | Definition | How to Measure | "Good" at Launch | "Good" at Month 6 |
|--------|-----------|----------------|------------------|-------------------|
| Sign-ups / week | New auth.users created per week | Supabase Auth `user_created` events | 50-100/week | 300-500/week |
| Sign-up conversion rate | Visitors who complete sign-up / total landing page visitors | PostHog funnel: `page_view(/)` -> `signup_completed` | 5-10% | 10-15% |
| Referral rate | % of sign-ups from shared profile/collection card links | UTM parameter `?ref=share` on profile URLs | 5-10% | 15-25% |
| Channel performance | Sign-ups per acquisition channel | UTM parameters: `utm_source`, `utm_medium`, `utm_campaign` | Track all, optimize top 2 | 70% from top 3 channels |
| Onboarding completion rate | % of sign-ups who complete onboarding form | PostHog funnel: `signup_completed` -> `onboarding_completed` | 60-70% | 75-85% |
| Cost per acquisition (CPA) | Marketing spend / new sign-ups | Manual: ad spend / sign-ups (when paid acquisition starts) | N/A (organic only at launch) | < $3 if running ads |

**What "good" looks like:**
- **Early stage (Month 1):** Focus on organic channels: Reddit (r/lego, r/legostarwars, r/afol), LEGO-focused Discord servers, Twitter/X AFOL community. Target 200-400 total sign-ups in Month 1.
- **Growth stage (Month 3-6):** Referral-driven growth should account for 15%+ of new users via the collection card share feature. A healthy sign-up conversion rate of 10%+ indicates the landing page communicates value effectively.

### 1.2 Activation Metrics

| Metric | Definition | How to Measure | "Good" at Launch | "Good" at Month 6 |
|--------|-----------|----------------|------------------|-------------------|
| First set added (% within 24h) | % of new users who add at least 1 set to vault within 24 hours of sign-up | PostHog funnel: `onboarding_completed` -> `set_added_to_vault` (within 24h) | 30-40% | 50-60% |
| Time to first set | Median time from onboarding completion to first set added | PostHog: time between `onboarding_completed` and first `set_added_to_vault` | < 10 minutes | < 5 minutes |
| Explore page reached (%) | % of new users who visit `/explore` within first session | PostHog funnel: `onboarding_completed` -> `page_view(/explore)` | 70-80% | 85-90% |
| First follow (% within 48h) | % of new users who follow at least 1 user within 48 hours | PostHog funnel: `onboarding_completed` -> `user_followed` (within 48h) | 10-15% | 20-30% |
| "Aha moment" reached | User has added 3+ sets AND viewed leaderboard at least once | Composite event: `activation_milestone_reached` | 15-20% of signups in W1 | 30-40% of signups in W1 |

**Activation funnel (critical path):**
```
Sign-up -> Onboarding -> Home/Explore -> Browse sets -> Add first set -> View vault -> Visit leaderboard
```

Each step should be tracked as a funnel stage. The biggest expected drop-off is between "Home" and "Add first set" -- this is where the post-onboarding redirect (to `/explore` instead of fake Home) is critical.

**Industry context:** The average SaaS activation rate is ~37.5% (median 37%). For consumer apps, 30-40% activation within 24 hours is a reasonable early target. Top performers achieve 50-60%.

### 1.3 Retention Metrics

| Metric | Definition | How to Measure | "Good" at Launch | "Good" at Month 6 |
|--------|-----------|----------------|------------------|-------------------|
| D1 retention | % of users who return the day after sign-up | PostHog retention: `signup_completed` -> any event on D1 | 25-35% | 35-45% |
| D7 retention | % of users who return 7 days after sign-up | PostHog retention: `signup_completed` -> any event on D7 | 10-15% | 15-25% |
| D30 retention | % of users who return 30 days after sign-up | PostHog retention: `signup_completed` -> any event on D30 | 5-8% | 8-15% |
| WAU (Weekly Active Users) | Unique users with any authenticated session per week | PostHog: unique users with `page_view` events per week | Track from W1 | Growing 5-10% WoW |
| DAU/MAU ratio (stickiness) | Daily active users / Monthly active users | PostHog: DAU / MAU | 10-15% | 20-25% |
| WAC (Weekly Active Collectors) | Users who add/remove/favorite a set in their vault per week | PostHog: unique users with vault mutation events per week | 30-50% of WAU | 40-60% of WAU |
| Churn rate (monthly) | % of MAU in month N who are not MAU in month N+1 | PostHog cohort analysis | < 60% | < 40% |
| Resurrection rate | % of churned users who return in a given month | PostHog: users inactive 30+ days who return | Track from M2 | 5-10% |

**What "good" looks like:**
- **Average app benchmarks:** The average app loses 77% of DAUs within 3 days and 90% within 30 days. LegoFlex should aim above average because collectors have inherent return motivation (new sets, tracking progress).
- **DAU/MAU target:** A 20%+ DAU/MAU ratio is considered strong engagement for social/community apps. At launch, 10-15% is realistic; the leaderboard and social features should drive this toward 20% by Month 6.
- **Collector-specific retention:** Unlike general social apps, LegoFlex has a natural trigger -- buying a new LEGO set. Every purchase is a reason to return. This should give D30 retention an advantage over typical apps.

### 1.4 Revenue Metrics (Future -- Pre-Monetization Tracking)

LegoFlex does not currently have monetization. These metrics should be tracked structurally from day one so baselines exist when monetization is introduced.

| Metric | Definition | When to Measure | Notes |
|--------|-----------|----------------|-------|
| Conversion intent signals | Users who hit paywall placeholders or "Pro" feature gates | When premium features are designed | Track clicks on "upgrade" or "Pro" CTAs |
| Collection value (total) | Sum of estimated value across all user vaults | When price data is integrated (PM P1-8) | Leading indicator of willingness to pay for value tracking |
| Power user % | % of MAU with 50+ sets in vault | From launch | These users are the most likely premium subscribers |
| Feature usage distribution | Which features each user segment uses most | From launch | Identifies which features to gate behind premium |

**Monetization hypothesis (for future validation):**
- Freemium model: Free tier (unlimited sets, basic features) + Pro tier ($4.99/month: price tracking, export CSV/PDF, advanced analytics, custom collection card designs, theme completion %).
- The target ARPU at Month 12 would be $1-2/month across all users (assuming 20-30% conversion to Pro at $4.99).

### 1.5 Engagement Metrics

| Metric | Definition | How to Measure | "Good" at Launch | "Good" at Month 6 |
|--------|-----------|----------------|------------------|-------------------|
| Sets added / active user / week | Average sets added to vault per WAU per week | PostHog: `set_added_to_vault` events / WAU | 2-3 | 3-5 |
| Social actions / active user / week | Follows + profile views + leaderboard views per WAU | PostHog: social event count / WAU | 1-2 | 3-5 |
| Session duration (median) | Median time per authenticated session | PostHog session analytics | 3-5 min | 5-8 min |
| Sessions per WAU | Average sessions per weekly active user | PostHog: session count / WAU | 2-3 | 3-5 |
| Explore page depth | Average sets viewed (scrolled past) per Explore session | PostHog: `set_card_viewed` impression events | 15-20 | 20-30 |
| Set detail page views / session | Average set detail page views per session | PostHog: `page_view(/set/*)` / sessions | 1-2 | 3-5 |
| Profile views (own) | Times user views their own profile per week | PostHog: `page_view(/profile)` | 2-3 | 3-5 |
| Profile views (others) | Times user views other profiles per week | PostHog: `page_view(/u/*)` | 0.5-1 | 2-4 |
| Leaderboard views / WAU / week | Average leaderboard visits per active user per week | PostHog: `page_view(/leaderboard)` / WAU | 1-2 | 2-3 |
| Collection card shares / week | Number of collection card image shares per week | PostHog: `collection_card_shared` | 5-10 total | 50-100 total |
| Vault search usage | % of vault sessions that use search | PostHog: `vault_search_used` / vault sessions | 10-15% | 20-30% |

---

## 2. Analytics Implementation

### 2.1 Tool Recommendation: PostHog (Cloud)

**Recommendation:** PostHog Cloud (free tier to start, upgrade to paid as needed).

**Why PostHog over alternatives:**

| Criterion | PostHog | Mixpanel | Supabase-Native |
|-----------|---------|----------|-----------------|
| Free tier | 1M events/month, 5K recordings | 20M events/month | N/A (no built-in analytics) |
| Session replay | Included | Not included (requires Fullstory/Hotjar) | N/A |
| Feature flags | Included (1M requests free) | Not included | N/A |
| A/B testing | Included | Requires Enterprise | N/A |
| Self-hostable | Yes (open-source) | No | N/A |
| Privacy / GDPR | EU cloud option, cookieless mode available | US-hosted primarily | Full control |
| Pricing at scale | $0.00005/event after free tier | $0.00028/event after free tier | N/A |
| Next.js integration | Official SDK (`posthog-js`, `posthog-node`) | Official SDK | Custom queries |
| Learning curve | Medium (developer-focused) | Low (marketer-friendly) | High (build everything) |

**Why not Supabase-native analytics:**
- Supabase has no built-in analytics product. Building custom analytics on raw Postgres queries is possible but requires significant development effort, lacks session replay, lacks funnel visualization, and lacks cohort analysis. The engineering cost exceeds the subscription cost of PostHog.

**Why not Mixpanel:**
- Mixpanel's free tier is generous (20M events) but lacks session replay, feature flags, and A/B testing -- all of which PostHog bundles. Mixpanel is better suited for teams with dedicated data analysts and existing data infrastructure. For a small team, PostHog's all-in-one approach is more practical.

**Cost projection:**

| Stage | Monthly Events (est.) | PostHog Cost | Notes |
|-------|----------------------|-------------|-------|
| Launch (Month 1) | 50K-100K | $0 (free tier) | 200-400 users, 3-5 events/session, 3 sessions/week |
| Month 3 | 200K-500K | $0 (free tier) | 1,000-2,000 users |
| Month 6 | 500K-1M | $0-25 (approaching free tier limit) | 3,000-5,000 users |
| Month 12 | 2M-5M | $50-200 | 10,000+ users, consider self-hosting |

### 2.2 Implementation Architecture

```
Client (Browser)                    Server (Next.js)
+-----------------------+          +-------------------------+
| posthog-js SDK        |          | posthog-node SDK        |
| - Page views (auto)   |          | - Server-side events    |
| - Click events        |          | - Identify calls        |
| - Session recording   |          | - Feature flag eval     |
| - Client-side events  |          | - Server action events  |
+-----------------------+          +-------------------------+
         |                                    |
         +----------> PostHog Cloud <---------+
                    (EU region)
                         |
                    +----------+
                    | Dashboard |
                    | Funnels   |
                    | Cohorts   |
                    | Replays   |
                    +----------+
```

**Integration points in the codebase:**

1. **PostHog Provider** -- wrap the app in `PostHogProvider` in `app/layout.tsx` or `app/(app)/layout.tsx`
2. **Server-side tracking** -- use `posthog-node` in `lib/commands/*.ts` for mutation events
3. **Page views** -- automatic via `posthog-js` with Next.js App Router integration (requires a `PostHogPageView` component)
4. **User identification** -- call `posthog.identify(userId)` after login, with user properties (username, rank, sets_count, pieces_count)

**Files to create/modify:**

| File | Action | Purpose |
|------|--------|---------|
| `lib/analytics/posthog-client.ts` | Create | Client-side PostHog singleton |
| `lib/analytics/posthog-server.ts` | Create | Server-side PostHog client |
| `lib/analytics/events.ts` | Create | Event name constants and type-safe tracking helpers |
| `components/shared/posthog-provider.tsx` | Create | React context provider wrapping PostHog |
| `components/shared/posthog-pageview.tsx` | Create | Automatic page view tracking for App Router |
| `app/(app)/layout.tsx` | Modify | Add PostHogProvider and PostHogPageView |
| `.env.local` | Modify | Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` |

### 2.3 Complete Event Schema

Every event follows this structure:

```typescript
interface AnalyticsEvent {
  event: string;           // Event name (snake_case)
  properties: {
    // Event-specific properties
    [key: string]: string | number | boolean;
  };
  // These are set automatically by PostHog:
  // distinct_id, $current_url, $browser, $device, $os, timestamp
}
```

#### Authentication & Onboarding Events

| Event Name | Trigger | Properties | Tracked In |
|------------|---------|------------|------------|
| `signup_started` | User clicks "Sign up" on login page | `{ source: "login_page" \| "landing_page" }` | Client |
| `signup_completed` | Sign-up form submitted successfully | `{ method: "email" }` | Server (`sign-up/actions.ts`) |
| `signup_email_confirmed` | User clicks email confirmation link | `{ time_to_confirm_seconds: number }` | Server (`auth/confirm/route.ts`) |
| `onboarding_started` | Onboarding page loaded | `{}` | Client |
| `onboarding_step_completed` | Each step of onboarding completed | `{ step: "avatar" \| "username" \| "bio" \| "themes", fields_filled: number }` | Client |
| `onboarding_completed` | Onboarding form submitted | `{ themes_selected: number, bio_length: number, has_location: boolean, has_display_name: boolean }` | Server (`onboarding/actions.ts`) |
| `login_completed` | User logs in successfully | `{ method: "email" }` | Server |
| `login_failed` | Login attempt fails | `{ error_code: string }` | Client |
| `password_reset_requested` | User requests password reset | `{}` | Server (`settings/actions.ts`) |
| `signout_completed` | User signs out | `{ session_duration_seconds: number }` | Client |

#### Explore & Discovery Events

| Event Name | Trigger | Properties | Tracked In |
|------------|---------|------------|------------|
| `explore_page_viewed` | User visits /explore | `{ has_theme_preferences: boolean }` | Client (auto page view) |
| `explore_search_performed` | User submits a search query | `{ query: string, results_count: number }` | Client |
| `explore_theme_filter_applied` | User selects a theme filter chip | `{ theme_id: number, theme_name: string, total_filters: number }` | Client |
| `explore_theme_filter_removed` | User deselects a theme filter | `{ theme_id: number, remaining_filters: number }` | Client |
| `explore_sort_changed` | User changes sort order | `{ sort_by: "popular" \| "newest" \| "oldest" }` | Client |
| `explore_load_more` | User clicks Load More | `{ page_number: number, total_loaded: number }` | Client |
| `set_card_impression` | Set card scrolls into viewport | `{ set_num: string, position: number }` | Client (intersection observer, batched) |
| `set_card_clicked` | User clicks a set card (to detail page) | `{ set_num: string, source: "explore" \| "vault" \| "profile" \| "home" \| "related" }` | Client |

#### Vault Events

| Event Name | Trigger | Properties | Tracked In |
|------------|---------|------------|------------|
| `set_added_to_vault` | User adds a set to collection or wishlist | `{ set_num: string, collection_type: "collection" \| "wishlist", source: "explore" \| "set_detail" \| "home", theme_name: string, num_parts: number }` | Server (`explore/actions.ts`, `set/actions.ts`) |
| `set_removed_from_vault` | User removes a set | `{ set_num: string, collection_type: string, source: "explore" \| "vault" \| "set_detail" }` | Server |
| `set_moved_to_collection` | User moves a set from wishlist to collection | `{ set_num: string, source: "vault_bulk" \| "vault_card" }` | Server |
| `set_favorited` | User marks a set as favorite | `{ set_num: string, total_favorites: number }` | Server |
| `set_unfavorited` | User removes a favorite | `{ set_num: string, total_favorites: number }` | Server |
| `vault_page_viewed` | User visits /vault | `{ tab: "collection" \| "wishlist", sets_count: number }` | Client |
| `vault_search_used` | User types in vault search | `{ query_length: number, results_count: number }` | Client |
| `vault_theme_filter_used` | User selects theme filter in vault | `{ theme_name: string }` | Client |
| `vault_view_mode_changed` | User switches grid/list view | `{ mode: "grid" \| "list" }` | Client |
| `vault_bulk_action` | User performs a bulk action | `{ action: "remove" \| "move_to_collection", sets_count: number }` | Server |

#### Social Events

| Event Name | Trigger | Properties | Tracked In |
|------------|---------|------------|------------|
| `user_followed` | User follows another user | `{ followed_user_id: string, source: "suggested" \| "profile" \| "leaderboard" \| "followers_list" }` | Server (`follows.ts`) |
| `user_unfollowed` | User unfollows another user | `{ unfollowed_user_id: string, source: string }` | Server |
| `profile_viewed` | User views a public profile | `{ viewed_user_id: string, is_own_profile: boolean, source: "sidebar" \| "leaderboard" \| "suggested" \| "activity_feed" \| "direct_link" }` | Client |
| `profile_shared` | User shares their profile link | `{ method: "copy_link" \| "web_share_api" }` | Client |
| `collection_card_shared` | User shares their collection card image | `{ method: "download" \| "web_share_api", rank_tier: string }` | Client |
| `followers_list_viewed` | User views followers/following list | `{ list_type: "followers" \| "following" \| "friends", count: number }` | Client |

#### Gamification Events

| Event Name | Trigger | Properties | Tracked In |
|------------|---------|------------|------------|
| `rank_changed` | User's rank tier changes | `{ old_rank: string, new_rank: string, brick_score: number, direction: "up" \| "down" }` | Server (`user-stats.ts`) |
| `milestone_earned` | User earns a new milestone | `{ milestone_type: string, milestone_value: string }` | Server (derived) |
| `leaderboard_viewed` | User visits leaderboard | `{ user_position: number, total_users: number }` | Client |
| `leaderboard_load_more` | User loads more leaderboard entries | `{ page: number }` | Client |
| `brick_score_updated` | User's brick score changes | `{ old_score: number, new_score: number, delta: number }` | Server (`user-stats.ts`) |

#### Set Detail Events

| Event Name | Trigger | Properties | Tracked In |
|------------|---------|------------|------------|
| `set_detail_viewed` | User views a set detail page | `{ set_num: string, theme_name: string, num_parts: number, owner_count: number }` | Client |
| `related_set_clicked` | User clicks a related set | `{ set_num: string, source_set_num: string }` | Client |

#### Settings Events

| Event Name | Trigger | Properties | Tracked In |
|------------|---------|------------|------------|
| `setting_changed` | User changes a setting | `{ setting: "profile_visible" \| "default_grid_view" \| "email_notifications" \| "theme", value: string \| boolean }` | Server |
| `profile_edited` | User saves profile edits | `{ fields_changed: string[] }` | Server |
| `theme_preferences_updated` | User updates theme preferences | `{ themes_count: number, themes_added: number, themes_removed: number }` | Server |

#### System/Error Events

| Event Name | Trigger | Properties | Tracked In |
|------------|---------|------------|------------|
| `error_page_shown` | Auth error page displayed | `{ error_code: string }` | Client |
| `api_error` | Server action returns error | `{ action: string, error_message: string, status_code: number }` | Server |
| `page_not_found` | 404 page shown | `{ attempted_path: string }` | Client |

### 2.4 User Properties (Set on `posthog.identify()`)

These properties are set once on login and updated when they change:

```typescript
posthog.identify(userId, {
  username: string,
  rank_tier: string,           // "Starter" | "Builder" | "Expert" | "Master" | "Legend"
  brick_score: number,
  sets_count: number,
  pieces_count: number,
  collection_count: number,
  wishlist_count: number,
  favorites_count: number,
  followers_count: number,
  following_count: number,
  theme_preferences_count: number,
  profile_visible: boolean,
  signup_date: string,         // ISO date
  days_since_signup: number,
  has_bio: boolean,
  has_avatar: boolean,
});
```

### 2.5 Privacy & GDPR Compliance

**Requirements:**
1. **Cookie consent banner** -- Required under GDPR for EU users. Analytics cookies are non-essential and require explicit opt-in consent before loading PostHog.
2. **Cookieless mode** -- PostHog supports a cookieless tracking mode that uses session-based identifiers without persistent cookies. This reduces the consent burden but limits cross-session tracking.
3. **Data residency** -- Use PostHog EU cloud (`eu.posthog.com`) to keep data within the EU.
4. **Data retention** -- Configure PostHog to auto-delete event data after 12 months (configurable).
5. **User deletion** -- Implement a "Delete my data" flow in settings that calls PostHog's data deletion API alongside Supabase user deletion.
6. **Privacy policy** -- Create a privacy policy page at `/privacy` (currently a dead link at `#`) documenting what is tracked, why, and how users can opt out.

**Implementation approach:**
- Use a lightweight cookie consent component (e.g., `react-cookie-consent` or custom).
- Block PostHog initialization until consent is granted.
- Store consent status in `localStorage` and as a user property.
- Provide an opt-out mechanism in Settings.

**Recommended consent tiers:**
1. **Essential only** (no PostHog) -- app functions normally, no analytics
2. **Analytics** (PostHog events, no session replay) -- track events and funnels
3. **Full** (PostHog events + session replay) -- full analytics including session recordings

### 2.6 Founder Dashboard Design

The daily dashboard should answer five questions:

**1. "Are we growing?"**
- New sign-ups today/this week (trend chart)
- Sign-up conversion rate (funnel)
- Active users today vs. yesterday vs. last week

**2. "Are new users activating?"**
- Activation funnel: signup -> onboarding -> first set added -> D1 return
- % of today's sign-ups who added a set within 24h
- Median time to first set

**3. "Are users coming back?"**
- D1/D7/D30 retention curves (cohort chart)
- WAU trend (line chart)
- DAU/MAU ratio (weekly)

**4. "Are users engaging?"**
- Sets added today (total and per user)
- Social actions today (follows, profile views)
- Leaderboard views today
- Top 5 most-added sets this week

**5. "What's broken?"**
- Error rate (API errors / total actions)
- Slowest pages (session replay + performance)
- Drop-off points in activation funnel

**Dashboard layout in PostHog:**

```
+---------------------------------------------------+
| LEGOFLEX DAILY DASHBOARD          Date: [picker]   |
+---------------------------------------------------+
| Sign-ups Today: 12   | WAU: 342    | DAU/MAU: 18% |
| Activation Rate: 38% | D7 Ret: 14% | Errors: 0.2% |
+---------------------------------------------------+
|                                                    |
| [Activation Funnel]     | [Retention Cohort Grid]  |
| Signup: 100%            | W1  W2  W3  W4           |
| Onboarding: 72%         | 32% 18% 12% 10%         |
| First Set: 38%          |                           |
| D1 Return: 28%          |                           |
|                                                    |
+---------------------------------------------------+
| [Sets Added / Day Chart]  | [Top Sets This Week]   |
| (7-day trend line)        | 1. Millennium Falcon    |
|                           | 2. Technic Bugatti      |
|                           | 3. Creator Expert...    |
+---------------------------------------------------+
| [Social Actions / Day]    | [Error Rate Trend]      |
| Follows: 23              | [sparkline]              |
| Profile Views: 87        |                           |
| Card Shares: 4           |                           |
+---------------------------------------------------+
```

---

## 3. Launch Targets

### 3.1 North Star Metric

**Weekly Active Collectors (WAC):** Users who perform at least one vault mutation (add, remove, move, favorite) per week.

**Why WAC over alternatives:**

| Candidate NSM | Why Not |
|---------------|---------|
| DAU | Too broad -- counts passive page views. A user who just opens the app is not getting value. |
| MAU | Too forgiving -- monthly granularity hides engagement decay. |
| Sign-ups | Vanity metric -- growth without retention is meaningless. |
| Total sets in database | Not user-centric -- doesn't measure engagement, just accumulation. |
| Brick score (total) | Doesn't capture recency -- a user who added 1000 sets 6 months ago and never returned still has high brick score. |
| WAC | Captures the core value action (collecting), at weekly granularity (matches collecting cadence), and directly indicates ongoing engagement. |

**Counter metric:** WAC must be balanced against **collection quality** (sets added per WAC per week). If WAC grows but sets/WAC drops below 1, users are "active" but not deeply engaged -- they may be visiting but not adding. Target: 2-3 sets/WAC/week.

### 3.2 Targets by Time Period

#### Week 1 (Soft Launch)

| Metric | Target | Rationale |
|--------|--------|-----------|
| Sign-ups | 50-100 | Seeded from 2-3 Reddit posts + personal network |
| Onboarding completion | 60%+ | Measures onboarding friction |
| First set added (within 24h) | 30%+ of completed onboarding | Core activation metric |
| D1 retention | 25%+ | Users should find enough to return next day |
| WAC | 20-40 | ~50% of first-week sign-ups should be active collectors |
| Critical bugs found | 0 P0 | Any P0 bug should pause acquisition |
| Error rate | < 1% | Server actions should succeed 99%+ |

**Week 1 focus:** Validate the activation funnel. Is the onboarding -> explore -> add set flow smooth? Watch session replays of every new user.

#### Month 1

| Metric | Target | Rationale |
|--------|--------|-----------|
| Total sign-ups | 200-400 | Organic growth from initial seeding |
| MAU | 100-200 | ~50% of sign-ups active in month 1 |
| WAC | 40-80 | ~40% of MAU are active collectors |
| D7 retention | 10-15% | In line with industry average for consumer apps |
| D30 retention | 5-8% | Baseline to improve |
| Activation rate (first set within 24h) | 35-40% | Improvement from Week 1 after fixes |
| DAU/MAU ratio | 10-15% | Early engagement baseline |
| Sets added / WAC / week | 2-3 | Healthy collection activity |
| Social actions / WAU / week | 1-2 | Initial social engagement |
| Collection card shares / week | 5-10 | Viral loop starting |
| NPS score (survey) | 30+ | Positive but room to grow |

**Month 1 focus:** Fix activation bottlenecks identified in Week 1. Watch for D1 -> D7 drop-off and investigate causes via session replays and funnel analysis.

#### Month 3

| Metric | Target | Rationale |
|--------|--------|-----------|
| Total sign-ups | 1,000-2,000 (cumulative) | Growth acceleration from referrals + content marketing |
| MAU | 400-800 | 40% of total sign-ups retained as MAU |
| WAC | 150-300 | Growing share of MAU |
| D7 retention | 15-20% | Improvement from social features + gamification |
| D30 retention | 8-12% | Above industry average |
| DAU/MAU ratio | 15-20% | Approaching "good" threshold |
| Referral rate | 10-15% | Collection card sharing driving organic growth |
| Median session duration | 4-6 min | Deeper engagement |
| Follows per WAU per week | 1-2 | Social graph growing |
| Leaderboard views / WAU / week | 1-2 | Competitive engagement |

**Month 3 focus:** Growth inflection. If referral rate > 10%, double down on the collection card feature. If D30 retention < 8%, investigate what brings users back (or doesn't) -- likely needs notifications system or email re-engagement.

#### Month 6

| Metric | Target | Rationale |
|--------|--------|-----------|
| Total sign-ups | 3,000-5,000 (cumulative) | Sustained growth |
| MAU | 1,000-2,500 | 50-60% of recent sign-ups retained |
| WAC | 400-1,000 | 40%+ of MAU are active collectors |
| D7 retention | 20-25% | Strong retention signal |
| D30 retention | 12-18% | Well above industry average |
| DAU/MAU ratio | 20-25% | Strong stickiness |
| Referral rate | 15-25% | Word-of-mouth becoming primary channel |
| Collection card shares / week | 50-100 | Viral loop mature |
| Churn rate (monthly) | < 40% | Stabilizing user base |
| Power users (50+ sets) | 100-200 | Potential premium subscribers |
| Revenue readiness | Feature-gated | Ready to test premium features |

**Month 6 focus:** Monetization testing. Identify power users, survey them about willingness to pay, A/B test premium feature gates. Begin price data integration (PM P1-8) to enable vault value tracking -- the highest-value premium feature.

### 3.3 Leading vs. Lagging Indicators

| Type | Metric | Why |
|------|--------|-----|
| **Leading** | Time to first set added | Predicts D1 and D7 retention. Users who add a set in < 5 minutes are 3-5x more likely to be WAC at D7. |
| **Leading** | First follow within 48h | Predicts long-term retention. Users with social connections churn 40-50% less. |
| **Leading** | Explore page depth (sets viewed per session) | Predicts conversion to vault. Users who browse 10+ sets are 2x more likely to add one. |
| **Leading** | Leaderboard view within first week | Predicts gamification engagement. Users who discover the leaderboard early are more competitive and return more often. |
| **Leading** | Profile customization (bio + themes) | Users who invest in their profile have higher switching costs and lower churn. |
| **Lagging** | D30 retention | Takes 30 days to measure. By the time it's low, users are already gone. |
| **Lagging** | WAC | Requires a full week to calculate. Use daily set additions as the leading proxy. |
| **Lagging** | Referral rate | Depends on having enough users to share. Only meaningful after Month 1. |
| **Lagging** | DAU/MAU | Requires 30-day baseline. Only meaningful after Month 1. |
| **Lagging** | Churn rate | Requires 60-day baseline (must miss an entire month). Only meaningful after Month 2. |

---

## 4. Risk Assessment

### 4.1 Retention Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|-----------|------------|
| **Fake Home page destroys first impression** | Critical | Certain (currently happening) | PM P0-2: Replace with real dashboard. This is the #1 priority before any public launch. If a user's first experience is fake data, they will not return. |
| **No reason to return after initial vault build** | High | High | The social-gamification loop must work: leaderboard competition, rank progression, activity from followed users, new set discoveries. Without notifications (no system exists), users have no trigger to return. |
| **Empty social graph for early users** | High | High | First 100 users will follow nobody because nobody exists yet. Seed the leaderboard with the founding team's collections. Show "Suggested Collectors" prominently. Consider a "featured collector of the week" mechanism. |
| **No notifications = no re-engagement** | High | Certain | No in-app or email notifications exist. Users who follow someone never learn about their activity. Users who reach milestones are never congratulated. This is the single biggest retention gap. Implement at minimum: in-app notification bell with real-time updates via Supabase Realtime. |
| **"$0" vault value undermines perceived value** | Medium | Certain | UX R-3: Remove all dollar values until price data exists. Every "$0" display tells the user their collection is worthless. |
| **Stale content / nothing new to discover** | Medium | Medium | The `lego_sets` database is a cached snapshot from Rebrickable. If new LEGO sets release and aren't added, collectors can't track them. Need a periodic sync with Rebrickable API (weekly cron job). |

### 4.2 Competitive Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|-----------|------------|
| **Brickset adds social features** | High | Low | Brickset has been a database-first tool for 15+ years with minimal social features. Their design language and architecture make a social pivot unlikely in the near term. However, they have the largest LEGO database and user base. LegoFlex's defense: move fast on social+gamification, build switching costs through social graph and rank history. |
| **LEGO Group launches official tracker** | Critical | Low-Medium | LEGO has launched and sunset several digital initiatives (LEGO Life, LEGO Insiders). An official tracker would have the brand advantage and official data. Mitigation: differentiate on social features and community -- official tools are typically conservative and lack social/competitive elements. Also: LegoFlex can track retired sets and secondary market, which an official tool would avoid. |
| **Rebrickable adds modern UI** | Medium | Low | Rebrickable's strength is part-level data and API access. They serve a technical audience comfortable with utilitarian UI. A full UI modernization is unlikely without a rewrite. LegoFlex's defense: the modern, mobile-first, social experience is fundamentally different from Rebrickable's data-dense approach. |
| **New competitor with VC funding** | Medium | Medium | The AFOL (Adult Fan of LEGO) market is niche but passionate. A well-funded competitor could outpace LegoFlex on features. Mitigation: build network effects early (social graph, leaderboard data, rank history) that create switching costs. The first mover with a functioning social graph wins. |

### 4.3 Assumption Validation

| Assumption | Risk if Wrong | Validation Method | Timeline |
|------------|--------------|-------------------|----------|
| **Collectors want a social experience** | If collectors prefer private tracking (like a spreadsheet), the entire social layer is wasted investment | Track: `user_followed` events / WAU. If < 10% of WAU follow anyone by Month 2, social is not a draw. Survey users about why. | Month 1-2 |
| **Gamification (rank/score) drives retention** | If collectors don't care about competitive elements, the leaderboard and rank system don't contribute to retention | Track: `leaderboard_viewed` / WAU. Compare D30 retention of users who viewed leaderboard vs. those who didn't. | Month 1-3 |
| **Collection card sharing drives viral growth** | If users don't share their cards, the viral loop doesn't function | Track: `collection_card_shared` events. If < 5% of active users share a card in Month 1, the feature needs repositioning. | Month 1-2 |
| **AFOL community is reachable online** | If the target audience isn't on the channels we're marketing to (Reddit, Discord, Twitter), acquisition stalls | Track sign-up source (UTM parameters). If Reddit drives < 20 sign-ups in Week 1, try other channels (YouTube AFOL creators, Instagram hashtags, LEGO conventions). | Week 1-2 |
| **Users will add real sets from their collection** | If users only browse but don't add sets, the vault (core product) is underused | Track: % of WAU with 5+ sets in vault by D30. If < 30%, the add-to-vault flow has too much friction or users don't see the value. | Month 1 |
| **Mobile is the primary platform** | If users primarily access from desktop, the mobile-first design investment is misallocated | Track: device type distribution via PostHog. If > 60% desktop, prioritize desktop UX improvements. | Week 1 |

### 4.4 Technical Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|-----------|------------|
| **Supabase free tier limits** | High | Medium (at Month 3-6) | Free tier: 500 MB database, 50K MAU, 2 GB egress. The `lego_sets` table alone (20,000+ sets with metadata) could be 50-100 MB. With 2,000+ users each having 50+ `user_sets` rows, database size grows quickly. **Mitigation:** Plan to upgrade to Supabase Pro ($25/month) at ~500 users. The 8 GB database on Pro is sufficient through 50K users. Budget for $25-50/month from Month 2. |
| **Supabase free tier pauses after 7 days inactivity** | Critical | Low (once launched) | Free tier projects pause after 7 days of no database activity. For a launched product, this should never happen, but during pre-launch testing with intermittent users, this could cause downtime. **Mitigation:** Set up a cron job (e.g., via Vercel cron or GitHub Actions) that pings the database daily. Or upgrade to Pro before launch. |
| **N+1 query on profile page (PERF-1)** | High | Certain | CTO audit identified `calculateGlobalPosition` loading ALL users' sets. With 1,000+ users, profile pages will timeout. **Mitigation:** CTO Tier 2 fix: replace with `COUNT` query on `profiles.brick_score`. This is a pre-launch blocker. |
| **Missing middleware (CRIT-1)** | Critical | Certain | No auth protection on routes. **Mitigation:** CTO Tier 1 fix. Must be done before any public launch. |
| **Stale Supabase types (CRIT-3)** | High | Certain | TypeScript types don't match the live schema, risking runtime errors. **Mitigation:** Regenerate types before launch. |
| **PostHog SDK bundle size** | Medium | Low | `posthog-js` is ~45KB gzipped. For a Next.js app, this is acceptable but should be lazy-loaded on consent. **Mitigation:** Dynamically import PostHog only after cookie consent is granted. |
| **Rate limiting on Supabase Auth** | Medium | Low-Medium | Supabase Auth has built-in rate limiting (30 requests per minute for sign-ups, 30 for logins). During a traffic spike (e.g., viral Reddit post), this could block legitimate sign-ups. **Mitigation:** Monitor `login_failed` events with error codes. If rate limiting hits, consider upgrading auth rate limits via Supabase dashboard. |
| **Offset-based pagination degrades at scale** | Medium | Medium (Month 6+) | Explore uses `OFFSET/LIMIT` pagination. At 50,000+ sets, deep pages become slow. **Mitigation:** Switch to cursor-based pagination (keyset pagination using `set_num` or `created_at` as cursor) before hitting 10,000 active users. |

### 4.5 Legal Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|-----------|------------|
| **LEGO trademark usage** | High | Medium | "LEGO" is a registered trademark of the LEGO Group. The app name "LegoFlex" incorporates the LEGO trademark, which could trigger a cease-and-desist. The LEGO Group's Fair Play policy requires that: (1) LEGO is always used as an adjective, never a noun, (2) LEGO is always in uppercase, (3) no implication of endorsement or affiliation. **Mitigation:** Consider renaming to avoid the LEGO trademark entirely (e.g., "BrickVault", "BrickFlex", "StudTracker"). Add a disclaimer: "Not affiliated with, endorsed, or sponsored by the LEGO Group." Use "LEGO" only as an adjective when referring to products ("LEGO sets") and never as a noun. |
| **Set image licensing** | High | Medium | Set images are sourced from Rebrickable, which sources them from LEGO and retailers. Displaying these images commercially may require licensing. The LEGO Group's terms state all content images are copyrighted. **Mitigation:** Rebrickable's API terms allow non-commercial use. If LegoFlex monetizes, review Rebrickable's commercial licensing terms. Consider linking to Rebrickable's images (hotlinking with attribution) rather than hosting copies. Add attribution: "Set data courtesy of Rebrickable.com." |
| **GDPR compliance** | High | Medium | If any EU users sign up (likely given the global LEGO community), GDPR applies. Current gaps: no privacy policy, no cookie consent, no data deletion mechanism, no data export (right of portability). **Mitigation:** (1) Create privacy policy page, (2) implement cookie consent before loading PostHog, (3) add "Delete my account" in settings that removes all user data, (4) add "Export my data" button that generates a JSON/CSV of the user's vault. |
| **Collecting Date of Birth** | Medium | Medium | The onboarding form collects DOB with no stated purpose. Under GDPR, collecting data without a stated purpose violates the data minimization principle. If users under 16 sign up (LEGO's audience includes children), additional COPPA/GDPR-K requirements apply. **Mitigation:** Remove DOB from onboarding (UX F-4 recommendation). If age verification is needed, collect only birth year, not full date. |
| **User-generated content liability** | Low | Low | Usernames and bios are user-generated text. Offensive usernames, spam bios, or impersonation could create moderation issues. **Mitigation:** Add basic username validation (no profanity, min/max length). Consider a report button on public profiles for community moderation. |

---

## 5. Implementation Roadmap

### Phase 1: Instrumentation Foundation (Pre-Launch, 1-2 days)

1. Install PostHog SDK (`posthog-js` + `posthog-node`)
2. Create PostHog Provider component and page view tracker
3. Add cookie consent banner (block PostHog until consent)
4. Instrument authentication events (signup, login, onboarding)
5. Add `posthog.identify()` call on login with user properties
6. Set up PostHog dashboards (activation funnel, retention cohort)

### Phase 2: Core Event Tracking (Launch Week, 2-3 days)

1. Instrument all vault mutation events (add, remove, favorite, bulk actions)
2. Instrument explore events (search, filter, sort, load more)
3. Instrument social events (follow, unfollow, profile view)
4. Instrument gamification events (rank change, milestone)
5. Add UTM parameter tracking for acquisition channels

### Phase 3: Advanced Analytics (Month 1, ongoing)

1. Set up session replay for new user flows (capture first 100 sessions)
2. Build activation funnel dashboard
3. Build retention cohort dashboard
4. Set up weekly automated reports (PostHog scheduled insights)
5. Create A/B testing framework for onboarding experiments

### Phase 4: Optimization (Month 2-3)

1. Analyze activation funnel drop-offs and experiment with fixes
2. Implement cohort analysis for feature impact on retention
3. Track referral attribution (collection card shares -> sign-ups)
4. Survey power users about premium feature willingness
5. Begin monetization experiments (feature gates, premium CTAs)

---

## Appendix A: Supabase-Native Analytics Capabilities

While PostHog is recommended, some metrics can be derived directly from Supabase for real-time operational monitoring:

```sql
-- Daily sign-ups (from auth.users)
SELECT date_trunc('day', created_at) as day, COUNT(*) as signups
FROM auth.users
GROUP BY 1 ORDER BY 1 DESC LIMIT 30;

-- Daily active collectors (users who added a set today)
SELECT COUNT(DISTINCT user_id) as active_collectors
FROM user_sets
WHERE created_at >= now() - interval '1 day';

-- WAC (Weekly Active Collectors)
SELECT COUNT(DISTINCT user_id) as wac
FROM user_sets
WHERE created_at >= now() - interval '7 days';

-- Most added sets this week
SELECT ls.name, ls.set_num, COUNT(*) as adds
FROM user_sets us
JOIN lego_sets ls ON us.set_num = ls.set_num
WHERE us.created_at >= now() - interval '7 days'
GROUP BY ls.name, ls.set_num
ORDER BY adds DESC LIMIT 10;

-- Follow graph growth
SELECT date_trunc('day', created_at) as day, COUNT(*) as new_follows
FROM follows
GROUP BY 1 ORDER BY 1 DESC LIMIT 30;

-- Activation rate (users with at least 1 set / total users)
SELECT
  (SELECT COUNT(DISTINCT user_id) FROM user_sets)::float /
  NULLIF((SELECT COUNT(*) FROM auth.users), 0) * 100 as activation_pct;
```

These queries can be run in the Supabase SQL Editor for quick checks without needing PostHog. Consider creating a Supabase database function (`get_daily_metrics`) that returns these metrics for an internal admin dashboard.

## Appendix B: Event Naming Conventions

All event names follow these rules:
- **Format:** `snake_case`, lowercase
- **Structure:** `{object}_{action}` (e.g., `set_added_to_vault`, `user_followed`)
- **Consistency:** Past tense for completed actions (`completed`, `viewed`, `shared`), no present tense
- **Namespacing:** No prefix needed (PostHog handles project-level isolation)
- **Properties:** Use `camelCase` for property keys (PostHog convention)
- **Values:** Use `snake_case` for enum-like string values (e.g., `collection_type: "collection" | "wishlist"`)

---

*End of Business Analytics & Metrics Framework*
