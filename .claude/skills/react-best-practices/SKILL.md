---
name: react-best-practices
description: Apply React/Next.js performance optimization rules when building or reviewing components. 57 rules across 8 categories prioritized by impact. Use after implementing features or during code review.
origin: vercel-labs (adapted)
---

# React & Next.js Best Practices

Apply performance optimization rules prioritized by actual impact — fix real bottlenecks before micro-optimizations.

## When to Use

- After implementing a new component or page
- During code review (pairs with requesting-code-review)
- When investigating performance issues
- Before shipping a feature to production

## Rules by Priority (highest impact first)

### 1. Request Waterfalls (Critical)
- **Eliminate sequential data fetches** — use parallel `Promise.all()` or React Suspense boundaries to stream content
- **Move data fetching to server components** — avoid client-side fetches for data available at request time
- **Use `loading.tsx` and Suspense** — stream slow data without blocking the full page
- **Prefetch links** — Next.js `<Link>` prefetches by default, don't disable without reason

### 2. Bundle Size (High)
- **Avoid barrel imports** — import `{ Button } from '@/components/ui/button'` not from `'@/components/ui'`
- **Use `next/dynamic`** for heavy components (charts, editors, maps) not needed on initial render
- **Tree-shake icon libraries** — import `lucide-react` icons individually
- **Lazy load below-the-fold content** — `React.lazy()` or dynamic imports for tabs, modals, accordions

### 3. Server-Side Performance (High)
- **Default to Server Components** — only add `"use client"` when you need interactivity
- **Cache expensive operations** — use `unstable_cache` or React `cache()` for repeated queries
- **Use `next/image`** — automatic optimization, lazy loading, responsive sizing
- **Streaming with Suspense** — wrap slow server components in `<Suspense>` with fallback

### 4. Data Fetching (Medium-High)
- **Fetch in server components, pass as props** — not `useEffect` + `useState` patterns
- **Deduplicate requests** — React auto-dedupes `fetch()` in server components
- **Use route handlers for mutations** — server actions for writes, route handlers for external APIs
- **Revalidate strategically** — `revalidatePath()` / `revalidateTag()` not full page refreshes

### 5. Re-renders (Medium)
- **Derive state, don't sync it** — compute values from existing state instead of `useEffect` → `setState`
- **Lift state up minimally** — keep state close to where it's used
- **Use `useCallback`/`useMemo` only when measured** — premature memoization adds complexity without benefit
- **Stable references for callbacks** — avoid inline arrow functions in frequently re-rendering lists
- **Use `React.memo` for expensive pure components** — but profile first

### 6. Rendering (Medium)
- **Use `content-visibility: auto`** for long lists/grids — browser skips rendering off-screen elements
- **Virtualize long lists** — `react-window` or `@tanstack/virtual` for 100+ item lists
- **Conditional rendering** — don't render hidden modals/drawers, mount on demand
- **Keys must be stable and unique** — never use array index for dynamic lists

### 7. JavaScript Performance (Low-Medium)
- **Debounce search inputs** — 300ms delay before triggering queries
- **Use `requestAnimationFrame` for animations** — not `setTimeout`/`setInterval`
- **Avoid layout thrashing** — batch DOM reads and writes
- **Use `Set`/`Map` for lookups** — O(1) instead of `.find()`/`.includes()` on arrays

### 8. Advanced Patterns (Low)
- **Use `useOptimistic` for mutations** — instant UI feedback while server processes
- **Streaming SSR with React 19** — progressive hydration for complex pages
- **Route groups for layout sharing** — `(app)/` pattern for shared sidebar layouts
- **Parallel routes** — `@modal` slots for modal-based navigation

## Lego Tracker Specific

- **Explore page**: Virtual list for set grid if displaying 100+ sets
- **Vault page**: Suspense boundaries around collection/wishlist sections
- **Set detail**: Dynamic import for related sets section (below fold)
- **Search**: Debounce input, fetch server-side
- **Images**: Already using `next/image` with Rebrickable CDN — good
- **Components**: Keep barrel exports in `components/{page}/index.ts` but import specifically in pages

## Integration

Works with:
- **requesting-code-review** — add these checks to the review checklist
- **verification-before-completion** — `npm run build` catches SSR issues
- **designcheck** → `impeccable:optimize` — performance + design quality together
