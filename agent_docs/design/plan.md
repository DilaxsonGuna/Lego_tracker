# UI Development Plan: LegoFlex

_Generated 2026-03-21 from audit.md + critique.md_

---

## Overview

42 issues (audit) + 5 priority design problems (critique) organized into 6 phases. Each phase is a self-contained unit of work with clear inputs, commands, and verification steps.

**Guiding principle:** Fix foundations first (accessibility, tokens), then improve design quality (hierarchy, boldness), then polish.

---

## Phase 1: Accessibility Foundations

_Fix critical barriers that block users from accessing content._

### Task 1.1: Replace background-image divs with `<Image>` + alt text
- **Files:** `discovery-card.tsx`, `vault-card.tsx`, `vault-list.tsx`, `favorites-grid.tsx`, `set-detail-hero.tsx`
- **What:** Replace `style={{ backgroundImage }}` divs with Next.js `<Image>` using `fill` prop and descriptive alt text
- **Why:** WCAG 1.1.1 Level A — core content invisible to screen readers
- **Severity:** CRITICAL
- **Command:** `/impeccable:harden discovery-card`
- **Verify:** Screen reader announces set names on all card types

### Task 1.2: Add focus-visible styles to navigation
- **Files:** `sidebar.tsx`, `mobile-bottom-nav.tsx`, `avatar-selector.tsx`
- **What:** Add `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` to all nav links and interactive elements
- **Why:** WCAG 2.4.7 Level AA — keyboard users can't see focus
- **Severity:** CRITICAL
- **Command:** `/impeccable:harden sidebar`
- **Verify:** Tab through entire app, confirm visible focus ring on every interactive element

### Task 1.3: Add ARIA labels to interactive elements
- **Files:** `theme-filter-modal.tsx`, `theme-selector.tsx`, `discovery-card.tsx`, `vault-toolbar.tsx`, `vault/page.tsx`, `explore/page.tsx`
- **What:**
  - Add `aria-label` to clickable `<Badge>` elements (replace `onClick` badges with `<button>`)
  - Replace `title` with `aria-label` on heart/collection buttons in discovery cards
  - Add `aria-label` to vault toolbar `<Select>` components
  - Add `aria-label="Loading"` + `role="status"` to loading spinners
  - Add `aria-controls` to collection tabs
- **Why:** WCAG 4.1.2 Level A — interactive elements not announced by screen readers
- **Severity:** HIGH
- **Command:** `/impeccable:harden vault-toolbar`
- **Verify:** VoiceOver/NVDA announces all interactive elements correctly

### Task 1.4: Fix heading hierarchy
- **Files:** `favorites-grid.tsx`, profile page components
- **What:** Fix `<h3>` without preceding `<h2>` — ensure h1 → h2 → h3 progression
- **Why:** WCAG 1.3.1 Level A
- **Severity:** HIGH
- **Verify:** No heading level skips in any page

---

## Phase 2: Design System Alignment

_Ensure all colors use tokens so theming works correctly._

### Task 2.1: Replace hard-coded hex colors
- **Files:** `sidebar.tsx`, `search-page-client.tsx`
- **What:** Replace `#3b82f6` with `hsl(var(--info))` or `hsl(var(--primary))`
- **Severity:** CRITICAL
- **Command:** `/impeccable:normalize sidebar`

### Task 2.2: Create semantic status tokens and apply
- **Files:** `globals.css`, `vault-card.tsx`, `vault-list.tsx`
- **What:** Add status tokens to globals.css (`--status-built`, `--status-in-box`, `--status-missing-parts`, `--status-for-sale`) or map to existing `--success`, `--warning`, `--info`, `--destructive`. Update vault card/list badge variants.
- **Severity:** CRITICAL
- **Command:** `/impeccable:normalize vault-card`

### Task 2.3: Replace hard-coded Tailwind colors with semantic tokens
- **Files:** `login-form.tsx`, `sign-up-form.tsx`, `forgot-password-form.tsx`, `edit-profile-form.tsx`, `profile-hero.tsx`, `discovery-card.tsx`, `avatar-selector.tsx`, `password-strength.tsx`
- **What:**
  - `text-red-500` → `text-destructive`
  - `text-green-500` / `bg-green-500` → `text-success` / `bg-success`
  - `text-blue-400` → `text-info`
  - `hover:bg-red-500` → `hover:bg-destructive`
- **Severity:** HIGH
- **Command:** `/impeccable:normalize` (app-wide)
- **Verify:** Toggle light/dark mode — all colors adapt correctly

### Task 2.4: Standardize page padding
- **Files:** All `page.tsx` files under `app/(app)/`
- **What:** Standardize to `px-4 sm:px-6 md:px-8` pattern. Fix `u/[userId]/page.tsx` using only `px-8`.
- **Severity:** MEDIUM
- **Command:** `/impeccable:normalize`

### Task 2.5: Use `.stud-bg` utility instead of inline style
- **Files:** `stud-pattern-bg.tsx`
- **What:** Replace inline `style={{ backgroundImage: 'radial-gradient(...)' }}` with the existing `.stud-bg` CSS utility
- **Severity:** MEDIUM

---

## Phase 3: Responsive & Touch Targets

_Make the app work reliably on mobile devices._

### Task 3.1: Increase icon button touch targets
- **Files:** `components/ui/button.tsx`
- **What:** Change icon variant from `size-9` (36px) to `size-10` (40px). This single change fixes: notification bell, discovery card heart, vault card favorite, toolbar filter buttons.
- **Severity:** HIGH
- **Command:** `/impeccable:adapt`
- **Verify:** All icon buttons ≥ 40px in DevTools mobile view

### Task 3.2: Increase checkbox touch targets
- **Files:** `components/ui/checkbox.tsx`
- **What:** Change from `h-4 w-4` (16px) to `h-5 w-5` (20px) and add padding wrapper for larger tap area
- **Severity:** MEDIUM
- **Command:** `/impeccable:adapt`

### Task 3.3: Fix safe area padding
- **Files:** `app/(app)/layout.tsx`, all page files with `pb-20`
- **What:** Replace `pb-20` with `pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0`
- **Severity:** HIGH
- **Command:** `/impeccable:adapt`
- **Verify:** Test on iOS Safari — content doesn't overlap with home indicator

### Task 3.4: Fix collection tabs width overflow
- **Files:** `collection-tabs.tsx`
- **What:** Change `w-64` to `w-48 sm:w-64` or `max-w-[90vw]`
- **Severity:** HIGH

### Task 3.5: Fix profile footer overflow
- **Files:** `profile-footer.tsx`
- **What:** Change `flex gap-8` to `flex flex-wrap gap-4 sm:gap-8`
- **Severity:** MEDIUM

### Task 3.6: Fix sticky toolbar positioning
- **Files:** `vault-client.tsx`, `explore-header.tsx`
- **What:** Add explicit `top-14` to account for mobile header height
- **Severity:** MEDIUM

---

## Phase 4: Visual Design — Bold & Distinctive

_Bring the Profile page's confidence to the rest of the app._

### Task 4.1: Redesign home page hierarchy
- **Files:** `components/home/dashboard-stats.tsx`, `recently-added.tsx`, `following-activity.tsx`, `quick-actions.tsx`
- **What:** Make recently-added the hero section (larger images, featured set). Compact stats into inline row (not 4 separate cards). Increase activity feed thumbnails from `size-10` to at least `size-16`.
- **Why:** Home page feels like a generic dashboard, not a collector's showcase
- **Command:** `/impeccable:bolder home page` → `/impeccable:arrange home page`

### Task 4.2: Make explore cards image-forward
- **Files:** `components/explore/discovery-card.tsx`, `discovery-grid.tsx`
- **What:** Remove inner `p-6` padding on image area — let images fill the card. Consider masonry layout for visual variety. Integrate theme/year badges more naturally.
- **Why:** For a Pinterest/Discogs-inspired platform, the browse should be a visual gallery
- **Command:** `/impeccable:bolder explore cards` → `/impeccable:arrange explore grid`

### Task 4.3: Strengthen typography hierarchy
- **Files:** All section headings across the app
- **What:** Create 2-3 distinct heading levels:
  - Page titles: `text-2xl font-bold` or larger
  - Section titles: `text-base font-bold` or `text-lg` (currently `text-xs uppercase`)
  - Metadata: keep `text-xs uppercase` for labels only
- **Why:** Current type hierarchy is flat — everything whispers at the same volume
- **Command:** `/impeccable:typeset` (app-wide)

### Task 4.4: Redesign empty states
- **Files:** `components/shared/empty-state.tsx`, all empty state usages
- **What:** Make empty states larger, use stud-pattern backgrounds, show preview of filled state, make CTA button prominent
- **Why:** Empty states are the onboarding moment — currently feel like an afterthought
- **Command:** `/impeccable:onboard`

### Task 4.5: Improve mobile bottom nav active state
- **Files:** `components/shared/mobile-bottom-nav.tsx`
- **What:** Add background pill to active tab, increase icon weight/size for active state, consider reducing to 4 tabs (move Settings to menu)
- **Why:** Active state is too subtle — just a color change at 10px text
- **Command:** `/impeccable:polish mobile-bottom-nav`

---

## Phase 5: Performance & Code Quality

_Optimize rendering and extract large components._

### Task 5.1: Replace raw `<img>` with `<Image>`
- **Files:** `following-activity.tsx`, `share-collection-card.tsx`
- **What:** Use Next.js `<Image>` with proper `width`/`height` or `fill` + `unoptimized` for OG images
- **Severity:** CRITICAL (from audit)
- **Command:** `/impeccable:optimize`

### Task 5.2: Extract large components
- **Files:**
  - `edit-profile-form.tsx` (286 lines) → extract AvatarSection, ThemeSection, FormFields
  - `search-page-client.tsx` (268 lines) → extract SetResults, UserResults, ThemeResults
  - `vault-toolbar.tsx` (232 lines) → extract ThemeFilter, SortSelector, ViewModeToggle
  - `onboarding-form.tsx` (261 lines) → extract step components
- **Command:** `/impeccable:extract`

### Task 5.3: Extract inline FollowButton
- **Files:** `suggested-collectors.tsx`
- **What:** Move `FollowButton` (lines 15-54) to its own file, wrap with `React.memo`
- **Command:** `/impeccable:optimize`

### Task 5.4: Optimize transitions
- **Files:** `discovery-card.tsx`, `profile-hero.tsx`
- **What:**
  - Replace `transition-all` with `transition-[transform,shadow]`
  - Review `animate-pulse` on avatar glow — consider `prefers-reduced-motion`
- **Severity:** LOW

---

## Phase 6: Polish & Delight

_Final pass before shipping._

### Task 6.1: Add tooltips to truncated text
- **Files:** `dashboard-stats.tsx`, `vault-card.tsx`, discovery cards
- **What:** Add `title` attribute or tooltip component on elements using `truncate` or `line-clamp`
- **Command:** `/impeccable:clarify`

### Task 6.2: Add scroll indicator to theme chips
- **Files:** `theme-chips.tsx`
- **What:** Add gradient fade or arrow indicator showing more items exist off-screen
- **Command:** `/impeccable:clarify`

### Task 6.3: Clean up profile footer
- **Files:** `profile-footer.tsx`
- **What:** Remove UUID display, review link labels ("Vault Guide", "Privacy Protocol") for premium tone
- **Command:** `/impeccable:clarify`

### Task 6.4: Add reduced-motion support
- **Files:** `globals.css` or `tailwind.config.ts`
- **What:** Add `@media (prefers-reduced-motion: reduce)` to disable animations
- **Command:** `/impeccable:harden`

### Task 6.5: Final polish pass
- **Command:** `/impeccable:polish` on each page after all other phases complete
- **Verify:** `npm run build` passes, both themes work, mobile works, keyboard nav works

---

## Execution Summary

| Phase | Tasks | Focus | Key Commands |
|-------|-------|-------|-------------|
| 1 | 4 | Accessibility | `/impeccable:harden` |
| 2 | 5 | Design tokens | `/impeccable:normalize` |
| 3 | 6 | Mobile/responsive | `/impeccable:adapt` |
| 4 | 5 | Visual design | `/impeccable:bolder`, `arrange`, `typeset`, `onboard` |
| 5 | 4 | Performance/code | `/impeccable:optimize`, `extract` |
| 6 | 5 | Polish | `/impeccable:clarify`, `polish` |
| **Total** | **29** | | |

## Dependency Order

```
Phase 1 (a11y)          ← Do first, these are blockers
    ↓
Phase 2 (tokens)        ← Foundation for all visual work
    ↓
Phase 3 (responsive)    ← Before redesigning, fix the container
    ↓
Phase 4 (visual design) ← The fun part — make it bold
    ↓
Phase 5 (performance)   ← Clean up after changes
    ↓
Phase 6 (polish)        ← Always last
```

## Per-Task Verification

Every task should pass:
- [ ] `npm run build` succeeds
- [ ] Light + dark mode both work
- [ ] Mobile viewport (375px) looks correct
- [ ] Keyboard tab-through works
- [ ] No new ESLint warnings
