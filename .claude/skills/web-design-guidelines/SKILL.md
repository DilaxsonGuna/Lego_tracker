---
name: web-design-guidelines
description: Audit UI code against 100+ accessibility and UX standards. Check ARIA, keyboard nav, focus states, semantic HTML, touch targets, and responsive design. Use after building UI or during design review.
origin: vercel-labs (adapted)
---

# Web Design Guidelines

Quality gate for UI code — catches accessibility and usability issues missed under deadline pressure.

## When to Use

- After building any user-facing UI component
- During design review (pairs with `designcheck`)
- Before shipping a feature
- When `impeccable:audit` flags accessibility issues

## Accessibility Checklist

### Semantic HTML (Critical)
- [ ] Use correct heading hierarchy (`h1` → `h2` → `h3`, no skipped levels)
- [ ] Use `<button>` for actions, `<a>` for navigation — never `<div onClick>`
- [ ] Use `<nav>`, `<main>`, `<aside>`, `<footer>` landmarks
- [ ] Lists use `<ul>`/`<ol>` + `<li>`, not styled `<div>`s
- [ ] Tables use `<table>` with `<thead>`/`<tbody>`, not grid layouts for tabular data

### ARIA & Labels (Critical)
- [ ] All interactive elements have accessible names (label, aria-label, or aria-labelledby)
- [ ] Form inputs have associated `<label>` elements (not just placeholder text)
- [ ] Icons-only buttons have `aria-label` (e.g., `<Button aria-label="Close">`)
- [ ] `aria-hidden="true"` on decorative elements
- [ ] Dynamic content updates use `aria-live` regions
- [ ] Modal dialogs use `role="dialog"` with `aria-modal="true"`
- [ ] Don't misuse ARIA — no role is better than wrong role

### Keyboard Navigation (Critical)
- [ ] All interactive elements are focusable and operable with keyboard
- [ ] Visible focus indicators on all interactive elements (not just `:focus`, use `:focus-visible`)
- [ ] Tab order follows visual layout (no `tabIndex > 0`)
- [ ] Modal dialogs trap focus (focus stays inside until closed)
- [ ] Escape key closes modals/dropdowns
- [ ] Skip-to-content link for keyboard users

### Color & Contrast (High)
- [ ] Text meets WCAG AA contrast ratio (4.5:1 normal text, 3:1 large text)
- [ ] UI components meet 3:1 contrast against background
- [ ] Color is not the only means of conveying information (add icons, patterns, text)
- [ ] Check contrast with BrickBox dark theme tokens specifically

### Touch & Interaction (High)
- [ ] Touch targets minimum 44x44px (WCAG 2.5.5)
- [ ] Adequate spacing between touch targets (8px minimum)
- [ ] No hover-only interactions — all hover content accessible via focus/click
- [ ] Drag interactions have keyboard alternatives

### Responsive & Motion (Medium)
- [ ] `prefers-reduced-motion` respected for animations
- [ ] Content readable at 200% zoom
- [ ] No horizontal scrolling on mobile widths
- [ ] Images have `alt` text (empty `alt=""` for decorative images)
- [ ] Text doesn't overflow containers

### Forms (High)
- [ ] Error messages associated with inputs via `aria-describedby`
- [ ] Required fields marked with `aria-required="true"` (not just visual *)
- [ ] Autocomplete attributes on common fields (name, email, etc.)
- [ ] Form validation announced to screen readers
- [ ] Disabled states clearly communicated (`aria-disabled` + visual)

## Lego Tracker Specific

- **Set cards in Explore/Vault**: Must have alt text on set images, keyboard-navigable grid
- **Leaderboard**: Table with proper `<thead>`, rank changes announced
- **Sidebar navigation**: Landmarks (`<nav>`), current page indicated with `aria-current="page"`
- **Collection Card (OG image)**: Alt text describing collection stats
- **Toast notifications (sonner)**: Already uses `aria-live` — verify works with screen readers
- **Theme selector**: Proper radio group semantics
- **Search**: `role="combobox"` with `aria-expanded`, results announced

## Integration

Works with:
- **designcheck** — triggers `impeccable:audit` which includes a11y checks
- **react-best-practices** — performance + accessibility together
- **requesting-code-review** — add these to the review checklist for UI work
- **impeccable:harden** — makes interfaces robust including a11y
