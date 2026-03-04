# Achievements: Load on Every Visit & Flashing Exclamation Badge

This document describes two issues and how to fix them:

1. **Achievements are fetched every time the dashboard (or achievements page) is accessed** — no caching, so repeated visits cause unnecessary API calls and delay.
2. **A flashing exclamation mark appears on each achievement card** — the “new” badge uses a continuous ping animation and `isNew` is never cleared, so it keeps flashing.

---

## Issue 1: Achievements Load Every Time the Dashboard Is Accessed

### Cause

- **Dashboard** (`src/app/dashboard/page.tsx`): On mount, `checkStudentAccess()` runs in a `useEffect` with empty deps. It always fetches `/api/auth/me`, `/api/student/progress`, `/api/student/assigned-tests`, and **`/api/student/achievements`**. There is no cache or “skip if we already have data” logic.
- **Achievements page** (`src/app/dashboard/achievements/page.tsx`): Similarly fetches `/api/student/achievements` on every visit via `checkAccessAndLoad()` in `useEffect`.

So every navigation to the dashboard or to the achievements page triggers a full achievements API call.

### Solution

**Option A – Client-side cache (recommended)**  
Use a data-fetching library with caching so achievements are reused across navigations and only revalidated when needed:

- **SWR**: `useSWR('/api/student/achievements', fetcher, { revalidateOnFocus: false, dedupingInterval: 60000 })`  
  - Use the same key on both the dashboard and the achievements page so they share cache.
- **React Query (TanStack Query)**: `useQuery({ queryKey: ['achievements'], queryFn: fetchAchievements, staleTime: 60 * 1000 })`  
  - Use the same `queryKey` on both pages.

Then:

- In **dashboard** `page.tsx`: Replace the manual `fetch('/api/student/achievements')` inside `checkStudentAccess()` with the cached hook (e.g. `useSWR` or `useQuery`). Keep auth/progress/assigned-tests in `checkStudentAccess()` if you want, but load achievements only via the hook so they’re cached.
- In **achievements** `page.tsx`: Use the same hook so the achievements page reads from the same cache and doesn’t refetch on every visit unless stale.

**Option B – Skip fetch if already loaded (minimal change)**  
If you don’t want to add SWR/React Query:

- In the dashboard, only fetch achievements when `achievements === null` (e.g. after auth succeeds). Once set, don’t clear it on subsequent mounts unless you explicitly want a refresh (e.g. after earning a new achievement).
- On the achievements page, you can either fetch once and keep in state, or accept one fetch per visit and at least avoid double-fetch on the dashboard when the user already has data.

**Option C – HTTP cache on the API**  
In `src/app/api/student/achievements/route.ts`, you can add short-lived cache headers so the browser can reuse the response:

```ts
return NextResponse.json({ ... }, {
  status: 200,
  headers: {
    'Cache-Control': 'private, max-age=60', // 1 minute
  },
})
```

Use this in addition to Option A or B for fewer requests; don’t rely on it alone for in-app navigation because the dashboard still runs a new request on each mount without client cache.

### Files to touch

- `src/app/dashboard/page.tsx` — use cached achievements (or conditional fetch).
- `src/app/dashboard/achievements/page.tsx` — use same cache or single fetch.
- Optionally: `src/app/api/student/achievements/route.ts` — add `Cache-Control` as above.

---

## Issue 2: Flashing Exclamation Mark on Achievement Cards

### Cause

- **Persistent “new” state**: `StudentAchievement.isNew` is set to `true` when an achievement is earned (e.g. in `src/app/api/student/achievements/route.ts` and `src/lib/achievements.ts`) but is **never set back to `false`**. So every achievement that was ever “new” still has `isNew: true` and the badge keeps showing.
- **Continuous animation**: The “new” badge uses Tailwind’s `animate-ping` (a repeating ping), so the exclamation mark appears to flash on every card that has `isNew === true`.

Relevant UI locations:

- `src/app/dashboard/achievements/page.tsx` — achievement grid cards (lines ~230–239).
- `src/components/motivation/MedalsDisplay.tsx` — medal cards (lines ~73–81).
- `src/components/motivation/TrophyShowcase.tsx` — trophy cards (uses same pattern with `animate-ping`).

### Solution

**Part 1 – Stop the flashing (UI)**  
Make the “new” indicator non-flashing or only animate once:

- **Static badge**: Remove the ping layer and keep only the solid circle with “!”:
  - Remove the `<span className="animate-ping ...">` element.
  - Keep the inner `<span className="relative inline-flex rounded-full ... !">` so the badge is visible but not flashing.
- **One-time animation**: If you want a short “attention” effect without endless flashing, replace `animate-ping` with a one-off animation (e.g. a custom CSS animation that runs once) or use `animate-pulse` with a limited number of iterations via a custom class.

Apply the same change in:

- `src/app/dashboard/achievements/page.tsx`
- `src/components/motivation/MedalsDisplay.tsx`
- `src/components/motivation/TrophyShowcase.tsx`

**Part 2 – Mark achievements as seen (backend + API)**  
So “new” doesn’t show forever:

1. **API to mark as seen**  
   Add an endpoint that sets `isNew` to `false` for the current student’s achievements, e.g.:
   - `PATCH /api/student/achievements/seen` or  
   - `POST /api/student/achievements/mark-seen`  
   In the handler, after validating the user is a student, run an update such as:
   - `prisma.studentAchievement.updateMany({ where: { studentId }, data: { isNew: false } })`.

2. **When to call it**  
   Call this endpoint when the user has “seen” the achievements, for example:
   - When the achievements page mounts (user opened the achievements section), or
   - When the dashboard’s achievements block is first visible (e.g. when dashboard mount finishes and achievements are rendered).

3. **Optional: only mark when there are new achievements**  
   You can first GET achievements, and only call “mark seen” if `newAchievements.length > 0`, to avoid unnecessary writes.

### Files to touch

- **UI (flashing)**  
  - `src/app/dashboard/achievements/page.tsx` — remove or replace `animate-ping` on the “new” badge.
  - `src/components/motivation/MedalsDisplay.tsx` — same.
  - `src/components/motivation/TrophyShowcase.tsx` — same.
- **Backend (persistent badge)**  
  - New route: e.g. `src/app/api/student/achievements/seen/route.ts` (or `mark-seen`) with `PATCH`/`POST` that sets `isNew: false` for the student.
  - `src/app/dashboard/achievements/page.tsx` — call the “mark seen” API on mount (and optionally update local state so badges disappear without refetch).
  - Optionally: `src/app/dashboard/page.tsx` — call “mark seen” when achievements are shown on the dashboard, if you want the badge to clear from the dashboard as well.

---

## Summary

| Issue | Cause | Fix |
|-------|--------|-----|
| Achievements load every time | No client cache; dashboard and achievements page both fetch on every visit | Use SWR/React Query (or conditional fetch) and shared cache; optionally add short `Cache-Control` on the API |
| Flashing exclamation on cards | `animate-ping` runs forever; `isNew` is never set to `false` | Remove or replace `animate-ping` with static/one-time animation; add “mark seen” API and call it when user views achievements |

After both fixes, the dashboard will reuse cached achievements when possible, and the “new” badge will either be static or disappear after the user has seen the achievements.
