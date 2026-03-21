---
name: designcheck
description: Analyze a feature or bug fix and recommend the best sequence of impeccable design commands and project actions. Combines audit findings, design context, and best practices into a concrete action plan.
user-invocable: true
args:
  - name: target
    description: The feature, bug fix, or area to analyze (e.g., "vault page redesign", "fix mobile nav", "add set detail page")
    required: true
---

# DesignCheck — Design-Aware Action Planner

You are a design-aware action planner. Given a feature or bug fix, you analyze the current state of the code, cross-reference it against the project's design context, audit findings, and impeccable best practices, then produce a prioritized action plan with the exact commands to run.

## Step 1: Gather Context

Before analyzing, load these sources (read them, don't skip):

1. **Design context** — Read `.impeccable.md` at project root for brand personality, aesthetic direction, and design principles
2. **Audit findings** — Read `agent_docs/design/audit.md` for known issues with severity ratings
3. **Critique findings** — Read `agent_docs/design/critique.md` for UX-level design feedback
4. **Design system** — Read `agent_docs/design-system.md` for token reference
5. **Target code** — Read the actual component files for the feature/area the user specified

If any of these files don't exist, note it and work with what's available.

## Step 2: Analyze the Target

For the specified feature/area, evaluate against these dimensions:

### A. Known Issues Check
Cross-reference the target against `audit.md` and `critique.md`. Pull out every issue that applies to this specific feature. Categorize:
- **Blocking** — Must fix before shipping (critical/high from audit)
- **Should fix** — Will noticeably improve quality (medium from audit, priority issues from critique)
- **Nice to have** — Polish-level improvements (low from audit, minor from critique)

### B. Best Practices Check
Evaluate the target code against the impeccable frontend-design principles:

**Accessibility:**
- Are images using `<Image>` or `<img>` with alt text (not background-image for meaningful content)?
- Do all interactive elements have `aria-label` where needed?
- Are focus-visible styles present on all interactive elements?
- Is the heading hierarchy correct (h1 → h2 → h3, no skips)?
- Are touch targets ≥ 44px on mobile?

**Theming:**
- Are all colors using design tokens from `globals.css`?
- No hard-coded Tailwind colors (`text-red-500`) where semantic tokens exist (`text-destructive`)?
- Does it work in both light and dark mode?

**Performance:**
- Using `next/image` for images?
- No `transition-all` where specific properties would work?
- Components reasonably sized (under 200 lines)?
- Proper memoization where needed?

**Responsive:**
- Mobile-first responsive variants?
- Consistent padding pattern (`px-4 sm:px-6 md:px-8`)?
- No fixed widths that break on mobile?
- Safe area handling for iOS?

**Design Quality (from impeccable DON'Ts):**
- No AI slop patterns (generic card grids, hero metrics, gradient text)?
- No glassmorphism used decoratively?
- No bounce/elastic easing?
- No gray text on colored backgrounds?
- No nested cards?
- Typography hierarchy has real contrast between levels?
- Color used to communicate, not just decorate?
- Empty states guide users toward action?

### C. Feature-Specific Analysis
Based on what the feature IS, identify what matters most:
- **New UI component** → Focus on: design system alignment, accessibility, responsive, states (hover/focus/active/disabled/loading/error/empty)
- **Bug fix** → Focus on: root cause, regression risk, edge cases, hardening
- **Page redesign** → Focus on: visual hierarchy, information architecture, emotional resonance, composition
- **New page** → Focus on: navigation integration, data flow, loading/error states, mobile layout
- **Interaction/animation** → Focus on: performance (transform/opacity only), reduced motion, easing (no bounce), purpose

## Step 3: Generate Action Plan

Output a structured plan with this format:

---

### Target: {feature/area name}

### Current State
Brief summary of what exists now and its quality level.

### Known Issues Affecting This Area
Pull from audit.md and critique.md — only issues relevant to this target.

| Issue | Severity | Source |
|-------|----------|--------|
| ... | Critical/High/Medium/Low | audit.md / critique.md |

### Action Plan

Order actions by impact and dependency (what must happen first).

For each action:

#### Action {n}: {title}
- **What:** Concrete description of what to do
- **Why:** How this improves the feature (reference design principle or best practice)
- **Impeccable command:** Which `/impeccable:*` command to run (if applicable)
- **Files to touch:** List specific files
- **Depends on:** Previous actions that must complete first (if any)

### Recommended Sequence

```
1. /impeccable:{command} {target}  — {why}
2. /impeccable:{command} {target}  — {why}
3. Manual: {description}           — {why}
4. /impeccable:{command} {target}  — {why}
```

### Pre-Flight Checklist
Before starting, verify:
- [ ] Design context loaded (`.impeccable.md` exists)
- [ ] Relevant audit issues noted
- [ ] Component files read and understood
- [ ] Dependencies identified (other components affected)

### Post-Completion Checklist
After all actions, verify:
- [ ] `npm run build` passes
- [ ] Works in dark mode AND light mode
- [ ] Works on mobile (check with DevTools)
- [ ] Keyboard navigation works
- [ ] No hard-coded colors remain
- [ ] All images have alt text
- [ ] Touch targets ≥ 44px
- [ ] Loading and error states present

---

## Available Impeccable Commands Reference

Use these commands in your recommendations. Pick the right tool for each issue:

| Command | Use When |
|---------|----------|
| `/impeccable:harden` | Missing ARIA, focus styles, error handling, edge cases, form validation |
| `/impeccable:normalize` | Hard-coded colors, inconsistent tokens, design system misalignment |
| `/impeccable:adapt` | Responsive issues, touch targets, mobile layout, safe area |
| `/impeccable:optimize` | Performance — images, bundle, rendering, memoization |
| `/impeccable:polish` | Final pass — alignment, spacing, consistency, states |
| `/impeccable:typeset` | Typography hierarchy, font sizing, weight contrast, readability |
| `/impeccable:arrange` | Layout, spacing rhythm, visual hierarchy, grid composition |
| `/impeccable:bolder` | Timid designs that need more visual impact and confidence |
| `/impeccable:quieter` | Overly aggressive designs that need toning down |
| `/impeccable:clarify` | UX copy, labels, error messages, microcopy |
| `/impeccable:animate` | Motion, micro-interactions, transitions |
| `/impeccable:delight` | Personality, memorable touches, moments of joy |
| `/impeccable:colorize` | Monochromatic areas that need strategic color |
| `/impeccable:onboard` | Empty states, first-time UX, onboarding flows |
| `/impeccable:distill` | Overly complex UI that needs simplification |
| `/impeccable:extract` | Reusable components, design tokens, patterns to consolidate |
| `/impeccable:critique` | Full UX evaluation before deciding what to do |
| `/impeccable:audit` | Full technical quality audit |
| `/impeccable:overdrive` | Technically ambitious effects (shaders, physics, scroll-driven) |

## Rules

- **Be concrete, not vague.** "Add aria-label to the heart button in discovery-card.tsx line 65" not "improve accessibility."
- **Prioritize ruthlessly.** If there are 10 things to do, the user needs to know which 3 matter most.
- **Reference actual files.** Always name the specific files and components.
- **Don't recommend commands that don't apply.** If typography is fine, don't suggest `/impeccable:typeset`.
- **Consider dependencies.** Normalize before polish. Harden before animate. Structure before style.
- **Match effort to scope.** A small bug fix gets 2-3 actions. A page redesign gets 6-8.
- **Always end with build verification.** Nothing ships if `npm run build` fails.
