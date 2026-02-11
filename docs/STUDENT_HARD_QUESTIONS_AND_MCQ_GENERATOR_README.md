# Student Hard Questions – Full List & MCQ Generator

This document describes the **processes**, **data flow**, **current limitation** (only 5 hard questions shown), and the **implementation plan** so admins see the **full list** of a student’s hard questions and can **generate an MCQ test** from them using the existing MCQ builder.

---

## Table of Contents

1. [Current Behaviour (Limitation)](#current-behaviour-limitation)
2. [Processes Involved](#processes-involved)
3. [End-to-End Flow](#end-to-end-flow)
4. [Database & Migrations](#database--migrations)
5. [Existing MCQ Generator](#existing-mcq-generator)
6. [Required Changes (Implementation Plan)](#required-changes-implementation-plan)
7. [UX Considerations (50+ Hard Questions)](#ux-considerations-50-hard-questions)
8. [Passing Data to MCQ Builder: Query Params vs sessionStorage](#passing-data-to-mcq-builder-query-params-vs-sessionstorage)
9. [API Contract for Full Hard Questions](#api-contract-for-full-hard-questions)
10. [MCQ Generator Integration](#mcq-generator-integration)

---

## Current Behaviour (Limitation)

- **Where:** Admin → Students → [Student] → Profile → **Question Analytics** section.
- **What:** “Hard Questions” are those where the student had **3+ attempts** or **never got it correct**.
- **Issue:** The UI shows only **5** hard questions. The **summary count** (`summary.hardCount`) is correct (all hard questions), but the list is capped because the API returns `difficulty.hard.slice(0, 5)` and the difficulty payload does **not** include `questionId`, which is needed for the MCQ generator.

**Requirement:** All hard questions must be visible to the admin (no cap at 5). The full list will be shown in a paginated, compact form so it scales even when a student has hundreds of hard questions.

**Relevant code:**

- **API:** `src/app/api/admin/students/[id]/questions/route.ts`  
  - Builds `hardQuestions` (full list), then returns `hard: hardQuestions.slice(0, 5).map(...)` and the mapped object does not include `questionId`.
- **UI:** `src/components/admin/student-profile/QuestionAnalyticsSection.tsx`  
  - Renders `difficulty.hard` from the API (so only 5 items).

---

## Processes Involved

### 1. Data sources for “questions attempted by student”

All of these feed into one aggregated view:

| Source | Table(s) | How it’s used |
|--------|----------|----------------|
| Chapter answers | `Answer` | One row per (student, question) attempt; includes `questionId`, `isCorrect`, `answeredAt`. |
| Untimed MCQ tests | `TestQuestion` (via `UntimedTestAttempt`) | Student’s answers on admin-created untimed tests; `questionId`, `isCorrect`, `answeredAt`. |
| Timed tests | `TimedTestAnswer` (via `TestSession`) | Timed test answers; linked by `userId` and `questionId` (or question bank snapshot). |

### 2. Aggregation process (API)

- **Input:** All records from the three sources above for the given student.
- **Step 1 – Per-question map:** For each unique `questionId`, keep:
  - `questionId`, `questionText`, `chapter`, `category`
  - `attempts`, `correctAttempts`, `lastAttempted`, `firstTryCorrect`
- **Step 2 – Classification:**
  - **Easy:** `firstTryCorrect && attempts === 1`
  - **Medium:** `attempts >= 2 && attempts <= 3 && correctAttempts > 0`
  - **Hard:** `attempts > 3 || (attempts > 0 && correctAttempts === 0)`
- **Step 3 – Response:**
  - `summary`: counts (e.g. `hardCount` = total number of hard questions).
  - `mostAttempted`: top 10 by attempts.
  - `difficulty`: `easy`, `medium`, `hard` — currently each is **sliced to 5** and **without `questionId`**.

### 3. Display process (UI)

- **Question Analytics** calls `GET /api/admin/students/:id/questions`.
- It shows summary cards, “Most Attempted”, and three difficulty panels (Easy / Medium / Hard).
- Hard panel only shows up to 5 items and cannot be used to drive the MCQ generator because `questionId` is missing.

---

## End-to-End Flow

```
Admin opens Student Profile
        ↓
Profile page loads → QuestionAnalyticsSection mounts
        ↓
GET /api/admin/students/[studentId]/questions
        ↓
API: load Answer, TestQuestion, TimedTestAnswer for student
        ↓
API: build questionMap (per questionId), then easy/medium/hard lists
        ↓
API: return summary + mostAttempted + difficulty (easy/medium/hard each .slice(0,5), no questionId)
        ↓
UI: render summary + lists (Hard list = only 5 items, no “Generate MCQ” possible)
```

**Desired addition:**

- API returns **full** hard list **with** `questionId` (all hard questions visible to admin, not just 5).
- UI shows **full** hard list in a **paginated** view (admin chooses page size, no answers shown). Admin **selects** which questions to include, then **“Generate MCQ from selected”** writes selected IDs and student to sessionStorage and opens the MCQ builder so the create page can pre-load them.

---

## Database & Migrations

- **No new migrations are required** for “full hard questions” or “MCQ from hard questions”.
- All needed data already exists:
  - **Question analytics:** `Answer`, `TestQuestion`, `TimedTestAnswer`, `Question`, `Chapter`, etc.
  - **MCQ tests:** `AssignedMCQTest`, `AssignedTestQuestion`, `AssignedTestStudent`, `Question`.
- The change is **API response shape** (full list + `questionId`) and **UI + MCQ builder integration** (new/updated routes or query params and pre-selection logic).

---

## Existing MCQ Generator

### Location

- **UI:** `/admin/mcq-builder` (list) and `/admin/mcq-builder/create` (create flow).
- **Create page:** `src/app/admin/mcq-builder/create/page.tsx`.
- **APIs:**
  - `GET /api/admin/mcq-builder/questions` – chapters and questions for selection.
  - `POST /api/admin/mcq-builder/tests` – create test with `questionIds`, `studentIds`, title, options, etc.

### How tests are created

1. Admin sets title, description, question count, timed/untimed, due date.
2. **Step 2:** Select questions (from chapters). Selected IDs stored in `selectedQuestions` (array of `questionId`).
3. **Step 3:** Select students. Stored in `selectedStudents` (array of `studentId`).
4. **Step 4:** Review and submit.
5. **POST** body to `POST /api/admin/mcq-builder/tests`:
   - `title`, `description`, `questionCount`, `isTimed`, `timeLimitMinutes`, `dueDate`, `status`
   - **`questionIds`** – array of question IDs (must equal `questionCount`)
   - **`studentIds`** – array of student IDs (at least one)

So the MCQ generator **already supports** creating a test from an arbitrary set of `questionIds`; we only need to **pre-load** that set from the student’s hard questions and, optionally, pre-select the student.

---

## Required Changes (Implementation Plan)

### 1. API: Full hard questions list + questionId

**File:** `src/app/api/admin/students/[id]/questions/route.ts`

- **Do not** slice hard (or optionally easy/medium) to 5.
- Include **`questionId`** in each item of `difficulty.easy`, `difficulty.medium`, `difficulty.hard`.
- Return the **full** list for at least `difficulty.hard` so the admin sees all hard questions.

Example shape for each difficulty array:

```ts
{
  questionId: string,
  questionText: string,
  chapter?: string,
  category?: string,
  attempts: number
}
```

- Consider adding an optional query param, e.g. `?difficulty=hard`, to return only hard questions (and optionally only their IDs) for the “Generate MCQ” flow, if you want a lighter endpoint.

### 2. UI: Show full hard list (paginated) + selection + “Generate MCQ”

**File:** `src/components/admin/student-profile/QuestionAnalyticsSection.tsx`

- Use the **full** `difficulty.hard` array (no client-side slice). **All hard questions must be visible to the admin**, not just 5.
- Render the hard list in a **paginated** way (see [UX Considerations](#ux-considerations-50-hard-questions)): admin chooses page size (e.g. 10, 25, 50), navigates next/previous page. Do **not** show question answers/options—show only question text (and chapter/metadata) so the list stays compact even with 300+ questions.
- Let the admin **select** which questions to include in the MCQ (checkboxes per row). Actions: “Select all on page”, “Generate MCQ from selected” (and optionally “Select all hard” for smaller lists).
- **Answer on expand:** When the admin clicks a question to expand it, **fetch answer details on demand** from a question-detail API (do not ship options/correctAnswer/explanation in the main analytics response). Show the loaded answer (options, correct answer, explanation) below the row; collapse on click again or “Hide”.
- Add **“Generate MCQ from selected”** (or “Create practice test from selected”): disabled when no questions selected or when `difficulty.hard.length === 0`. On click: pass **selected** question IDs and student ID to the MCQ create page via **sessionStorage** (see [Passing data to MCQ builder](#passing-data-to-mcq-builder-query-params-vs-sessionstorage)).
- MCQ create page reads from sessionStorage and pre-fills `selectedQuestions`, `selectedStudents`, and `questionCount`.

### 3. MCQ builder: Pre-load from sessionStorage

- Before navigating to `/admin/mcq-builder/create`, write to sessionStorage: selected `questionIds`, `studentId`, and optionally `questionCount`.
- In `create/page.tsx`: on mount, read from sessionStorage; if present, set `selectedQuestions`, `selectedStudents`, and `questionCount`, then clear or leave the keys for a one-time load.
- Do **not** use query params for question IDs when the list can be large (see [Query params vs sessionStorage](#passing-data-to-mcq-builder-query-params-vs-sessionstorage)).

### 4. Validation and edge cases

- If the number of hard questions is 0: button disabled; no API call.
- If the number of hard questions is large (e.g. > 100): either allow “use all” (and set `questionCount` accordingly) or add a cap and let the admin remove some in the builder.
- Ensure every `questionId` returned by the questions API exists in the DB so that when the admin creates the test, `POST /api/admin/mcq-builder/tests` validation (all questionIds exist) still passes.

---

## UX Considerations (50+ Hard Questions)

For students with many hard questions (e.g. 50+, or 300+), the Hard Questions section should stay usable and lightweight.

1. **Show all hard questions, but paginated**
   - **All** hard questions must be visible to the admin (no cap at 5). Use **pagination** so the list doesn’t overwhelm the page.
   - **Page size:** Let the admin choose how many questions to see per page (e.g. 10, 25, 50). Store preference in local state or localStorage.
   - **Navigation:** Previous / Next (and optionally “Page 1 of N” or jump to page) so the admin can move through the full list.

2. **Keep the list compact by default – answers on click**
   - By default show only **question text** (optionally truncated with “Show more”), **chapter** (and category if useful). Do **not** show options A/B/C/D or correct answer in the row itself, so the list stays short and manageable even with 300 questions.
   - **On click:** When the admin clicks a question row (or a “Show answer” control), load and show the **answer below** that row: options A/B/C/D, the correct answer (and optionally explanation if available). This keeps the list compact while letting the admin inspect any question on demand. Clicking again (or “Hide”) can collapse the answer.
   - **Fetch on demand when user expands a question:** Do not embed full answer data (options, correctAnswer, explanation) in the main analytics response. When the user expands a question, the UI should fetch that question’s details from a question-detail API (e.g. `GET /api/admin/questions/[questionId]` or an existing equivalent). That way the list payload stays small and answer data is loaded only for the questions the admin actually opens.

3. **Let the admin choose which questions go into the MCQ**
   - **Selection:** Each row has a checkbox. Admin can select a subset of hard questions (e.g. 20 out of 200) to generate the MCQ.
   - **Actions:** “Select all on this page”, “Clear selection”, and “Generate MCQ from selected”. Optionally “Select all” for students with fewer hard questions.
   - **Generate button:** “Generate MCQ from selected” is enabled only when at least one question is selected. The MCQ is created from the **selected** question IDs only, not the entire hard list (unless the admin selected all).

This way, admins can browse the full list, control how many items they see per page, and build an MCQ from a chosen subset instead of being forced to use all hard questions at once.

---

## Passing Data to MCQ Builder: Query Params vs sessionStorage

The MCQ create page needs: **selected question IDs** (and optionally **student ID**). Two options:

| Approach | Pros | Cons |
|----------|------|------|
| **Query params** | Shareable URL, no client storage. | URL length limits (~2k–8k chars depending on browser/server). Each CUID is ~25 chars; 500 IDs → ~12.5k chars → **URL too long**. Not suitable for large lists. |
| **sessionStorage** | No size limit in practice for hundreds of IDs (~25KB for 500 IDs). Same tab only, which is correct for “navigate from profile → create test”. | Not shareable via URL; data is lost when tab closes. |

**Recommendation: use sessionStorage.**

- A student can have **500+** hard questions. Even if the admin selects 100, passing them in the URL is fragile and can hit length limits. sessionStorage avoids that and is a better fit for “admin selects questions here, then goes to create page in the same session”.
- **Flow:** On “Generate MCQ from selected”, write to sessionStorage (e.g. keys like `mcqCreatePresetQuestionIds`, `mcqCreatePresetStudentId`, `mcqCreatePresetQuestionCount`), then navigate to `/admin/mcq-builder/create`. The create page reads these on mount, pre-fills the form, and can clear the keys after reading so the preset is applied only once.
- **Optional fallback:** For small selections (e.g. under 20 IDs), you could still support query params for shareability, but the primary path for “from student hard questions” should be sessionStorage so it works for large lists.

---

## API Contract for Full Hard Questions

**Endpoint:** `GET /api/admin/students/:id/questions` (unchanged).

**Suggested response addition / change:**

- `difficulty.hard` (and optionally `difficulty.easy`, `difficulty.medium`):
  - Return **all** items (no `.slice(0, 5)`).
  - Each item must include **`questionId`** so the client can pass it to the MCQ create page and then to `POST /api/admin/mcq-builder/tests`.

Existing fields (`questionText`, `chapter`, `category`, `attempts`) remain useful for display and for any future filtering in the UI.

---

## MCQ Generator Integration (Summary)

| Step | Action |
|------|--------|
| 1 | Admin is on Student Profile → Question Analytics. |
| 2 | API returns **full** `difficulty.hard` with `questionId` for each (no slice at 5). |
| 3 | UI shows **all** hard questions in a **paginated** list (page size chosen by admin; no answers/options, only question text + chapter). |
| 4 | Admin **selects** which questions to include (checkboxes; “Select all on page” / “Generate MCQ from selected”). |
| 5 | Admin clicks “Generate MCQ from selected” → write selected `questionIds` and `studentId` to **sessionStorage**, then navigate to `/admin/mcq-builder/create`. |
| 6 | Create page reads from sessionStorage, pre-fills `selectedQuestions`, `selectedStudents`, and `questionCount`. |
| 7 | Admin can adjust title, description, due date, etc., then submit. |
| 8 | Existing `POST /api/admin/mcq-builder/tests` creates the test with the selected questions and assigned student(s). |

No new tables or migrations; only API response shape, Question Analytics UI (full list, pagination, selection, no answers), and MCQ create page sessionStorage pre-load logic need to be implemented.

---

## File Reference

| Purpose | File |
|--------|------|
| Admin student question analytics API | `src/app/api/admin/students/[id]/questions/route.ts` |
| Question Analytics UI (student profile) | `src/components/admin/student-profile/QuestionAnalyticsSection.tsx` |
| Question detail (fetch on expand) | Existing question-by-id API or e.g. `src/app/api/admin/questions/[questionId]/route.ts` – used when admin expands a hard question to load options, correctAnswer, explanation |
| MCQ create page (pre-load questionIds/studentId) | `src/app/admin/mcq-builder/create/page.tsx` |
| Create test API (unchanged) | `src/app/api/admin/mcq-builder/tests/route.ts` (POST) |
| Questions for MCQ builder | `src/app/api/admin/mcq-builder/questions/route.ts` |

This README gives a single place to understand the processes, flow, and required changes for “full list of hard questions” and “MCQ generator from this section” without modifying the existing MCQ creation API or schema.
