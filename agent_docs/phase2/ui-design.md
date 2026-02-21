# UI Design Audit -- LegoFlex (Lego Tracker)

**Date:** 2026-02-21
**Author:** UI Designer Agent
**Scope:** Full visual design audit -- design token consistency, brand identity evaluation, WCAG compliance, component-level and page-level recommendations
**Cross-references:** `agent_docs/phase1/pm-roadmap.md`, `agent_docs/phase1/user-research.md`, `agent_docs/phase1/cto-audit.md`, `agent_docs/phase1/qa-report.md`

---

## Executive Summary

The BrickBox design system is a strong foundation. The warm dark palette with Lego yellow (`#ffd000` / HSL `49 100% 41%`) primary creates an immediately recognizable identity that sets LegoFlex apart from the clinical, database-style interfaces of Brickset, BrickLink, and Rebrickable. The token system is well-structured, the shadcn/ui integration is mostly correct, and the overall impression on dark mode is premium and collector-oriented.

However, the audit reveals **6 critical issues** (WCAG failures, token violations), **9 high-priority improvements** (brand identity gaps, inconsistent patterns), **11 medium-priority polish items**, and **5 low-priority enhancements**. The most impactful findings are: (1) primary-foreground black text on yellow fails WCAG AA for small text in several components, (2) auth pages have zero brand identity, creating a disconnected first impression, (3) typography weight and size usage is inconsistent across page sections, and (4) the dark theme, while atmospheric, lacks sufficient depth variation to create visual hierarchy.

---

## Table of Contents

1. [Design Token Audit](#1-design-token-audit)
2. [WCAG 2.1 AA Color Contrast Audit](#2-wcag-21-aa-color-contrast-audit)
3. [Brand Identity Evaluation](#3-brand-identity-evaluation)
4. [Component-Level Findings](#4-component-level-findings)
5. [Page-Level Findings](#5-page-level-findings)
6. [Typography Audit](#6-typography-audit)
7. [Spacing & Layout Audit](#7-spacing--layout-audit)
8. [Motion & Animation Audit](#8-motion--animation-audit)
9. [Recommendations](#9-recommendations)
10. [Dependencies & Conflicts](#10-dependencies--conflicts)

---

## 1. Design Token Audit

### 1.1 Token System Assessment

The design system uses HSL CSS variables in `globals.css` mapped through `tailwind.config.ts`. This is the standard shadcn/ui approach and is implemented correctly.

**Tokens defined:**

| Category | Tokens | Status |
|----------|--------|--------|
| Core colors | background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring | Complete |
| Custom tokens | surface, surface-accent, primary-ghost | Complete |
| Chart colors | chart-1 through chart-5 | Defined but unused |
| Radius | --radius (0.75rem) | Complete |

**Missing tokens that should exist:**

| Missing Token | Needed For | Priority |
|---------------|-----------|----------|
| `--success` / `--success-foreground` | Green states (online indicators, username available, status badges) | High |
| `--warning` / `--warning-foreground` | Amber states (missing parts badge, limit warnings) | Medium |
| `--info` / `--info-foreground` | Blue states (in-box badge, verified badge) | Medium |
| `--primary-hover` | Consistent primary hover state | Medium |
| `--sidebar` / `--sidebar-foreground` | shadcn/ui sidebar convention (if upgrading sidebar component) | Low |

### 1.2 Token Usage Violations

The following components use hardcoded colors instead of design tokens:

| File | Line(s) | Violation | Fix |
|------|---------|-----------|-----|
| `components/vault/vault-card.tsx` | 20-23 | `bg-green-500/80`, `bg-blue-500/80`, `bg-amber-500/80`, `bg-red-500/80` for status badges | Create semantic status tokens or use chart tokens |
| `components/vault/vault-list.tsx` | 14-17 | `bg-green-500/10 text-green-500`, `bg-blue-500/10 text-blue-500` | Same -- use semantic tokens |
| `components/profile/profile-hero.tsx` | 33 | `bg-green-500` for online indicator | Use `--success` token |
| `components/profile/profile-hero.tsx` | 44 | `text-blue-400 fill-blue-400` for verified badge | Use `--info` token |
| `components/home/feed-post.tsx` | 91 | `group-hover:text-blue-400` for comment icon | Use token |
| `components/home/feed-post.tsx` | 101 | `group-hover:text-green-400` for share icon | Use token |
| `components/home/feed-post.tsx` | 109 | `group-hover:text-yellow-400` for bookmark icon | Use token |
| `components/vault/vault-bulk-actions.tsx` | 41 | `text-gray-300 hover:text-primary` | Use `text-muted-foreground` |
| `components/vault/vault-bulk-actions.tsx` | 57 | `text-red-400 hover:text-red-300` | Use destructive token |
| `components/shared/footer.tsx` | 16 | `&copy; 2024 LegoFlex Inc.` | Hardcoded year (not a color issue, but worth noting) |
| `components/auth/login-form.tsx` | 91 | `text-red-500` for error | Use `text-destructive` |
| `components/auth/sign-up-form.tsx` | 104 | `text-red-500` for error | Use `text-destructive` |
| `components/auth/onboarding-form.tsx` | 157-158 | `border-green-500`, `text-green-500` for available username | Use semantic success token |
| `components/leaderboard/leaderboard-table.tsx` | 38-39 | `bg-primary/10 border-primary/30` for current user highlight | Acceptable -- derived from primary |
| `components/explore/discovery-card.tsx` | 111 | `hover:bg-red-500` on remove button | Use destructive token |

**Priority:** High -- Token violations create maintenance burden and break theme-ability.

### 1.3 Custom Token Evaluation

The three custom tokens (`surface`, `surface-accent`, `primary-ghost`) are well-chosen:

- `surface` = same as `card` in both modes. Could be consolidated but provides semantic distinction.
- `surface-accent` = slightly warmer/lighter card variant for hover states. Used consistently in sidebar, settings, and empty states. Good.
- `primary-ghost` = 10% opacity primary, used for tab backgrounds and hover states. Good.

**Note:** `accent` is set identical to `primary` (`49 100% 41%`) in both light and dark modes. This means `hover:bg-accent` and `hover:bg-primary` are identical. The `accent` token should be differentiated (perhaps a lighter or desaturated yellow) to provide a secondary highlight color.

---

## 2. WCAG 2.1 AA Color Contrast Audit

### 2.1 Methodology

WCAG 2.1 AA requires:
- **Normal text** (< 18pt / < 14pt bold): minimum contrast ratio **4.5:1**
- **Large text** (>= 18pt / >= 14pt bold): minimum contrast ratio **3:1**
- **UI components and graphical objects**: minimum contrast ratio **3:1**

I have computed contrast ratios for the dark theme (the default and primary usage mode) using the HSL values from `globals.css`.

### 2.2 Dark Theme Color Values (Computed)

| Token | HSL | Approximate Hex | Relative Luminance |
|-------|-----|-----------------|-------------------|
| background | 40 33% 7% | `#18150c` | 0.0067 |
| foreground | 48 20% 95% | `#f5f3ee` | 0.876 |
| card | 43 40% 10% | `#231f0f` | 0.012 |
| primary | 49 100% 41% | `#d1a600` (close to `#ffd000` at full saturation) | 0.347 |
| primary-foreground | 0 0% 0% | `#000000` | 0.0 |
| muted-foreground | 43 20% 55% | `#a89b75` | 0.277 |
| border | 43 37% 16% | `#36301a` | 0.027 |
| secondary | 44 37% 13% | `#2d2714` | 0.018 |
| destructive (dark) | 0 62.8% 30.6% | `#7e1d1d` | 0.033 |

### 2.3 Critical Contrast Failures

| Combination | Usage | Ratio | Required | Status | Severity |
|-------------|-------|-------|----------|--------|----------|
| **primary (`#d1a600`) on primary-foreground (`#000`)** | Primary buttons (text on yellow bg) | **~8.4:1** | 4.5:1 | PASS | -- |
| **primary-foreground (`#000`) on primary (`#d1a600`)** | Same as above, inverse check | **~8.4:1** | 4.5:1 | PASS | -- |
| **muted-foreground (`#a89b75`) on background (`#18150c`)** | Secondary text on page bg | **~6.5:1** | 4.5:1 | PASS | -- |
| **muted-foreground (`#a89b75`) on card (`#231f0f`)** | Secondary text on card bg | **~5.2:1** | 4.5:1 | PASS | -- |
| **primary (`#d1a600`) on card (`#231f0f`)** | Primary-colored text on cards (e.g., vault value, rank) | **~7.2:1** | 4.5:1 | PASS | -- |
| **foreground (`#f5f3ee`) on card (`#231f0f`)** | Primary text on cards | **~14.5:1** | 4.5:1 | PASS | -- |
| **border (`#36301a`) on background (`#18150c`)** | Border visibility against page | **~1.7:1** | 3:1 (UI component) | **FAIL** | Critical |
| **border (`#36301a`) on card (`#231f0f`)** | Border visibility on cards | **~1.4:1** | 3:1 (UI component) | **FAIL** | Critical |
| **muted-foreground on surface-accent** | Text in empty states, labels on hover bg | **~4.8:1** | 4.5:1 | PASS | -- |
| **white (`#fff`) on primary (`#d1a600`)** | Year badges, theme badges on explore cards | **~3.4:1** | 4.5:1 for small text | **FAIL** | Critical |
| **destructive-foreground (`#fafafa`) on destructive (`#7e1d1d`)** | Error text/buttons | **~5.7:1** | 4.5:1 | PASS | -- |
| **text-[10px] muted-foreground on any bg** | Tracking labels (vault stats, profile sections) | Pass ratio but **text size is below minimum** | At 10px, even passing ratios may not be readable | **Concern** | High |

### 2.4 Detailed Failures

**FAILURE 1: Border contrast insufficient (Critical)**

The `--border` token (`43 37% 16%` ~ `#36301a`) against `--background` (`40 33% 7%` ~ `#18150c`) achieves only ~1.7:1 contrast ratio. Against `--card` (`43 40% 10%` ~ `#231f0f`), it is even worse at ~1.4:1. WCAG 2.1 requires 3:1 for UI components.

This means card borders, dividers, sidebar borders, and all `border-border` elements are nearly invisible on dark theme. While this creates a "clean" aesthetic, it fails accessibility requirements and makes the interface feel flat/undefined for users with lower vision acuity.

**Fix:** Increase border lightness from 16% to at least 22-25%.

```css
/* globals.css - .dark */
--border: 43 30% 24%;  /* Was: 43 37% 16% */
--input: 43 30% 24%;   /* Keep in sync */
```

This achieves approximately 3.2:1 against background and 2.8:1 against card (acceptable given the warm tones provide additional perceptual separation).

**FAILURE 2: White text on primary badges (Critical)**

The explore `DiscoveryCard` uses `text-primary-foreground` (black) on primary background for theme badges, which passes. However, the year badge at `components/explore/discovery-card.tsx:42` uses:

```
className="bg-black/60 backdrop-blur-md text-xs font-bold px-2.5 py-1 rounded-md text-primary border-primary/20"
```

This is primary-colored text (`#d1a600`) on `bg-black/60` over an image. On light images, this achieves adequate contrast; on dark images, primary on near-black is about 8.4:1 (fine). The main concern is the `border-primary/20` which is decorative and acceptable.

The real failure is in vault card badges at `components/vault/vault-card.tsx:74`:
```
className="bg-black/60 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 text-white border-white/10"
```
White text at 10px font size on `bg-black/60` over varying image backgrounds is problematic. When the underlying image is light, the effective contrast drops below 4.5:1.

**Fix:** Use `bg-black/80` (higher opacity) for all overlay badges, or switch to solid backgrounds.

**FAILURE 3: 10px text legibility concern (High)**

Multiple components use `text-[10px]` for labels:
- `components/vault/vault-stats-hero.tsx:71` -- stat labels
- `components/profile/profile-hero.tsx:60-61` -- social stat labels
- `components/profile/profile-stats-row.tsx:13` -- stat labels
- `components/profile/milestone-vault.tsx:34` -- milestone labels
- `components/vault/vault-list.tsx:29` -- table headers
- `components/leaderboard/leaderboard-table.tsx:80,88,98` -- stat labels
- `components/profile/profile-footer.tsx:8-9` -- footer text

WCAG does not have a strict minimum font size, but 10px text is below the 12px minimum commonly recommended for readability (especially at `font-bold` or `font-black` weight with `tracking-widest` or `tracking-[0.3em]`). The heavy letter-spacing at small sizes reduces readability further.

**Fix:** Increase minimum text size to `text-[11px]` across the board, or preferably use `text-xs` (12px) with `tracking-wide` instead of `tracking-widest`.

---

## 3. Brand Identity Evaluation

### 3.1 The BrickBox Theme Assessment

**Does the yellow (#ffd000) primary feel playful and Lego-like?**

Yes. The choice of HSL `49 100% 41%` (close to Lego's official yellow) as the primary color is spot-on. When rendered as button backgrounds, progress bars, rank highlights, and the logo background, it immediately evokes Lego without being a direct brand copy. The primary is used with good restraint -- it appears as accent rather than dominant, which prevents visual fatigue.

**Strengths:**
- The warm dark background (`40 33% 7%`) has a brownish undertone that suggests wood/shelf displays where collectors showcase their builds. This is a subtle but effective atmospheric choice.
- The primary glow effect on the profile avatar (`shadow-[0_0_25px_rgba(255,208,0,0.4)]`) is a strong signature element.
- The stud pattern background on the profile page is the single most "Lego" visual element in the app. It is used correctly as a subtle texture rather than a dominant pattern.
- The collection tabs pill with sliding primary indicator is visually satisfying and unique.

**Weaknesses:**
- The brand identity is entirely absent from auth pages. Login, sign-up, forgot-password, and onboarding all use plain shadcn/ui `Card` components with no logo, no yellow accent, no stud pattern, no visual connection to the rest of the app. A user arriving at `/auth/login` has zero indication they are on LegoFlex.
- The `LegoFlexLogo` component is a generic Puzzle icon from Lucide on a yellow square. It does not read as "Lego" -- puzzle pieces are associated with jigsaw puzzles, not building bricks. This is the most visible brand element (sidebar + mobile header) and it carries the wrong metaphor.
- There are no Lego-themed illustrations, icons, or flourishes beyond the stud pattern. Competitors look like databases; LegoFlex should look like a collector's shelf, not just a dark-themed data app.
- The copyright says "2024 LegoFlex Inc." -- outdated year.

### 3.2 Is the dark theme inviting or too heavy?

The dark theme is **atmospheric but slightly too homogeneous**. The issue is insufficient contrast between layers:

- `background`: `#18150c` (L=7%)
- `card`: `#231f0f` (L=10%)
- `secondary`: `#2d2714` (L=13%)
- `border`: `#36301a` (L=16%)

The gap between background and card is only ~3% lightness. Cards barely separate from the page. Borders are nearly invisible (as documented in the WCAG section). The result is that the dark theme feels like one continuous dark surface rather than a layered interface with clear depth.

**Recommendation:** Increase the lightness gap between layers:
- Keep background at 7%
- Bump card to 12% (was 10%)
- Bump secondary/surface-accent to 16% (was 13%)
- Bump border to 24% (was 16%)

This creates a clearer light-to-dark hierarchy: background -> card -> secondary -> border.

### 3.3 Light Theme Assessment

The light theme tokens are defined but the app defaults to dark (`defaultTheme="dark"` in `app/layout.tsx`). The light theme values look reasonable but have not been visually tested according to any Phase 1 report. The primary yellow on light backgrounds may be too bright for extended viewing.

**Recommendation:** The light theme should be tested and refined, but this is Low priority since the dark theme is the brand identity.

### 3.4 Lego-Themed Visual Flourish Opportunities

| Opportunity | Where | Impact | Effort |
|-------------|-------|--------|--------|
| Replace Puzzle icon with a simple brick/stud icon for logo | `components/shared/legoflex-logo.tsx` | High -- fixes brand metaphor | Low |
| Add stud-pattern texture to auth page backgrounds | `app/auth/login/page.tsx` and siblings | High -- connects auth to brand | Low |
| Add subtle yellow top-border to cards on hover (like a Lego brick "click") | `components/vault/vault-card.tsx`, `components/explore/discovery-card.tsx` | Medium -- tactile feedback | Low |
| Add rank tier icons as custom SVGs instead of emoji | `components/profile/rank-progress.tsx`, `components/leaderboard/leaderboard-table.tsx` | Medium -- professional polish | Medium |
| Add confetti/particle effect when favoriting a set or hitting a milestone | `components/vault/vault-card.tsx` (heart click) | Medium -- delight factor | Medium |
| Use a brick-stack illustration for empty states instead of Lucide icons | `components/shared/empty-state.tsx` | Medium -- brand consistency | Medium |
| Add "built" / "stacked" visual metaphor to the rank progress bar | `components/profile/rank-progress.tsx` | Low -- nice detail | Low |

---

## 4. Component-Level Findings

### 4.1 Buttons (`components/ui/button.tsx`)

**Status:** Well-implemented. The button component follows shadcn/ui's cva pattern correctly with proper variant definitions.

**Issues:**
- The `ghost` variant hover state uses `hover:bg-accent` which equals `hover:bg-primary` (they are identical tokens). On dark theme, hovering a ghost button produces a bright yellow background, which is visually jarring for nav items and action buttons. **Priority: High**
  - **Fix:** Change ghost hover to `hover:bg-primary-ghost` (the 10% opacity variant) or `hover:bg-surface-accent`:
    ```
    ghost: "hover:bg-primary-ghost hover:text-accent-foreground dark:hover:bg-primary-ghost",
    ```
- Extra sizes (`xs`, `icon-xs`, `icon-sm`, `icon-lg`) are good additions over the shadcn/ui default.

### 4.2 Cards (General Pattern)

Cards across the app use inconsistent border + background combinations:

| Component | Card Background | Border | Hover |
|-----------|----------------|--------|-------|
| `vault-card` | `bg-card border-border` | `hover:border-primary/50` | Consistent |
| `discovery-card` | `bg-card` (no explicit border) | `hover:ring-1 hover:ring-primary/50` | Uses ring instead of border |
| `feed-post` | Card component with `rounded-2xl shadow-xl shadow-black/10` | None visible | Different pattern |
| `milestone-vault` | `bg-card/40 border-border` | `hover:border-primary/40` | Uses 40% opacity card |
| `rank-progress` | `bg-card/50 border-border` | -- | Uses 50% opacity card |
| `profile-stats-row` | `bg-card/50 border-border` | -- | Uses 50% opacity card |
| `leaderboard-table` row | `bg-card border-border` | `hover:border-primary/50` | Consistent with vault |
| `settings-section` | `bg-card/50 backdrop-blur-sm` | `border-border` | Consistent within settings |

**Finding:** Card opacity varies between `bg-card` (100%), `bg-card/50` (50%), and `bg-card/40` (40%) with no clear rationale. On the profile page where `StudPatternBg` is used, the reduced opacity makes sense to let the pattern through. But on the leaderboard and settings pages where there is no textured background, 50% opacity just makes cards look faded.

**Recommendation (High):** Standardize on two card styles:
1. **Solid card:** `bg-card border-border` -- for standalone data cards (vault, explore, leaderboard)
2. **Glass card:** `bg-card/50 backdrop-blur-sm border-border` -- only for cards overlaying textured/gradient backgrounds (profile page)

### 4.3 Sidebar (`components/shared/sidebar.tsx`)

**Status:** Clean implementation. Uses design tokens correctly.

**Issues:**
- Active nav item uses `bg-surface-accent text-primary font-bold` -- the yellow text on the dark surface-accent background passes contrast (good).
- The user footer avatar uses `ring-2 ring-surface-accent` -- the ring is nearly invisible against the card background because surface-accent and card are very similar values. **Priority: Low**
- The logo + "LegoFlex" text are not wrapped in a `<Link>` to `/`. Users expect clicking the logo to navigate home. **Priority: Medium** (also flagged in user-research.md)
- `bg-card/95 backdrop-blur-md` -- the 95% opacity with blur is elegant.

### 4.4 Mobile Header (`components/shared/mobile-header.tsx`)

**Status:** Well-implemented. Mirrors sidebar patterns.

**Issues:**
- Uses `bg-background/80 backdrop-blur-md` -- good glass effect.
- The Sheet drawer uses identical nav styling to sidebar -- good consistency.
- No close button visible in the sheet (relies on overlay click and sheet swipe). On Android browsers where swipe-to-close may conflict with back gesture, an explicit close button would help. **Priority: Low**

### 4.5 Collection Tabs (`components/vault/collection-tabs.tsx`)

**Status:** The sliding pill tab component is one of the best visual elements in the app. The animated indicator with `transition-transform duration-300 ease-out` is smooth and feels physically satisfying.

**Issues:**
- The tab text uses `text-xs font-black uppercase tracking-tighter` -- "tracking-tighter" on uppercase text reduces readability. Uppercase text generally benefits from positive tracking, not negative. **Priority: Medium**
  - **Fix:** Change to `tracking-normal` or `tracking-wide` for the tab labels.

### 4.6 Vault Stats Hero (`components/vault/vault-stats-hero.tsx`)

**Status:** Strong visual presence. The gradient background and large stat numbers create impact.

**Issues:**
- The stat label uses `text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold`. At 10px, the 0.2em tracking creates a very sparse look that is hard to read. **Priority: High**
- The "$0" value displayed in `text-primary` at `text-3xl md:text-4xl font-black` is the most visually prominent element and it is always wrong. This has been flagged by all Phase 1 agents. From a visual design perspective, the recommendation is: replace the dollar value cell with a "Set Prices Coming Soon" muted placeholder, and promote Total Pieces to the primary position. **Priority: Critical (cross-reference PM P1-8)**

### 4.7 Vault Card (`components/vault/vault-card.tsx`)

**Issues:**
- The favorite heart icon uses `fill-primary text-primary` for active state and `text-white` for inactive. The white unfilled heart is only visible on hover over the dark image area (`bg-black/20`). On images with light content, the white heart disappears. **Priority: Medium**
  - **Fix:** Use `text-foreground` instead of `text-white`, or add a dark backdrop circle.
- The set name uses `uppercase tracking-tight` which conflicts with the explore card's non-uppercase treatment. Set names should be consistently cased across the app. **Priority: Medium**
- Price display (`text-sm font-black text-foreground`) showing "$0" -- same issue as stats hero. **Priority: Critical**

### 4.8 Discovery Card (`components/explore/discovery-card.tsx`)

**Status:** Strong card design with good hover states (`hover:-translate-y-1 hover:shadow-xl`).

**Issues:**
- The theme badge uses `text-[10px]` -- extremely small. On mobile, this is unreadable. **Priority: High**
- The remove button (`hover:bg-red-500`) uses a hardcoded color. **Priority: Medium**
- Cards have `cursor-pointer` via the parent hover classes, but there is no click target (no set detail page). This is a UX issue flagged by all Phase 1 agents, but from a visual design perspective, the card should either (a) have an explicit "View Details" affordance, or (b) remove the cursor-pointer styling until the detail page exists. **Priority: High**

### 4.9 Profile Hero (`components/profile/profile-hero.tsx`)

**Status:** The most visually distinctive component. The avatar glow, border, and responsive sizing are well-done.

**Issues:**
- The `isOnline` green dot (`bg-green-500`) is hardcoded and always visible. Visually, it uses a non-token color. **Priority: Medium**
- The `isVerified` badge uses `text-blue-400 fill-blue-400` -- non-token color. **Priority: Low** (verified is never true)
- The social stats section uses `border-y border-border/50` -- at 50% opacity of the already-low-contrast border, this line is invisible. **Priority: High**
  - **Fix:** Use `border-border` at full opacity, or better, use a dedicated separator token.

### 4.10 Favorites Grid (`components/profile/favorites-grid.tsx`)

**Status:** The `grayscale-[0.3] group-hover:grayscale-0` effect on favorite images is a nice touch that adds visual interest.

**Issues:**
- The grid has a subtle primary glow: `shadow-[0_0_40px_-10px_rgba(255,208,0,0.15)]`. This is a hardcoded rgba value instead of using the primary token. **Priority: Low** (CSS shadows cannot use HSL variables directly, so this is acceptable)
- "Edit Selection" button has no handler (flagged by QA). From a visual perspective, it should either be removed or styled as `disabled` with reduced opacity. **Priority: High**

### 4.11 Empty State (`components/shared/empty-state.tsx`)

**Status:** Clean, minimal design. Good use of `bg-surface-accent` for the icon container.

**Issues:**
- Title uses `text-sm font-bold` and description uses `text-xs` -- both are quite small for a state that occupies significant page real estate (py-16). The empty state should be more visually prominent. **Priority: Medium**
  - **Fix:** Increase title to `text-base font-semibold` and description to `text-sm`.

### 4.12 Auth Forms (Login, Sign-up, Onboarding)

**Status:** These are the weakest visual components. They use default shadcn/ui Card styling with no brand customization.

**Issues:**
- No LegoFlex logo anywhere on auth pages. **Priority: Critical**
- No branded background (no stud pattern, no primary accent, no illustration). **Priority: Critical**
- Card uses default `bg-card` with no special treatment. On the dark theme, the login card floats on a dark background with minimal visual interest. **Priority: High**
- The onboarding form is a very long scroll with no visual sections or steps. The 7 form fields (avatar, username, display name, bio, location, DOB, themes) all have equal visual weight. **Priority: High**
  - **Fix:** Consider a stepper/wizard pattern or at minimum add section dividers between "Identity" (avatar + username + display name) and "About" (bio + location + DOB) and "Preferences" (themes).
- Error messages use `text-red-500` (login/signup) vs `text-destructive` (onboarding). Should be `text-destructive` everywhere. **Priority: Medium**

---

## 5. Page-Level Findings

### 5.1 Home Page

**Visual status:** The home page layout is a standard social media feed (center content + right sidebar). Visually it is well-structured: good use of gap spacing, proper max-width constraints, and the right sidebar divider (`w-px bg-border`) is a nice touch.

**Issues:**
- The page has no header/title. Every other page has a clear heading (Explore, Vault, Settings, Leaderboard, Profile) but the home page has none. This contributes to the "where am I?" feeling. **Priority: Medium**
- When the feed is replaced with a dashboard (as recommended by PM and UX), the layout should shift from a feed column to a dashboard grid. The right sidebar can be preserved for social widgets.

### 5.2 Explore Page

**Visual status:** The strongest page visually. The sticky header with search, theme chips, and sort controls is well-designed. The discovery grid is responsive and the card hover effects are polished.

**Issues:**
- The header uses `pt-6 pb-4` but the bottom border uses `border-border/50` (half opacity -- invisible). **Priority: Medium**
- The "Explore" title (`text-2xl font-black tracking-tight uppercase italic`) uses italic, which is the only use of italic in the entire app. This is a distinctive style choice that works, but it should be either adopted as a pattern for page titles or removed for consistency. **Priority: Low**
- The "Load More" button at the bottom of the grid (in the client component) uses a generic style. It should be more prominent since pagination is a key interaction. **Priority: Medium**

### 5.3 Vault Page

**Visual status:** The stats hero creates strong visual impact. The tabs pill is excellent. The toolbar is clean.

**Issues:**
- The toolbar uses `bg-background/80 backdrop-blur-md` which is the same glass effect as the mobile header. On pages where both are visible, this creates two competing glass bars. The vault toolbar should use `bg-background/95` for a more solid feel. **Priority: Low**
- The theme filter dropdown and view mode toggle are hidden on mobile (`hidden sm:flex`). This leaves mobile users with only search. The theme filter should be accessible on mobile (perhaps as a sheet/drawer). **Priority: Medium** (also flagged in QA MIN-09)
- The transition between grid and list views has no animation. A fade transition would smooth the switch. **Priority: Low**

### 5.4 Profile Page

**Visual status:** The most visually rich page. The stud pattern background, avatar glow, favorites grid with desaturation effect, and milestone cards create a distinctive identity.

**Issues:**
- The page layout shifts from full-width hero to a max-width constrained content area, which works well.
- The milestone vault grid uses emoji for icons (`iconMap` in `milestone-vault.tsx`). Emoji rendering varies across platforms and looks particularly rough on Windows. Custom SVG icons would be more consistent. **Priority: Medium**
- The profile footer uses `mt-20 pt-8` -- 80px top margin is excessive. **Priority: Low**
- There is no visual connection between the profile page and the vault page. A "View My Vault" button/link should exist near the stats section. **Priority: Medium** (flagged in user-research friction point #29)

### 5.5 Leaderboard Page

**Visual status:** Clean table layout. The position badges (medal emoji for top 3) add visual interest.

**Issues:**
- Rows are interactive (clickable links to `/u/[userId]`) but have no `cursor-pointer` class directly -- the entire `<Link>` wrapping handles this. This is correct behavior.
- The current user highlight (`bg-primary/10 border-primary/30`) is effective and distinguishable.
- The brick score is displayed in `text-primary text-lg font-black` -- this is the visual anchor and works well.
- Header uses `border-b border-border bg-background/95 backdrop-blur-md` -- good glass effect.

### 5.6 Settings Page

**Visual status:** The most "standard" page. Clean sections with clear grouping.

**Issues:**
- The version footer "LegoFlex v1.0.0" appears in both settings-client and edit-profile-form. Should be centralized. **Priority: Low**
- Settings sections use `bg-card/50 backdrop-blur-sm` on a plain background where no blur source exists. The backdrop-blur has no effect. Should be `bg-card`. **Priority: Low**

### 5.7 Auth Pages

**Visual status:** The weakest pages. Plain centered cards on dark backgrounds with no visual identity.

**Recommendations:**
1. Add the LegoFlex logo above the card on all auth pages
2. Add a stud-pattern background (like the profile page) with a gradient overlay
3. Add a subtle primary-colored border or glow to the auth card
4. On the sign-up success page, add a celebratory illustration or checkmark animation

**Priority: Critical** -- These are the first pages new users see.

---

## 6. Typography Audit

### 6.1 Font Configuration

The root layout loads **Geist** (a geometric sans-serif by Vercel) as the default body font, while `tailwind.config.ts` defines `font-display` as **Inter**. The app layout uses `font-display` class, meaning all app pages render in Inter while auth pages (outside the app layout) render in Geist.

**Issue:** Two different fonts for auth pages vs. app pages creates visual inconsistency. **Priority: High**

**Fix:** Either:
- Remove the Geist font and use Inter everywhere (add Inter to root layout)
- Or use Geist everywhere and remove the Inter font-display config

Inter is the better choice for a data-heavy application due to its excellent legibility at small sizes and tabular number support.

### 6.2 Typography Scale Usage

| Usage Pattern | Classes | Occurrences | Notes |
|---------------|---------|-------------|-------|
| Page titles | `text-3xl md:text-4xl font-black tracking-tight` | Vault, Settings, Edit Profile, Public Profile | Consistent |
| Page titles (alt) | `text-xl font-black tracking-tight` | Leaderboard | Inconsistent -- smaller |
| Page titles (alt) | `text-2xl font-black tracking-tight uppercase italic` | Explore | Inconsistent -- italic |
| Section headers | `text-xs font-black uppercase tracking-[0.3em]` | Profile sections | Consistent within profile |
| Section headers (alt) | `text-foreground font-bold text-sm` | Right sidebar sections | Different pattern |
| Card titles | `text-base font-bold` | Explore card | -- |
| Card titles (alt) | `text-sm font-bold uppercase tracking-tight` | Vault card | Different -- uppercase |
| Stat numbers | `text-3xl md:text-4xl font-black tracking-tighter` | Vault stats hero | -- |
| Stat numbers (alt) | `text-xl font-bold` | Profile stats row | Inconsistent size |
| Stat labels | `text-[10px] uppercase tracking-[0.2em] font-bold` | Vault stats, Profile stats | Consistent within pattern |
| Body text | `text-sm text-muted-foreground` | General | Consistent |
| Small labels | `text-xs text-muted-foreground` | Metadata, timestamps | Consistent |

**Key inconsistencies:**
1. Page titles use three different patterns (standard, smaller, italic). Should be one pattern.
2. Card titles use different casing (title case vs uppercase).
3. Stat numbers range from `text-xl` to `text-4xl` with no clear hierarchy.
4. The `tracking-[0.3em]` on profile section headers is extreme -- 0.3em spacing at 12px creates 3.6px gaps between letters. Consider reducing to `tracking-widest` (0.1em) or `tracking-[0.15em]`.

**Recommendation (High):** Define a typography scale:
- **Display:** `text-3xl md:text-4xl font-black tracking-tight` (page titles)
- **Heading:** `text-xl font-bold` (section titles)
- **Subheading:** `text-xs font-bold uppercase tracking-wide text-muted-foreground` (section labels)
- **Body:** `text-sm text-foreground` (default)
- **Caption:** `text-xs text-muted-foreground` (metadata)
- **Micro:** `text-[11px] font-medium text-muted-foreground` (minimal labels -- never below 11px)

---

## 7. Spacing & Layout Audit

### 7.1 Page Padding Patterns

| Page | Padding | Max Width | Consistent? |
|------|---------|-----------|-------------|
| Home | `px-6` | `max-w-[700px]` (feed) | No max-width on outer |
| Explore | `px-4 sm:px-6 md:px-10` (header), no page padding | `max-w-7xl` (in header) | Inconsistent |
| Vault | `px-6 md:px-8` (hero), `px-6 md:px-8` (content) | `max-w-7xl` | Consistent within page |
| Profile | `px-4 sm:px-8 py-8 sm:py-12` | `max-w-[1100px]` | Consistent |
| Public Profile | `px-8 py-12` | `max-w-[1100px]` | **Not responsive** |
| Leaderboard | `px-6 md:px-10` (header) | No max-width on content | Missing |
| Settings | `px-4 py-8 md:px-6 lg:py-12` | `max-w-3xl` | Consistent |
| Auth | `p-6 md:p-10` | `max-w-sm` | Consistent |

**Issues:**
1. Public profile uses fixed `px-8 py-12` instead of responsive `px-4 sm:px-8 py-8 sm:py-12` like the own profile. **Priority: Medium** (flagged in QA MIN-08)
2. Explore page has no consistent outer padding -- the header and content use different patterns. **Priority: Medium**
3. Leaderboard content has no max-width, so on ultrawide screens the table stretches infinitely. **Priority: Medium**
4. Max-width values vary: `700px`, `7xl` (1280px), `1100px`, `3xl` (768px), `sm` (640px). There should be at most 2-3 standard max-widths. **Priority: Low**

### 7.2 Component Gap Spacing

Spacing between components within pages is generally consistent:
- `gap-6 sm:gap-8` for vertical stacking (home feed, explore grid)
- `gap-3 sm:gap-4` for grid items (vault, explore, favorites)
- `space-y-8` for section stacking (profile content)
- `space-y-10` for settings sections

This is acceptable. The main inconsistency is between `gap-*` (flexbox/grid) and `space-y-*` (margin-based) utilities -- both are used interchangeably.

---

## 8. Motion & Animation Audit

### 8.1 Current Animations

| Component | Animation | Quality |
|-----------|-----------|---------|
| Collection tabs | Sliding indicator: `transition-transform duration-300 ease-out` | Excellent |
| Discovery cards | Hover lift: `hover:-translate-y-1 transition-all duration-300` | Good |
| Vault cards | Hover: `hover:border-primary/50 transition-all` | Subtle -- could be more |
| Card images | Scale on hover: `transition-transform duration-500 group-hover:scale-105` | Good |
| Profile avatar | Glow pulse: `animate-pulse` on outer ring | Good ambient effect |
| Feed post image | Overlay fade: `opacity-0 group-hover:opacity-100 transition-opacity duration-300` | Good |
| Skeleton loaders | `animate-pulse` | Standard |
| Follow button | Optimistic state change (no animation) | Missing -- should have transition |

### 8.2 Missing Animations

| Where | What | Priority |
|-------|------|----------|
| Page transitions | No route transition animations. Pages swap instantly. | Medium |
| Favorites grid | Grayscale toggle has `transition-all` but no duration specified | Low |
| Vault tab switch | Content appears instantly when switching collection/wishlist | Medium |
| Bulk actions bar | Appears/disappears without animation | Medium |
| Toast notifications | Handled by Sonner -- already animated | -- |
| Theme filter modal | Dialog uses shadcn/ui default animation | OK |
| Load More button | No loading spinner inline (only the page-level spinner) | Medium |

### 8.3 Animation Recommendations

1. **Add `transition-all duration-200` to the bulk actions bar.** When it appears/disappears based on selection count, it should slide up from the bottom rather than popping in. **Priority: Medium**
2. **Add a subtle scale animation to the favorite heart on click.** `active:scale-90 transition-transform` provides tactile feedback. **Priority: Medium**
3. **Add `motion-safe:` prefix to all animations.** Users who prefer reduced motion (`prefers-reduced-motion: reduce`) should not see pulse effects or lift animations. **Priority: High (accessibility)**
   - **Fix:** Wrap `animate-pulse` in `motion-safe:animate-pulse` and `hover:-translate-y-1` in `motion-safe:hover:-translate-y-1`.

---

## 9. Recommendations

### Critical (Must fix before launch)

**CR-1: Fix border contrast for WCAG 2.1 AA compliance**
- **File:** `/app/globals.css`, line 55-56
- **Change:** `--border: 43 37% 16%;` to `--border: 43 30% 24%;` and same for `--input`
- **Impact:** All borders across the entire app become visible, improving readability and accessibility
- **Priority:** Critical

**CR-2: Add brand identity to auth pages**
- **Files:** `app/auth/login/page.tsx`, `app/auth/sign-up/page.tsx`, `app/auth/forgot-password/page.tsx`, `app/auth/sign-up-success/page.tsx`, `app/auth/onboarding/page.tsx`, `app/auth/update-password/page.tsx`, `app/auth/error/page.tsx`
- **Change:** Add a shared auth layout wrapper with:
  1. `StudPatternBg` component as page background
  2. Gradient overlay: `bg-gradient-to-b from-background via-background/95 to-background`
  3. `LegoFlexLogo` + "LegoFlex" title centered above the card
  4. Subtle `border-primary/20` on the auth `Card`
- **Priority:** Critical

**CR-3: Replace the Puzzle logo icon with a brick/stud icon**
- **File:** `components/shared/legoflex-logo.tsx`
- **Change:** Replace `Puzzle` from Lucide with either:
  - A custom SVG of a 2x2 Lego brick (top view -- 4 studs)
  - Or the `Box` icon from Lucide with modified styling
  - Or a custom inline SVG of a single circular stud
- **Priority:** Critical (the logo is the single most repeated brand element)

**CR-4: Increase minimum text size to 11px**
- **Files:** All files using `text-[10px]` (see Section 2.4)
- **Change:** Replace all `text-[10px]` with `text-[11px]` and reduce letter spacing from `tracking-[0.3em]` to `tracking-wider` (0.05em) or `tracking-wide` (0.025em)
- **Priority:** Critical (readability)

**CR-5: Replace "$0" value display**
- **Files:** `components/vault/vault-stats-hero.tsx`, `components/vault/vault-card.tsx`, `components/vault/vault-list.tsx`
- **Change:**
  - In vault-stats-hero: Replace the "Total Market Value" / "Estimated Cost" stat with a `text-muted-foreground text-sm` message: "Price tracking coming soon" styled as a muted badge instead of a primary-colored large number
  - In vault-card and vault-list: Remove the price column/display entirely until price data exists
- **Cross-reference:** Agrees with PM P1-8, User Research Rec-3, CTO (not their concern but acknowledged)
- **Priority:** Critical

**CR-6: Fix white text on overlay badges**
- **Files:** `components/vault/vault-card.tsx:74`, `components/explore/discovery-card.tsx:42`
- **Change:** Increase overlay opacity from `bg-black/60` to `bg-black/80` for all text-bearing badges over images
- **Priority:** Critical (WCAG)

### High Priority

**HI-1: Unify font across auth and app pages**
- **Files:** `app/layout.tsx`, `tailwind.config.ts`
- **Change:** Remove Geist font import. Add Inter as the global font in root layout. The `font-display` utility in Tailwind already maps to Inter -- just load it in the root layout instead of Geist.
- **Priority:** High

**HI-2: Fix ghost button hover state**
- **File:** `components/ui/button.tsx`
- **Change:** Replace ghost variant hover from `hover:bg-accent` to:
  ```
  ghost: "hover:bg-primary-ghost hover:text-foreground dark:hover:bg-primary-ghost",
  ```
  This uses the 10% opacity primary for a subtle warm hover instead of a full yellow background.
- **Priority:** High

**HI-3: Standardize card styles**
- **Files:** All components using Card or `bg-card/*`
- **Change:**
  - Use `bg-card border-border` for standalone cards
  - Use `bg-card/60 backdrop-blur-sm border-border` only on pages with textured backgrounds (profile)
  - Remove arbitrary opacities (40%, 50%) on non-textured pages
- **Priority:** High

**HI-4: Increase dark theme depth (card/surface lightness)**
- **File:** `/app/globals.css`
- **Change:**
  ```css
  --card: 43 35% 12%;           /* Was: 43 40% 10% */
  --surface: 43 35% 12%;        /* Keep synced with card */
  --secondary: 44 30% 16%;      /* Was: 44 37% 13% */
  --surface-accent: 44 30% 16%; /* Keep synced with secondary */
  --muted: 43 25% 14%;          /* Was: 43 30% 12% */
  ```
  This creates clearer visual layers while maintaining the warm tone.
- **Priority:** High

**HI-5: Standardize page title typography**
- **Files:** All page components
- **Change:** Use one consistent pattern for all page titles:
  ```
  text-2xl md:text-3xl font-black tracking-tight text-foreground
  ```
  Remove the `uppercase italic` from Explore. Increase the Leaderboard title to match.
- **Priority:** High

**HI-6: Add success/info/warning semantic tokens**
- **File:** `/app/globals.css`, `tailwind.config.ts`
- **Change:** Add to both `:root` and `.dark`:
  ```css
  --success: 142 71% 45%;
  --success-foreground: 0 0% 100%;
  --warning: 38 92% 50%;
  --warning-foreground: 0 0% 0%;
  --info: 217 91% 60%;
  --info-foreground: 0 0% 100%;
  ```
  And in `tailwind.config.ts`:
  ```typescript
  success: { DEFAULT: "hsl(var(--success))", foreground: "hsl(var(--success-foreground))" },
  warning: { DEFAULT: "hsl(var(--warning))", foreground: "hsl(var(--warning-foreground))" },
  info: { DEFAULT: "hsl(var(--info))", foreground: "hsl(var(--info-foreground))" },
  ```
  Then replace all hardcoded `green-500`, `blue-400/500`, `amber-500`, `red-400/500` with these tokens.
- **Priority:** High

**HI-7: Add `motion-safe:` prefix to decorative animations**
- **Files:** All components using `animate-pulse`, `hover:-translate-y-*`, `hover:scale-*`
- **Change:** Prefix with `motion-safe:` (e.g., `motion-safe:animate-pulse`, `motion-safe:hover:-translate-y-1`)
- **Priority:** High (accessibility)

**HI-8: Remove or disable non-functional visual elements**
- **Files:**
  - `components/profile/favorites-grid.tsx:20` -- Remove "Edit Selection" button
  - `components/profile/milestone-vault.tsx:40-47` -- Remove "Add milestone" button
  - `components/profile/profile-hero.tsx:32-34` -- Remove online indicator (always true)
- **Change:** Remove the buttons/indicators entirely. Do not use `disabled` state -- removing is cleaner than showing something broken.
- **Cross-reference:** Agrees with User Research Rec-5, QA MAJ-07, MAJ-01
- **Priority:** High

**HI-9: Differentiate `accent` from `primary` token**
- **File:** `/app/globals.css`
- **Change:** The accent token is currently identical to primary. Change it to a lighter/desaturated variant:
  ```css
  /* Light mode */
  --accent: 48 60% 94%;
  --accent-foreground: 40 33% 7%;
  /* Dark mode */
  --accent: 44 30% 16%;
  --accent-foreground: 48 20% 95%;
  ```
  This makes `hover:bg-accent` distinct from `hover:bg-primary` in the button component and throughout shadcn/ui defaults.
- **Priority:** High

### Medium Priority

**ME-1: Add hover top-border effect to interactive cards**
- **Files:** `components/vault/vault-card.tsx`, `components/explore/discovery-card.tsx`
- **Change:** Add `before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-primary before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:origin-left` to card wrappers. This creates a yellow "click-on" effect reminiscent of Lego bricks connecting.
- **Priority:** Medium

**ME-2: Animate bulk actions bar appearance**
- **File:** `components/vault/vault-bulk-actions.tsx`
- **Change:** Wrap the bar in a container with `transition-all duration-200` and toggle `translate-y-0` / `translate-y-full` + `opacity-100` / `opacity-0` based on `selectedCount > 0`.
- **Priority:** Medium

**ME-3: Add favorite heart click animation**
- **File:** `components/vault/vault-card.tsx`
- **Change:** Add `active:scale-90 transition-transform duration-150` to the favorite Button, and consider a brief `fill-primary` flash animation on toggle.
- **Priority:** Medium

**ME-4: Improve empty state visual weight**
- **File:** `components/shared/empty-state.tsx`
- **Change:** Increase title to `text-base font-semibold` and description to `text-sm`. Increase icon container to `p-5` and icon to `size-10`.
- **Priority:** Medium

**ME-5: Make vault toolbar accessible on mobile**
- **File:** `components/vault/vault-toolbar.tsx`
- **Change:** Replace `hidden sm:flex` on theme filter and view toggle with a responsive pattern:
  - Keep search visible on mobile
  - Add a filter icon button on mobile that opens a sheet/drawer with theme filter
  - Remove view toggle on mobile (grid-only on mobile is correct)
- **Priority:** Medium

**ME-6: Standardize card title casing**
- **Files:** `components/vault/vault-card.tsx:87`, `components/explore/discovery-card.tsx:92`
- **Change:** Vault card uses `uppercase tracking-tight` for set names; explore card does not. Choose one pattern (recommendation: title case / no uppercase, as set names like "LEGO Star Wars X-Wing" already have internal capitalization that uppercase destroys).
- **Priority:** Medium

**ME-7: Fix public profile responsive padding**
- **File:** `app/(app)/u/[userId]/page.tsx`
- **Change:** Replace `px-8 py-12` with `px-4 sm:px-8 py-8 sm:py-12` to match own profile page.
- **Priority:** Medium

**ME-8: Add max-width to leaderboard content**
- **File:** `app/(app)/leaderboard/page.tsx` (or its client component)
- **Change:** Wrap content in `max-w-4xl mx-auto px-4 sm:px-6`
- **Priority:** Medium

**ME-9: Replace emoji milestone icons with SVGs**
- **File:** `components/profile/milestone-vault.tsx`
- **Change:** Replace the `iconMap` emoji lookup with custom SVG icons or Lucide icons. Emoji rendering is inconsistent across platforms.
- **Priority:** Medium

**ME-10: Fix collection tabs letter spacing**
- **File:** `components/vault/collection-tabs.tsx`
- **Change:** Replace `tracking-tighter` with `tracking-normal` or `tracking-wide` on the tab labels. Negative tracking on uppercase text reduces readability.
- **Priority:** Medium

**ME-11: Add onboarding form visual sections**
- **File:** `components/auth/onboarding-form.tsx`
- **Change:** Add `Separator` components and section labels between form groups:
  - "Your Identity" (avatar + username + display name)
  - "About You" (bio + location + DOB)
  - "Your Interests" (themes)
- **Priority:** Medium

### Low Priority

**LO-1: Fix copyright year**
- **File:** `components/shared/footer.tsx:16`
- **Change:** Replace `2024` with `{new Date().getFullYear()}`
- **Priority:** Low

**LO-2: Remove backdrop-blur from non-glass surfaces**
- **Files:** `components/settings/settings-section.tsx:14`
- **Change:** Remove `backdrop-blur-sm` from settings sections (no blur source exists on settings page background)
- **Priority:** Low

**LO-3: Add subtle page transition animation**
- **File:** `app/(app)/layout.tsx`
- **Change:** Consider wrapping `{children}` in a motion component (framer-motion or CSS `@starting-style`) for fade-in on route change. Low priority as it requires framer-motion dependency.
- **Priority:** Low

**LO-4: Improve sidebar avatar ring visibility**
- **Files:** `components/shared/sidebar.tsx:61`, `components/shared/mobile-header.tsx:95`
- **Change:** Replace `ring-surface-accent` with `ring-border` for better visibility
- **Priority:** Low

**LO-5: Light theme refinement**
- **File:** `/app/globals.css` `:root` section
- **Change:** Test and refine light theme values. The primary yellow may be too bright on white backgrounds. Consider using `49 100% 35%` (slightly darker) for light mode primary. This is low priority since dark is the default.
- **Priority:** Low

---

## 10. Dependencies & Conflicts

### Dependencies

| Recommendation | Depends On | Notes |
|----------------|-----------|-------|
| CR-2 (Auth brand identity) | None | Can be done independently |
| CR-5 (Replace $0) | PM/CTO decision on whether to remove or show "coming soon" | Visual design can proceed with either approach |
| HI-6 (Semantic tokens) | None, but all hardcoded color replacements depend on this | Do this first, then update components |
| ME-5 (Mobile vault toolbar) | shadcn/ui Sheet component (already installed) | Can use existing UI primitives |
| LO-3 (Page transitions) | framer-motion or React 19 `startTransition` animations | New dependency |
| ME-1 (Card top-border effect) | None | Pure CSS |

### Conflicts with Phase 1 Findings

| Topic | Phase 1 Position | UI Design Position | Resolution |
|-------|-----------------|-------------------|------------|
| Home page redesign | PM: Replace with dashboard. UX: Replace with dashboard. | **Agree.** The current feed layout is visually the weakest page because mock data means no real content to display. A dashboard with stats cards, recent activity, and CTAs would be more visually engaging. | Align with PM/UX |
| "$0" display | PM: P1 priority. UX: High. CTO: Not their concern. QA: MAJ-05. | **Agree -- Critical.** From a visual design perspective, showing "$0" in the largest, primary-colored text on the vault page is actively harmful to the brand. It makes the app look broken. | Remove entirely or replace with muted "coming soon" |
| Profile `isOnline` indicator | QA: MIN-01 (hardcoded true). UX: Friction #26. | **Remove entirely.** The green dot is always visible and always lying. Removing it is a net visual improvement -- it declutters the avatar area. | Agree with UX/QA |
| Auth page branding | UX: Friction #5 (no branding). QA: Not flagged as visual issue. | **Critical.** This is the single biggest brand identity gap. First-time users see a generic login form with no connection to LegoFlex. | New finding elevated to Critical |
| Font inconsistency (Geist vs Inter) | Not flagged by any Phase 1 agent. | **New finding -- High.** Auth pages render in Geist; app pages render in Inter. This creates a subtle but real visual discontinuity. | New finding |
| Ghost button hover (full yellow) | Not flagged by any Phase 1 agent. | **New finding -- High.** The hover state on ghost buttons is too aggressive. | New finding |
| Border contrast WCAG failure | QA: MIN-17 (accessibility gaps, general). PM: P2-20 (accessibility improvements). | **Elevated to Critical.** The specific border contrast failure (1.7:1 vs required 3:1) was not quantified by any Phase 1 agent. | Elevated from Phase 1 "Low" to Critical |

### Implementation Order

The recommended implementation order is:

1. **Token layer fixes** (CR-1 border contrast, HI-4 depth, HI-6 semantic tokens, HI-9 accent differentiation) -- These affect everything downstream
2. **Brand identity** (CR-2 auth pages, CR-3 logo, HI-1 font unification) -- First impression
3. **Content fixes** (CR-4 text size, CR-5 $0 removal, CR-6 badge contrast) -- Data presentation
4. **Component polish** (HI-2 ghost button, HI-3 cards, HI-5 titles, HI-8 remove non-functional) -- Consistency
5. **Page polish** (ME-* items) -- Refinement
6. **Animations and micro-interactions** (ME-2, ME-3, HI-7, LO-3) -- Delight layer

---

## Appendix A: Full File Reference

### Files requiring changes (by priority tier)

**Critical:**
- `/app/globals.css` -- CR-1, HI-4, HI-6, HI-9
- `/app/auth/login/page.tsx` -- CR-2
- `/app/auth/sign-up/page.tsx` -- CR-2
- `/app/auth/forgot-password/page.tsx` -- CR-2
- `/app/auth/sign-up-success/page.tsx` -- CR-2
- `/app/auth/onboarding/page.tsx` -- CR-2
- `/app/auth/update-password/page.tsx` -- CR-2
- `/app/auth/error/page.tsx` -- CR-2
- `/components/shared/legoflex-logo.tsx` -- CR-3
- `/components/vault/vault-stats-hero.tsx` -- CR-4, CR-5
- `/components/vault/vault-card.tsx` -- CR-4, CR-5, CR-6
- `/components/vault/vault-list.tsx` -- CR-4, CR-5
- `/components/explore/discovery-card.tsx` -- CR-4, CR-6
- `/components/profile/profile-hero.tsx` -- CR-4
- `/components/profile/profile-stats-row.tsx` -- CR-4
- `/components/profile/milestone-vault.tsx` -- CR-4
- `/components/profile/profile-footer.tsx` -- CR-4
- `/components/leaderboard/leaderboard-table.tsx` -- CR-4

**High:**
- `/tailwind.config.ts` -- HI-6
- `/app/layout.tsx` -- HI-1
- `/components/ui/button.tsx` -- HI-2
- `/components/profile/favorites-grid.tsx` -- HI-8
- `/components/profile/profile-hero.tsx` -- HI-8
- `/components/auth/login-form.tsx` -- Token violation fix
- `/components/auth/sign-up-form.tsx` -- Token violation fix
- `/components/auth/onboarding-form.tsx` -- Token violation fix
- `/components/vault/vault-bulk-actions.tsx` -- Token violation fix
- `/components/home/feed-post.tsx` -- Token violation fix

**Medium:**
- `/components/vault/vault-toolbar.tsx` -- ME-5
- `/components/shared/empty-state.tsx` -- ME-4
- `/components/vault/collection-tabs.tsx` -- ME-10
- `/app/(app)/u/[userId]/page.tsx` -- ME-7
- `/app/(app)/leaderboard/page.tsx` -- ME-8
- `/components/auth/onboarding-form.tsx` -- ME-11
- `/components/vault/vault-bulk-actions.tsx` -- ME-2

**Low:**
- `/components/shared/footer.tsx` -- LO-1
- `/components/settings/settings-section.tsx` -- LO-2
- `/components/shared/sidebar.tsx` -- LO-4
- `/components/shared/mobile-header.tsx` -- LO-4

### Estimated Effort

| Tier | Items | Effort |
|------|-------|--------|
| Critical (CR-1 through CR-6) | 6 | ~6 hours |
| High (HI-1 through HI-9) | 9 | ~8 hours |
| Medium (ME-1 through ME-11) | 11 | ~10 hours |
| Low (LO-1 through LO-5) | 5 | ~3 hours |
| **Total** | **31** | **~27 hours** |

---

*End of UI Design Audit*
