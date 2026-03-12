# Homepage Brainstorm

> Focus areas: **Dashboard (stats & insights)** and **Social features**

---

## Current State

The homepage currently has:

- **DashboardStatsCard** — 4 boxes: Sets, Pieces, Brick Score, Global Rank
- **RecentlyAdded** — Horizontal carousel of 6 recent sets
- **QuickActions** — "Browse Sets" + "View Vault" buttons
- **FollowingActivity** — 10 recent items from followed users
- **SuggestedCollectors** — 5 random users to follow

It works, but it's flat — stats are plain numbers, social is a simple list, and there's no storytelling around the user's collection or community.

---

## Vision

The homepage should feel like **opening a Lego magazine** — your personal collector dashboard on top, a living social feed below. Two clear zones:

1. **My Collection** (top) — Stats, insights, progress, achievements
2. **Community** (bottom) — What's happening with people you follow and the wider community

---

## Section 1: Dashboard & Stats

### 1A. Stats Hero (redesigned)

Replace the current 4-box grid with a richer stats display:

- **Brick Score** as the centerpiece — large number with a visual rank badge/icon
- **Rank Progress Bar** — how close to the next rank tier (already exists in profile, bring it home)
- **Sets | Pieces | Themes** as secondary stats below
- **Trend indicators** — "+3 sets this month" or "+1,200 pieces this week" (requires tracking deltas or computing from created_at timestamps)

### 1B. Collection Insights Card

A rotating/tabbed card that shows one insight at a time:

- **Theme Breakdown** — mini donut/pie chart or horizontal bars showing top 3-5 themes in collection (data: join user_sets → lego_sets → themes, group by theme)
- **Decade Spread** — what eras the collection spans (group lego_sets.year into decades)
- **Biggest Set** — the set with the most pieces in the collection
- **Rarest Theme** — theme with fewest total owners across the platform
- **Collection vs Wishlist ratio** — visual split

### 1C. Milestones & Achievements

Show recently unlocked or next-upcoming milestones:

- "You hit 50 sets!" / "25 more pieces to 10,000"
- Milestones: 10/25/50/100/250/500 sets, 1K/5K/10K/25K/50K pieces
- Streak-style: "Added sets 3 weeks in a row"
- Visual badges or icons for each milestone

### 1D. Weekly/Monthly Recap (stretch)

A small card: "This month you added 5 sets (420 pieces) across 3 themes. Your Brick Score grew 12%."

---

## Section 2: Social Features

### 2A. Activity Feed (redesigned)

Upgrade the current FollowingActivity from a simple list to a richer feed:

**Event types:**
- **Set Added** — "[User] added [Set Name] to their collection" (already exists)
- **Milestone Hit** — "[User] reached 100 sets!" (new — compute on set addition)
- **New Follower** — "[User] started following you" (new)
- **Wishlist → Collection** — "[User] moved [Set] from wishlist to collection" (new — track status changes)
- **Favorites Updated** — "[User] set [Set] as a favorite" (new)

**Feed UX:**
- Each item: avatar + action text + set thumbnail (when relevant) + relative timestamp
- Grouped by day ("Today", "Yesterday", "This week")
- Infinite scroll or "Load more" pagination
- Empty state: "Follow collectors to see their activity here"

### 2B. Suggested Collectors (redesigned)

Smarter suggestions beyond random:

- **Similar Collectors** — users who own sets/themes in common with you (query: intersect user_sets by set_num or theme)
- **Popular This Week** — users who gained the most followers recently
- **New to BrickBox** — recently joined users to welcome
- Carousel with richer cards: avatar + username + top 3 set thumbnails + "X sets in common"

### 2C. Trending Sets

A "What's Hot" section:

- Sets most added to collections this week/month (query: count user_sets grouped by set_num, filtered by created_at)
- Display as a compact horizontal scroll: image + name + "Added by X collectors this week"
- Optional: filter by user's preferred themes for personalized trending

### 2D. Friends' Favorites Spotlight

Highlight what people you follow love:

- Pick 1-2 followed users, show their 4 favorite sets in a mini grid
- Rotates on each visit or refresh
- "See [username]'s full profile →" link

### 2E. Leaderboard Snippet

Bring a taste of the leaderboard to the homepage:

- Show user's position: "#42 of 1,200 collectors"
- Show 3 users around them (one above, user, one below)
- "View Full Leaderboard →" link
- Optional: weekly movers ("You moved up 5 spots this week")

---

## Layout Proposal

```
┌─────────────────────────────────────────────┐
│  Stats Hero                                 │
│  [Brick Score + Rank Badge]  [Progress Bar] │
│  Sets: 87  │  Pieces: 12.4K  │  Themes: 14 │
│  "+5 sets this month"                       │
├─────────────────────────────────────────────┤
│  Collection Insights  │  Milestones         │
│  [Theme Breakdown     │  ✓ 50 sets reached  │
│   chart/bars]         │  → 15K pieces next   │
│                       │  🔥 3-week streak    │
├─────────────────────────────────────────────┤
│  Trending Sets (horizontal scroll)          │
│  [img] [img] [img] [img] [img] →            │
├─────────────────────────────────────────────┤
│  Activity Feed                              │
│  Today                                      │
│  • @alex added Millennium Falcon            │
│  • @brickfan hit 100 sets!                  │
│  Yesterday                                  │
│  • @collector42 favorited UCS AT-AT         │
│  • @sarah moved Hogwarts to collection      │
│  [Load more]                                │
├─────────────────────────────────────────────┤
│  Collectors You Might Like                  │
│  [card] [card] [card] →                     │
├─────────────────────────────────────────────┤
│  Your Rank: #42                             │
│  #41 @brickmaster  │  #42 YOU  │  #43 @alex │
│  [View Leaderboard →]                       │
└─────────────────────────────────────────────┘
```

Mobile: single column, all sections stack vertically. Stats Hero collapses to a compact version. Feed becomes the primary scrollable content.

---

## Data Requirements

### New Queries Needed

| Query | Purpose | Tables |
|-------|---------|--------|
| `getThemeBreakdown(userId)` | Collection by theme | user_sets → lego_sets → themes |
| `getDecadeSpread(userId)` | Sets grouped by decade | user_sets → lego_sets (year) |
| `getBiggestSet(userId)` | Set with most pieces | user_sets → lego_sets (num_parts) |
| `getTrendingSets(period)` | Most added sets this week/month | user_sets (created_at, count) |
| `getSimilarCollectors(userId)` | Users with overlapping sets/themes | user_sets cross-join |
| `getCollectionDeltas(userId, period)` | Growth stats for trend indicators | user_sets (created_at) |
| `getMilestones(userId)` | Achieved + next milestones | profiles (sets_count, pieces_count) |
| `getLeaderboardContext(userId)` | User's rank + neighbors | profiles (brick_score) |
| `getRichActivityFeed(userId)` | Multi-type activity feed | user_sets + user_favorites + follows |

### Existing Queries to Reuse

- `getDashboardStats` — sets, pieces, brick score, rank
- `getRecentlyAdded` — recent sets (already used)
- `getFollowingActivity` — basic feed (extend, don't replace)
- `getSuggestedUsers` — random suggestions (enhance with similarity)
- `getRankProgress` — rank tier progress (already in profile, reuse on home)

---

## Implementation Priority

### Phase 1 — Quick Wins (use existing data)

1. **Stats Hero redesign** — bring rank progress bar from profile to homepage
2. **Leaderboard snippet** — user's rank + neighbors (data mostly exists)
3. **Milestones card** — compute from existing sets_count/pieces_count
4. **Trending sets** — simple count query on user_sets

### Phase 2 — Collection Insights

5. **Theme breakdown** — new query, simple join + group by
6. **Biggest set / decade spread** — lightweight queries
7. **Collection deltas** — "+X this month" trend indicators

### Phase 3 — Social Enrichment

8. **Rich activity feed** — multiple event types, grouped by day
9. **Similar collectors** — recommendation query
10. **Friends' favorites spotlight** — pull followed users' favorites

---

## Open Questions

- **Performance:** Theme breakdown + trending queries could be expensive at scale. Consider caching or materialized views if needed.
- **Empty states:** Each section needs a compelling empty state that nudges action (add sets, follow users, etc.).
- **Personalization depth:** How much should the homepage adapt to the user's behavior vs. showing a fixed layout?
- **Real-time vs. snapshot:** Should the feed update in real-time (Supabase Realtime) or on page load?
- **Gamification scope:** Are milestones just visual or do they unlock something (badges on profile, etc.)?
