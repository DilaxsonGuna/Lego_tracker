# BrickBox Design System

Lego yellow primary, warm dark palette. All tokens defined as CSS variables in `globals.css`.

## Color Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Primary | `#ffd000` | `#ffd000` | Accents, buttons, highlights |
| Primary Ghost | — | 10% opacity primary | Hover backgrounds (tabs, buttons) |
| Background | `#f8f8f5` | `#18150c` | Page background |
| Card/Surface | `#ffffff` | `#231f0f` | Card backgrounds |
| Surface Accent | — | subtle accent | Hover states |
| Border | — | `#36301a` | Borders (warm) |
| Success | green | green | Positive states |
| Warning | amber | amber | Caution states |
| Info | blue | blue | Informational states |

## Spacing & Radius

- Default border radius: `0.75rem` (12px)

## Typography

- Font: Geist Sans (via `font-display` utility, loaded with `next/font`)
- Weights: 400–800

## Custom CSS Utilities

- `.scrollbar-hide` — Hides scrollbars across browsers (used on stories carousel)
- `.stud-bg` — Lego stud pattern background via radial gradient (24px grid)

## shadcn/ui

Style variant: `new-york`. Add components with:
```bash
npx shadcn@latest add <component-name>
```

Path alias: `@/*` maps to project root.

Toasts use `sonner` — already configured via `components/ui/sonner.tsx`.
