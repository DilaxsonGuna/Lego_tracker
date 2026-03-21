# Technical Quality Audit: LegoFlex

_Generated 2026-03-19 via impeccable:audit_

---

## Anti-Patterns Verdict: PASS

No AI slop detected. The warm Lego yellow palette, stud-pattern textures, collector-specific vocabulary, and domain features (rank progression, brick score, milestone vault) give the app a genuine identity. No gradient text, glassmorphism, or generic dashboard energy.

**Minor tells:** The 2x2 stat grid and `backdrop-blur-md` sticky headers are common patterns but used purposefully here.

---

## Executive Summary

| Severity | Count |
|----------|-------|
| Critical | 5 |
| High | 12 |
| Medium | 15 |
| Low | 10 |
| **Total** | **42** |

**Top 3 Critical Issues:**
1. Background-image divs used for meaningful set images — completely invisible to screen readers (5 components)
2. Hard-coded color values bypass the design system and break in theme switching
3. Touch targets too small for reliable mobile interaction (icon buttons at 36px, checkboxes at 16px)

**Overall:** Solid engineering foundation with good patterns (Suspense boundaries, barrel exports, semantic landmarks). Primary gaps are in accessibility (images, focus styles, ARIA) and theming consistency (hard-coded colors).

---

## Critical Issues

### C1. Background Images Without Alt Text (Accessibility)
**Location:** `discovery-card.tsx`, `vault-card.tsx`, `vault-list.tsx`, `favorites-grid.tsx`, `set-detail-hero.tsx`
**Category:** Accessibility
**WCAG:** 1.1.1 Non-text Content (Level A)

Set images are rendered as `background-image` on `<div>` elements. Screen reader users cannot perceive these images at all — and they're the primary content of the app.

**Impact:** Core product content is invisible to assistive technology users.
**Recommendation:** Replace with `<Image>` (next/image) or `<img>` tags with descriptive alt text (e.g., `alt="LEGO Star Wars Millennium Falcon set 75192"`).
**Command:** `/impeccable:harden`

---

### C2. Missing Focus Styles on Navigation (Accessibility)
**Location:** `sidebar.tsx` (line 42-56), `mobile-bottom-nav.tsx` (line 36-50), `avatar-selector.tsx` (line 23-36)
**Category:** Accessibility
**WCAG:** 2.4.7 Focus Visible (Level AA)

Navigation links and interactive elements lack explicit `focus-visible` styles. Keyboard users cannot see which element is focused.

**Impact:** Keyboard-only users cannot navigate the app effectively.
**Recommendation:** Add `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` to all interactive nav elements.
**Command:** `/impeccable:harden`

---

### C3. Hard-Coded `#3b82f6` Color Values (Theming)
**Location:** `sidebar.tsx` (lines 63, 66), `search-page-client.tsx` (avatar fallback)
**Category:** Theming

Hex color `#3b82f6` (Tailwind blue-500) is hard-coded as avatar fallback. This doesn't respect the design system and won't adapt to theme changes.

**Impact:** Visual inconsistency; breaks design system contract.
**Recommendation:** Use `hsl(var(--info))` or `hsl(var(--primary))` from the design token system.
**Command:** `/impeccable:normalize`

---

### C4. Status Badge Colors Bypass Design Tokens (Theming)
**Location:** `vault-card.tsx` (lines 21-25), `vault-list.tsx` (lines 15-17)
**Category:** Theming

Status badges use hard-coded Tailwind colors (`bg-green-700`, `bg-blue-700`, `bg-amber-700`, `bg-red-700`) instead of semantic tokens. These don't adapt between light/dark mode.

**Impact:** Status colors look wrong in light mode and don't follow the design system.
**Recommendation:** Create semantic status tokens in `globals.css` (e.g., `--status-built`, `--status-in-box`) or use existing semantic tokens (`--success`, `--warning`, `--info`, `--destructive`).
**Command:** `/impeccable:normalize`

---

### C5. Missing `next/image` for Dynamic Images (Performance)
**Location:** `following-activity.tsx` (lines 64-68), `share-collection-card.tsx` (lines 79-83)
**Category:** Performance

Using raw `<img>` tags without lazy loading, width/height attributes, or format optimization (WebP/AVIF).

**Impact:** Larger payloads, no lazy loading, layout shift.
**Recommendation:** Replace with Next.js `<Image>` component with proper `width`/`height` or `fill` props.
**Command:** `/impeccable:optimize`

---

## High-Severity Issues

### H1. Interactive Badges Without ARIA Labels
**Location:** `theme-filter-modal.tsx` (lines 83-98), `theme-selector.tsx` (lines 82-96)
**WCAG:** 4.1.2 Name, Role, Value (Level A)

Clickable `<Badge>` elements with `onClick` handlers lack `aria-label` or `role="button"`. Screen readers don't announce them as interactive.

**Command:** `/impeccable:harden`

### H2. Discovery Card Buttons Use `title` Instead of `aria-label`
**Location:** `discovery-card.tsx` (lines 51-78, 110-129)
**WCAG:** 4.1.2 Name, Role, Value (Level A)

Wishlist heart and collection buttons use `title` attribute, which is not reliably announced by screen readers. Should use `aria-label`.

**Command:** `/impeccable:harden`

### H3. Touch Targets Too Small — Icon Buttons
**Location:** `button.tsx` (lines 28-31) — icon size is `size-9` (36px), icon-xs is `size-6` (24px)
**Affected:** Notification bell, discovery card heart, vault card favorite, toolbar filter buttons
**WCAG:** 2.5.8 Target Size (Level AAA), Apple HIG: 44px minimum

**Recommendation:** Increase default icon button to `size-10` (40px) minimum. Use padding to expand touch area where visual size must stay small.
**Command:** `/impeccable:adapt`

### H4. Checkbox Touch Targets at 16px
**Location:** `checkbox.tsx` (line 16) — `h-4 w-4` (16px)
**Affected:** Vault grid/list selection checkboxes

**Recommendation:** Increase to `h-5 w-5` or wrap in larger clickable area with padding.
**Command:** `/impeccable:adapt`

### H5. Safe Area Padding Not Dynamic
**Location:** `app/(app)/layout.tsx` (line 36), multiple page files
**Category:** Responsive

Pages use fixed `pb-20` (80px) for bottom nav clearance, but this doesn't account for the safe area on iOS devices with home indicators.

**Recommendation:** Use `pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0`.
**Command:** `/impeccable:adapt`

### H6. Public Profile Missing Mobile Padding
**Location:** `app/(app)/u/[userId]/page.tsx` (line 101)

Uses `px-8` without mobile breakpoint. Should be `px-4 sm:px-8`.

**Command:** `/impeccable:adapt`

### H7. Collection Tabs Fixed Width Overflow
**Location:** `collection-tabs.tsx` (line 20)

Fixed `w-64` (256px) may overflow on 320px screens. Should be `w-48 sm:w-64` or use percentage.

**Command:** `/impeccable:adapt`

### H8. Inconsistent Error Color Usage
**Location:** `login-form.tsx`, `sign-up-form.tsx`, `forgot-password-form.tsx`

Using `text-red-500` for errors instead of `text-destructive` token.

**Command:** `/impeccable:normalize`

### H9. Success Color Not Using Tokens
**Location:** `edit-profile-form.tsx` (lines 176, 187, 201), `profile-hero.tsx` (line 40)

Using `text-green-500` / `bg-green-500` instead of semantic `--success` token.

**Command:** `/impeccable:normalize`

### H10. Vault Toolbar Select Missing ARIA Labels
**Location:** `vault-toolbar.tsx` (lines 101-176)

Theme and sort `<Select>` components don't have `aria-label` or `aria-describedby`.

**Command:** `/impeccable:harden`

### H11. Profile Heading Hierarchy Skip
**Location:** `favorites-grid.tsx` (line 13-17)

Uses `<h3>` without a preceding `<h2>`, skipping heading levels.
**WCAG:** 1.3.1 Info and Relationships (Level A)

**Command:** `/impeccable:harden`

### H12. Large Component Files
**Location:** `edit-profile-form.tsx` (286 lines), `search-page-client.tsx` (268 lines), `onboarding-form.tsx` (261 lines), `vault-toolbar.tsx` (232 lines)

These files handle too many concerns. Should extract sub-components for readability and performance.

**Command:** `/impeccable:extract`

---

## Medium-Severity Issues

### M1. Profile Footer Link Overflow
**Location:** `profile-footer.tsx` (line 12)
`gap-8` without `flex-wrap` — links overflow on narrow screens.
**Fix:** `flex flex-wrap gap-4 sm:gap-8`
**Command:** `/impeccable:adapt`

### M2. Color Contrast Concerns
**Location:** `profile-hero.tsx` (line 51) — `text-blue-400` verified badge; `discovery-card.tsx` (line 43) — yellow text on semi-transparent black
**WCAG:** 1.4.3 Contrast (Level AA)
**Command:** `/impeccable:normalize`

### M3. Hard-Coded Auth Colors
**Location:** `avatar-selector.tsx` (`bg-red-500`, `bg-blue-500`), `password-strength.tsx` (`bg-red-500`, `bg-yellow-500`, `bg-green-500`)
Not critical since these are intentional distinct colors, but they bypass the design system.
**Command:** `/impeccable:normalize`

### M4. Discovery Card `hover:bg-red-500` for Remove
**Location:** `discovery-card.tsx` (line 113)
Should use `hover:bg-destructive`.
**Command:** `/impeccable:normalize`

### M5. Verified Badge Color
**Location:** `profile-hero.tsx` (line 51) — `text-blue-400 fill-blue-400`
Should use `text-info` or a semantic token.
**Command:** `/impeccable:normalize`

### M6. Sticky Toolbar Positioning on Mobile
**Location:** `vault-client.tsx`, `explore-header.tsx`
Sticky toolbars may conflict with mobile header height. Should use explicit `top-14`.
**Command:** `/impeccable:adapt`

### M7. Missing `aria-controls` on Tabs
**Location:** `collection-tabs.tsx` (lines 31-58)
Tabs have `role="tab"` and `aria-selected` but no `aria-controls` linking to panels.
**WCAG:** 4.1.2 Name, Role, Value (Level A)
**Command:** `/impeccable:harden`

### M8. Loading Spinners Missing ARIA
**Location:** `vault/page.tsx` (line 47-51), `explore/page.tsx` (line 37-41)
Loader2 icon rendered without `aria-label="Loading"` or `role="status"`.
**Command:** `/impeccable:harden`

### M9. Theme Chips No Scroll Indicator
**Location:** `theme-chips.tsx`
Horizontal overflow scroll with no visual affordance that more items exist off-screen.
**Command:** `/impeccable:clarify`

### M10. `FollowButton` Inline Definition
**Location:** `suggested-collectors.tsx` (lines 15-54)
Defined inside parent component — re-created on every render. Should be extracted.
**Command:** `/impeccable:optimize`

### M11. Text Truncation Without Tooltip
**Location:** `dashboard-stats.tsx` (line 52), `vault-card.tsx` (line 90), multiple discovery cards
Truncated text has no `title` or tooltip for accessing full content.
**Command:** `/impeccable:clarify`

### M12. Inconsistent Page Padding
**Location:** Various pages
Mix of `px-4 sm:px-6`, `px-6 md:px-10`, `px-8`. Should standardize.
**Command:** `/impeccable:normalize`

### M13. Set Detail Actions File Size
**Location:** `set-detail-actions.tsx` (216 lines)
Multiple conditional renders for different states — could extract button groups.
**Command:** `/impeccable:extract`

### M14. Inline Style for Stud Pattern
**Location:** `stud-pattern-bg.tsx` (lines 11-13)
Uses inline style for radial-gradient. Could be a CSS utility class (already exists as `.stud-bg`).
**Command:** `/impeccable:normalize`

### M15. OG Image Using Raw `<img>`
**Location:** `share-collection-card.tsx` (lines 79-83)
Has ESLint disable comment for `no-img-element`. Consider using `<Image>` with `unoptimized` prop.
**Command:** `/impeccable:optimize`

---

## Low-Severity Issues

| # | Issue | Location | Category |
|---|-------|----------|----------|
| L1 | `transition-all` could be `transition-[transform,shadow]` | discovery-card.tsx | Performance |
| L2 | Continuous `animate-pulse` on profile avatar glow | profile-hero.tsx | Performance |
| L3 | `NotificationItem` not memoized | notification-bell.tsx | Performance |
| L4 | `VaultCard` could benefit from `React.memo` | vault-card.tsx | Performance |
| L5 | Filter/Sort labels are `<span>` not headings | vault-toolbar.tsx | Accessibility |
| L6 | Inline styles for safe-area env() | mobile-bottom-nav.tsx | Necessary |
| L7 | Dynamic progress bar width via inline style | rank-progress.tsx | Necessary |
| L8 | Theme filter search icon positioning | theme-filter-modal.tsx | UX |
| L9 | Missing responsive gaps on some grids | dashboard-stats.tsx, set-detail-stats.tsx | Responsive |
| L10 | Mobile bottom nav text at `text-[10px]` | mobile-bottom-nav.tsx | Accessibility |

---

## Patterns & Systemic Issues

1. **Background images for meaningful content** — 5+ components use `background-image` divs for set images instead of `<img>` or `<Image>`. This is the single most impactful pattern to fix.
2. **Hard-coded Tailwind colors** — At least 12 instances of `text-red-500`, `bg-green-700`, `text-blue-400` etc. instead of semantic tokens (`--destructive`, `--success`, `--info`). The design system defines these tokens but they're inconsistently used.
3. **Icon buttons below 44px** — The base `icon` button variant is 36px. This affects every icon button in the app. A single change to `button.tsx` would fix all of them.
4. **Missing focus-visible styles** — Navigation components rely on browser defaults. Should add explicit focus ring styles.

---

## Positive Findings

1. **Semantic landmarks are correct** — `<main>`, `<aside>`, `<nav>`, `<footer>` used appropriately throughout the layout system
2. **Dialog accessibility is solid** — All modals use shadcn `<Dialog>` with proper `DialogTitle` and `DialogDescription`
3. **Tab ARIA is mostly complete** — `role="tablist"`, `role="tab"`, `aria-selected` all present on collection tabs
4. **`useMemo` / `useCallback` used where it matters** — `theme-selector.tsx`, `theme-filter-modal.tsx`, `search-page-client.tsx` all optimize correctly
5. **Suspense + skeleton loaders** — Every page has proper loading states with skeleton fallbacks
6. **Mobile bottom nav safe area** — Correctly uses `env(safe-area-inset-bottom)` for iOS
7. **CSS custom properties for theming** — Well-structured token system in `globals.css` covering light and dark modes

---

## Recommendations by Priority

### Immediate (this session)
1. Replace background-image divs with `<Image>` + alt text in the 5 critical components
2. Add `aria-label` to all icon-only buttons and clickable badges
3. Add `focus-visible:ring-2 focus-visible:ring-primary` to sidebar and mobile nav links

### Short-term (this sprint)
4. Replace hard-coded Tailwind colors with semantic tokens app-wide
5. Increase icon button size to 40px minimum in `button.tsx`
6. Fix safe area padding on mobile pages
7. Fix responsive issues: public profile padding, collection tabs width, footer overflow

### Medium-term (next sprint)
8. Extract large components (edit-profile-form, search-page-client, vault-toolbar)
9. Add `aria-controls` to collection tabs
10. Add tooltips to truncated text
11. Standardize page padding pattern

### Long-term (backlog)
12. Add reduced-motion media query support
13. Optimize `transition-all` to specific properties
14. Add `React.memo` to list item components
15. Audit color contrast ratios with automated tooling

---

## Suggested Commands for Fixes

| Command | Issues Addressed | Count |
|---------|-----------------|-------|
| `/impeccable:harden` | Background images, ARIA labels, focus styles, form associations, loading states | 12 |
| `/impeccable:normalize` | Hard-coded colors, inconsistent tokens, semantic token usage | 10 |
| `/impeccable:adapt` | Touch targets, safe area, fixed widths, responsive padding, sticky positioning | 8 |
| `/impeccable:optimize` | next/image usage, component extraction, memoization, transition specificity | 6 |
| `/impeccable:clarify` | Scroll indicators, truncation tooltips, error messaging | 4 |
| `/impeccable:extract` | Large component files, reusable patterns | 2 |
