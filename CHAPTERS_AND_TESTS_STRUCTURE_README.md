# Chapters and Tests Structure — Answer Shuffling Guide

This document explains how chapters and tests are structured in the app, why students see patterns like “all answers are A or D”, and how to **safely** randomize answer option order everywhere without breaking correctness or data.

---

## 1. How Chapters and Tests Are Structured

### 1.1 Data models

- **Chapters (Question model)**  
  - Stored in `Question` (table `questions`).  
  - Each question has:
    - `options`: JSON array of `{ id: "A"|"B"|"C"|"D", text: "Option text" }` — **always in A, B, C, D order in the DB**.
    - `correctAnswer`: string — the **id** of the correct option (e.g. `"A"`, `"B"`, `"C"`, `"D"`).
  - Student answers are stored as **option id** (e.g. `Answer.selectedAnswer = "B"`). Correctness is computed by comparing `selectedAnswer === correctAnswer`.

- **Untimed tests**  
  - Use the same `Question` model.  
  - `TestQuestion` links a test attempt to a question and stores `selectedAnswer` (A/B/C/D).  
  - Options are passed through as `question.options` (same array shape as above).

- **Assigned tests**  
  - Also use `Question` and the same `options` + `correctAnswer` shape.  
  - Student answers are stored by **option id**.

- **Timed tests**  
  - Use `QuestionBank` and `TimedTestQuestion`: options are stored as **separate columns** `optionA`, `optionB`, `optionC`, `optionD` and `correctAnswer` (e.g. `"A"`).  
  - The session API returns options as an object: `{ A: "...", B: "...", C: "...", D: "..." }`.  
  - The UI currently renders in fixed order `['A', 'B', 'C', 'D']`.  
  - Answers are submitted and stored as the **letter** (A/B/C/D).

So everywhere:

- **Stored data**: correct answer and student answer are **always** an option **id** (A, B, C, or D).
- **Display**: options are shown in a **fixed order** (A then B then C then D), which is why students see patterns like “everything is A or D”.

---

## 2. Why Students See “All A or D” (or Similar)

- Questions are authored with the correct answer often in the same position (e.g. A or D).  
- The app **never changes** the order of options when showing them; it always uses the order from the DB or the fixed `['A','B','C','D']` for timed tests.  
- So across many questions, the same letter appears correct often, and students (correctly) notice the pattern.

**Fix:** Change only the **order in which options are displayed** when the student is **taking** a chapter or test. Do **not** change how answers are stored or submitted.

---

## 3. Safe Approach: Shuffle Only at Display Time

### 3.1 Principles

1. **Never change the database**  
   - Do not reorder or rewrite `options`, `correctAnswer`, `optionA`–`optionD`, or any stored answers.

2. **Never change submission format**  
   - Keep sending and storing **option id** (A/B/C/D).  
   - Backend correctness logic must stay: `selectedAnswer === correctAnswer` (by id).

3. **Shuffle only when presenting options to the student**  
   - Shuffle the list (or the keys) **per question** when rendering the choices.  
   - Each choice still has the same `id` (or letter). When the user clicks “the second option”, the app still submits the **id** of that option (e.g. `"C"`), not the position.

4. **Stable across remounts and refresh**  
   - The shuffled order for a question must stay the same if the component unmounts and remounts (navigate away and back) or the page is refreshed. Otherwise the student’s selection (stored by option id, e.g. "C") would still be correct, but the options would appear in a different order and the experience would be confusing. Use a **seeded shuffle** so the order is deterministic per question per session/attempt (see §5.0).

5. **Do not shuffle on results/review screens (optional but recommended)**  
   - On “results” or “review” pages, showing options in **original** order (A, B, C, D) is simpler and matches stored data. Shuffle only on the **taking** flow (chapters, chapter quiz, untimed test, assigned test, timed test).

### 3.2 UI labels after shuffling

**Current behaviour (inconsistent)**  
- Some UIs show **position as letter**: first option is "A", second "B", etc. (e.g. `String.fromCharCode(65 + idx)`). That is effectively positional labelling; after shuffling, the first row would still be "A", the second "B", and submission still uses `option.id`.  
- Other UIs show the **stored option id** (A/B/C/D) next to each choice (e.g. `option.id` or the timed-test letter). After shuffling, you could show "C. Option text" as the first option, which is confusing.

**Rule when options are shuffled:** never show the stored letter (A/B/C/D) as the label for whatever appears first. Either drop the prefix or use a label that reflects **position** (1st, 2nd, 3rd, 4th).

| Approach | Display | Pros | Cons |
|----------|--------|------|------|
| **Remove letter prefixes** | Just "Option text" (no A/B/C/D or 1/2/3/4) | Clean, no confusion, works with any order | Less familiar for users used to "A/B/C/D" |
| **Positional labels** | "1. Option text", "2. Option text", … (or "A"/"B"/"C"/"D" where A = 1st, B = 2nd, etc.) | Familiar format; first option is always 1 or A | Need to use index for display only; still submit `option.id` |
| **Keep original letters** | "C. Option text" shown first if C is first in shuffled list | No code change to labels | **Avoid:** confusing — letter order jumps around (e.g. first option is "C") |

**Recommendation:**  
- **Preferred:** Remove letter prefixes and show only the option text, or use **positional** labels (1, 2, 3, 4 or A, B, C, D meaning 1st/2nd/3rd/4th).  
- **Do not:** Show the stored id (A/B/C/D) as the label when the list is shuffled, so the first option is never labelled "C" or "D" while the second is "A".

When you implement shuffling, audit each "taking" screen: if it currently displays `option.id` (or the timed-test letter) as the label, switch that to either (a) no prefix, or (b) a positional label derived from the loop index (e.g. `idx + 1` for "1.", "2.", … or `String.fromCharCode(65 + idx)` for A/B/C/D by position). Keep submitting and storing by `option.id` / letter in all cases.

---

## 4. Where to Implement Shuffling

Apply display-time shuffling in **every place where the student selects an answer** (not in admin or results unless you explicitly want shuffled review). In each place, also apply the label rule from §3.2: use positional labels (A/B/C/D or 1/2/3/4 by position) or no prefix; do not show the stored option id as the label when the list is shuffled.

### 4.1 Chapters (Question model — `options` array)

| Location | File | What to do |
|----------|------|------------|
| Chapter Mode (main) | `src/components/chapters/ChapterModePage.tsx` | Before rendering `question.options.map(...)`, use a shuffled copy (e.g. `shuffleOptions(question.options)`) and render that. Keep storing/checking by `option.id`. |
| Chapter Mode (section) | `src/components/chapters/ChapterModeSection.tsx` | Same: shuffle options once per question when displaying, submit by `option.id`. |
| Chapter Analytics | `src/components/chapters/ChapterAnalytics.tsx` | Same pattern if students can answer here; otherwise keep original order for analytics clarity. |
| Chapter quiz (MCQ) | `src/components/chapters/MCQQuestion.tsx` | Shuffle `question.options` before mapping in the component (or pass in pre-shuffled options from parent). |
| Chapter quiz pages | e.g. `src/app/dashboard/chapters/routes/quiz/page.tsx` (and other chapter quiz pages that use `MCQQuestion`) | If shuffle is inside `MCQQuestion`, no change; otherwise shuffle before passing options. |
| Manual chapter questions | `src/components/manual/ChapterQuestions.tsx` | Shuffle `question.options` before mapping. |

### 4.2 Untimed tests

| Location | File | What to do |
|----------|------|------------|
| Take test page | `src/app/dashboard/tests/untimed/[id]/page.tsx` | Shuffle `currentQuestion.options` before the `.map(...)` that renders options. Submit and highlight by `option.id`. |

### 4.3 Assigned tests

| Location | File | What to do |
|----------|------|------------|
| Take assigned test | `src/app/dashboard/tests/assigned/[id]/page.tsx` | Shuffle `currentQuestion.options` before the `.map(...)` that renders options. Submit by `option.id`. |

### 4.4 Timed tests

| Location | File | What to do |
|----------|------|------------|
| Timed test session | `src/app/dashboard/timed-tests/session/[id]/page.tsx` | Options come as `currentQuestion.options` = `{ A, B, C, D }`. Build an array of `{ letter, text }`, shuffle that array, then render the shuffled list. On click/select, still submit the **letter** (e.g. `option.letter`). Do not change how `answers[currentQuestion.id]` or the API expect the value (A/B/C/D). |

### 4.5 Other student-facing question UIs

- **Flagged questions** (`src/app/dashboard/flagged-questions/page.tsx`): if students can answer here, shuffle the options used for that view; otherwise keep original order for consistency with stored data.
- **Demo / showcase** components: optional; shuffle if you want the same UX as production.

### 4.6 Where NOT to shuffle (or shuffle only if you have a clear design)

- **Results pages** (e.g. `src/app/dashboard/chapters/*/results/page.tsx`, `src/app/dashboard/tests/untimed/[id]/results/page.tsx`, assigned test results, timed test review). Showing A/B/C/D in canonical order is usually clearer.
- **Admin** (question edit, MCQ builder, content sync). Always show and edit in canonical order.
- **APIs** that return questions: keep returning options in DB order; let the client shuffle for display.

---

## 5. Implementation Pattern

### 5.0 Shuffle stability: why seeded shuffle is recommended

**Problem with `useMemo(() => shuffleOptions(question.options), [question.id])`**

When the component unmounts and remounts (user navigates away and back, or the page is refreshed), `useMemo` runs again and produces a **new** random order. Correctness is still fine—we store and submit by **option id** (e.g. "C"), so the right option stays selected. But the **order** of options changes: what was "second" might now be "fourth", which is confusing and looks broken.

**Recommendation: seeded (deterministic) shuffle**

- Use a **seeded** shuffle: same inputs (question id + a session/attempt identifier) always produce the same order.
- The seed is derived **client-side** from data you already have (attempt id, session id, or a chapter-session id). No API or database change.
- Same seed → same order across remounts and refresh; different attempt/session → different order, so students still get variety.

**Will seeded shuffle cause issues in this codebase?**

- No. We never store or compare by **position**; we only use **option id** everywhere. Seeded shuffle only affects display order. Backend, APIs, and stored answers are unchanged.

**Seed strategy by context**

| Context | Seed source | Stable across |
|--------|-------------|----------------|
| **Untimed test** | `attemptId` (test attempt id) + `question.id` | Same attempt (including after refresh) |
| **Assigned test** | `attemptId` (assigned attempt id) + `question.id` | Same attempt (including after refresh) |
| **Timed test** | `session.id` (test session id) + `question.id` | Same session (including after refresh) |
| **Chapter mode / chapter quiz** | A **chapter session id**: create once when the user enters the chapter (e.g. `crypto.randomUUID()` or `Date.now()`), store in React state or `sessionStorage` keyed by `chapterId`. Use that + `question.id` as seed. | Same “visit” to the chapter; new visit gets new order |

For chapter mode, avoid seeding only with `userId + chapterId + questionId`: that would give the same order every time the user opens the chapter, which is predictable. Prefer a per-visit session id.

### 5.1 Shared utility (seeded shuffle)

Add a small utility (e.g. in `src/lib/utils.ts` or `src/lib/quizUtils.ts`). You need a **seeded PRNG** so that the same seed yields the same shuffle every time:

```ts
// Seeded PRNG (mulberry32). Same seed → same sequence of "random" numbers.
function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t ^ (t >>> 12))
    return ((t >>> 0) / 4294967296)
  }
}

// Hash a string to a number (for seed). Simple and good enough for shuffle.
function hashString(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i)
  }
  return h >>> 0
}

// Deterministic Fisher–Yates. Same (options, seed) → same order every time.
export function shuffleOptionsWithSeed<T extends { id: string }>(
  options: T[],
  seed: string
): T[] {
  const rng = mulberry32(hashString(seed))
  const out = [...options]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// For options array: seed = e.g. attemptId + question.id or sessionId + question.id
export function getShuffledOptions(
  options: { id: string; text: string }[],
  seed: string
): { id: string; text: string }[] {
  return shuffleOptionsWithSeed(options, seed)
}

// For timed tests: options are { A, B, C, D }. Return shuffled array of { letter, text }.
export function shuffleTimedOptionsWithSeed(
  options: { A: string; B: string; C: string; D: string },
  seed: string
): { letter: string; text: string }[] {
  const entries = (['A', 'B', 'C', 'D'] as const).map(letter => ({
    letter,
    text: options[letter],
  }))
  return shuffleOptionsWithSeed(entries, seed)
}
```

Use these everywhere you need a stable order; pass the appropriate seed (see table above).

### 5.2 Usage in components (options array)

- When you receive a question with `options: { id, text }[]`:
  - Compute **seed** for this context (e.g. `attemptId + question.id` for tests, `chapterSessionId + question.id` for chapter mode).
  - Shuffle with that seed: `getShuffledOptions(question.options, seed)`.
  - In React: `useMemo(() => getShuffledOptions(question.options, seed), [question.id, seed])` so the order is stable for that question and session. When the user refreshes or navigates back, the same `seed` is used (e.g. from restored attempt/session), so the order is unchanged.
- Render the shuffled array; on click still use `option.id` for `selectedAnswer` and for comparing with `correctAnswer`.

### 5.3 Usage in timed test session

- You have `session.id` and `currentQuestion.id`. Seed = `${session.id}-${currentQuestion.id}` (or similar).
- `const displayOptions = useMemo(
    () => shuffleTimedOptionsWithSeed(currentQuestion.options, `${session.id}-${currentQuestion.id}`),
    [session?.id, currentQuestion.id]
  )`
- Then `displayOptions.map(({ letter, text }) => ...)` and submit `letter` on select.
- After refresh, `session` is reloaded from the API, so the same seed is used and the order matches.

---

## 6. What NOT to Do

- **Do not** shuffle or reorder options in the database.
- **Do not** change `correctAnswer` or any stored answer to “position” (e.g. 0, 1, 2, 3). Keep everything by **option id** (A/B/C/D).
- **Do not** add a “display order” or “shuffle seed” to the API/database unless you have a strong reason; **client-derived** seed (attemptId, sessionId, chapterSessionId + questionId) is enough and keeps the system simple.
- **Do not** shuffle on every re-render; use a seeded shuffle so order is stable per question for the session/attempt, including after remount or refresh. So the student’s choice is not lost and the UX is consistent.

---

## 7. Quick Testing Checklist

After implementing shuffling:

- [ ] **Chapter mode**: Options appear in different orders per question; submitting an answer still marks correct/incorrect correctly; correct answer highlight shows the right option. After navigating away and back (or refresh), option order for each question is unchanged.
- [ ] **Chapter quiz**: Same as above; score and progress are correct; order stable across remount/refresh (use chapter session id in seed).
- [ ] **Untimed test**: Options shuffled; submitting and completing the test gives correct score; results page shows correct/incorrect and correct answer by letter. After refresh mid-test, option order per question is unchanged (seed = attemptId + questionId).
- [ ] **Assigned test**: Same as untimed; timed assigned tests still auto-submit and scores are correct; order stable after refresh.
- [ ] **Timed test**: Options shuffled per question; submitting A/B/C/D is still recorded correctly; results/review show the right correct answer and student choice. After refresh mid-session, option order per question is unchanged (seed = sessionId + questionId).
- [ ] **Results/review**: No regression; correct answer and student answer still match the options shown (canonical A/B/C/D order is fine).
- [ ] **Admin / question editing**: Options still appear and edit in A/B/C/D order; no change to sync or question bank logic.

---

## 8. Summary

- **Chapters** use `Question.options` (array of `{ id, text }`) and `correctAnswer` (id).  
- **Untimed and assigned tests** use the same model; answers stored by option id.  
- **Timed tests** use `optionA`–`optionD` and `correctAnswer` (letter); API returns `{ A, B, C, D }`; submit and store by letter.  
- Students see “all A or D” because we never randomize **display** order.  
- **Safely fix it**: add a **seeded** shuffle utility (§5.0–5.1), then in **every** “taking” UI (chapter mode, chapter section, chapter quiz/MCQ, untimed, assigned, timed), shuffle options **only for display** using a seed derived from attempt/session id + question id so order is stable across remount and refresh. Keep submitting and storing by **option id**. No DB or API change; no changes needed on results or admin beyond verifying they still work.

This gives you a single, consistent approach to jumbling answers across chapters, chapter quizzes, untimed tests, assigned tests, and timed tests without breaking correctness or existing data.

---

## 9. Code reference — where options are rendered

Quick grep targets for implementing shuffle (all are “taking” flows unless noted):

- `ChapterModePage.tsx` — `question.options.map` (chapter mode)
- `ChapterModeSection.tsx` — `question.options.map` (chapter mode section)
- `ChapterAnalytics.tsx` — `fullQuestion.options.map` (analytics, optional shuffle)
- `MCQQuestion.tsx` — `question.options.map` (chapter quiz)
- `src/app/dashboard/tests/untimed/[id]/page.tsx` — `currentQuestion.options.map`
- `src/app/dashboard/tests/assigned/[id]/page.tsx` — `currentQuestion.options.map`
- `src/app/dashboard/timed-tests/session/[id]/page.tsx` — `['A', 'B', 'C', 'D'].map` (replace with shuffled array of `{ letter, text }`)
- `src/components/manual/ChapterQuestions.tsx` — `question.options.map`
- `src/app/dashboard/flagged-questions/page.tsx` — `options.map` (optional)

Results pages and admin use `question.options.map` or `options.map` for **display only** (no student selection); no shuffle required there.
