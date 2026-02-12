# MCQ Setter UI – Flow and Behaviour

This document describes the **MCQ setter (create test)** UI flow: list-first selection, review of selected questions, then optional addition of more questions from the **overall question bank** (excluding already selected) before setting the test.

---

## Key idea

The admin can:

1. **Select hard questions from the student detail page** (e.g. via “Generate MCQ from selected”) and use those as the starting set for the test.
2. **Add any other questions they want** from the **overall question bank** (the full app-wide bank, e.g. ~960 questions across all chapters) before finally setting/creating the test.

So the test is built in two ways: **start from a list** (e.g. student hard questions) and **then add any question from the full question bank** so the admin has full control over the final set before creating the test.

---

## Table of Contents

1. [Overview](#overview)
2. [The overall question bank](#the-overall-question-bank)
3. [User Flow Summary](#user-flow-summary)
4. [Step-by-Step UI Specification](#step-by-step-ui-specification)
5. [Data and State](#data-and-state)
6. [Edge Cases and Rules](#edge-cases-and-rules)
7. [File and API Reference](#file-and-api-reference)

---

## Overview

The MCQ setter is used by admins to create an MCQ test by:

1. **Choosing an initial set of questions** from a list (e.g. student hard questions, or a filtered list).
2. **Reviewing that set** on a dedicated “Selected questions” screen.
3. **Optionally adding more questions** from the full question bank (excluding the ones already selected).
4. Then setting test details (title, timing, etc.), assigning students, and creating the test.

The important behaviour: **first show only the list of questions** so the admin picks N (e.g. 6); **then** show those N on a **next page**; **then** on the **next step** the admin can add more from the **overall question bank**, with the N already selected **excluded** from the bank list.

---

## The overall question bank

The app has an **overall question bank** (e.g. ~960 questions) that contains all MCQ questions across all chapters. This is the single source of questions for tests.

- **Student detail → Hard questions:** The admin can select some of a student’s hard questions and start a test from that list. Those are a *subset* of the overall bank.
- **Before setting the test:** The admin must be able to **add any question they want** from this **full question bank** (960 questions) to the test. So the flow is: start from hard questions (or any initial list) → review selected → **add more from the overall question bank** (any question from the 960) → then set title, assign students, and create the test.
- **No duplicates:** When showing “add more from question bank”, the UI must exclude questions already in the current selection so the admin never adds the same question twice.

This way the admin can combine **targeted questions** (e.g. a student’s hard questions) with **any other questions from the full bank** before creating the test.

---

## User Flow Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP A: Question list (source list)                                         │
│  • Show ONLY the list of questions (e.g. preset hard questions, or bank).   │
│  • Admin selects N questions (e.g. 6) via checkboxes.                       │
│  • "Next" → go to Step B.                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP B: Selected questions (review)                                        │
│  • Show the N selected questions only (no other questions on this screen).  │
│  • List each with question text, chapter, option to remove if needed.        │
│  • "Next" → go to Step C.                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP C: Add more from question bank                                         │
│  • Show full question bank (by chapter) EXCEPT the N already selected.      │
│  • Admin can add any number of extra questions from the bank.                 │
│  • Total test questions = N (from Step A/B) + any added here.                 │
│  • "Next" → go to test details (title, timing, etc.) and student assignment. │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP D: Test details & students                                             │
│  • Title, description, timed/untimed, due date.                               │
│  • Assign students.                                                          │
│  • Review and create test.                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step UI Specification

### Step A: Question list (initial selection)

**Purpose:** Admin sees **only** a list of questions and chooses how many to put in the test (e.g. 6).

**Content:**
- **Single focus:** One list of questions. No test title, no student list, no question bank mix on this screen.
- **Source of the list:**
  - **From student hard questions:** If the admin came from “Generate MCQ from selected” on a student profile, the list is the hard-questions set (or the subset they had selected). Loaded via sessionStorage preset.
  - **From scratch:** If the admin opened “Create test” normally, the list can be the full question bank grouped by chapter, or a default “all questions” list.
- **UI elements:**
  - Header: e.g. “Select questions for your test” or “Choose questions (Step 1 of 4)”.
  - Optional: short hint, e.g. “Select the questions you want to include. You can add more from the question bank in the next step.”
  - **List:** Each row = one question (question text, chapter/topic, optional question number). Checkbox to select/deselect.
  - **Actions:** “Select all on page” (if paginated), “Clear selection”.
  - **Counter:** e.g. “3 selected” (live count).
  - **Primary button:** “Next: Review selected questions” (enabled when at least one question is selected).

**Rules:**
- Admin must select at least one question to proceed.
- No need to set “number of questions” on this screen; the count is determined by the selection.

**Next:** Navigate to Step B (Selected questions review).

---

### Step B: Selected questions (review)

**Purpose:** Show **only** the N questions the admin just selected, so they can confirm before adding more from the bank.

**Content:**
- **Single focus:** Only the N selected questions. No other list, no question bank.
- **Header:** e.g. “Selected questions (6)” or “Review your selection”.
- **List:** One card/row per selected question:
  - Question text (full or truncated with “Show more”).
  - Chapter / category.
  - Optional: “Remove” to drop it from the selection (updates state and count).
- **Count:** e.g. “6 questions selected.”
- **Primary button:** “Next: Add more from question bank” (or “Next: Test details” if you prefer to put “add more” as optional from here).

**Rules:**
- If admin removes all questions, show a message and disable “Next” until at least one remains (or offer “Back” to Step A).
- Order can be preserved as selected (or show in chapter order); reordering can be a later enhancement.

**Next:** Navigate to Step C (Add more from question bank).

---

### Step C: Add more from question bank

**Purpose:** Let the admin add **extra** questions from the **overall question bank** (the full app-wide bank, e.g. ~960 questions across all chapters), without duplicating the ones already selected. The admin can add any question they want from this bank before setting the test.

**Content:**
- **Header:** e.g. “Add more questions (optional)” or “Question bank – add to your test”.
- **Source:** The **overall question bank** (all questions in the app, e.g. 960). The admin can browse by chapter and add any question they want.
- **Important:** The list must **exclude** all questions that are already in the current selection (the N from Step A/B). So if the test currently has 6 selected, the bank shows every other question (e.g. 954) **except** those 6.
- **UI:** Same pattern as a normal question bank:
  - Group by chapter (expand/collapse).
  - Search/filter by text or chapter.
  - Each question has a checkbox. Checking it **adds** that question to the test (no duplicates; already-selected IDs are not shown).
- **Counter:** e.g. “Test currently has 6 questions. Select any more below.”
- **Primary button:** “Next: Test details & assign students” (or “Next” to Step D).

**Rules:**
- Already selected question IDs must not appear in the list. Filter them out when loading or rendering the bank.
- Admin can add 0 or more. Total test size = (selection from Step A/B) + (questions added here).
- Optional: show a small “Currently in test: 6 questions” summary at the top so the admin always sees the running total.

**Next:** Navigate to Step D (Test details, student assignment, review, create).

---

### Step D: Test details and student assignment

**Purpose:** Set title, description, timed/untimed, due date; assign students; review and create.

**Content:**
- **Test details:** Title *, description, number of questions (read-only or editable to match current total), timed yes/no, time limit if timed, due date.
- **Student assignment:** List of students; checkboxes to assign; optional “Select all”.
- **Review:** Summary of question count, assigned students, test settings.
- **Actions:** “Create test”, “Back” to Step C.

**Rules:**
- Question count shown here must equal the length of `selectedQuestions` (initial selection + any added in Step C).
- Validation: title required; at least one student; question count &gt; 0.

---

## Data and State

**State to carry through the flow:**

| State               | Set in   | Used in        | Notes                                      |
|---------------------|----------|----------------|--------------------------------------------|
| `initialQuestionIds`| Step A   | B, C, D        | IDs selected in Step A (the “first list”). |
| `selectedQuestions`| A → C → D| All later steps| Full set: initial + any added in Step C.   |
| `questionCount`    | Derived  | Step D         | `selectedQuestions.length`.                |

**Suggested flow:**
- **Step A:** When admin clicks “Next”, set `initialQuestionIds` = currently selected IDs. This becomes the “locked” set for the review step and the exclusion set for the bank.
- **Step B:** Display only questions whose IDs are in `initialQuestionIds`. Allow “Remove” by dropping an ID from `initialQuestionIds` (and from `selectedQuestions`). At “Next”, keep `selectedQuestions = initialQuestionIds` (possibly updated if any were removed).
- **Step C:** Load question bank; filter out any question whose ID is in `selectedQuestions`. When admin checks a question, add its ID to `selectedQuestions`. So `selectedQuestions` = initial set + bank additions. “Next” goes to D.
- **Step D:** Use `selectedQuestions.length` as question count; pass `selectedQuestions` as `questionIds` to the create-test API.

**Preset (e.g. from student hard questions):**
- When opening create with sessionStorage preset, treat those IDs as the **initial list** for Step A. So Step A shows that list; admin can trim or add from that list (or you can treat preset as pre-selected and land on Step B). Either way, the “list first, then review, then add from bank” flow still holds.

---

## Edge Cases and Rules

1. **Step A – no selection:** Disable “Next” until at least one question is selected. Optional: show “Select at least one question to continue.”
2. **Step B – remove all:** If the admin removes every question, either disable “Next” and show “Add at least one question” or provide “Back to list” to Step A.
3. **Step C – exclusions:** The question bank must never show a question that is already in `selectedQuestions`. Duplicate IDs in the test are not allowed.
4. **Question count cap:** If there is a max (e.g. 100), enforce it when adding in Step C and in API validation.
5. **Back navigation:** “Back” from Step B goes to Step A; “Back” from Step C goes to Step B; “Back” from Step D goes to Step C. State is preserved so the admin doesn’t lose their selection.
6. **Preset + “list first”:** If the admin arrives with a preset (e.g. 6 hard questions), you can either show Step A with those 6 pre-checked and the list = those 6 only, or show Step A with the full hard-questions list and 6 pre-checked. Either way, Step B shows “the 6 selected”, and Step C shows the bank minus those 6.

---

## File and API Reference

| Item | Location / endpoint | Notes |
|------|---------------------|--------|
| MCQ create page | `src/app/admin/mcq-builder/create/page.tsx` | Implement or refactor steps A → D here. |
| Question bank API | `GET /api/admin/mcq-builder/questions` | Returns chapters and questions; filter out `selectedQuestions` for Step C. |
| Create test API | `POST /api/admin/mcq-builder/tests` | Body: `questionIds` (array), `studentIds`, title, description, etc. |
| Preset (hard questions) | sessionStorage: `mcqCreatePresetQuestionIds`, `mcqCreatePresetStudentId` | Used when coming from student profile “Generate MCQ from selected”. |

---

## Summary

- **Step A:** MCQ setter shows **only** the list of questions (preset or bank). Admin selects N (e.g. 6). Next.
- **Step B:** Next page shows **only** the N selected questions for review; admin can remove if needed. Next.
- **Step C:** Admin can add more questions from the **question bank**, with the N already selected **excluded** from the list. Next.
- **Step D:** Test details, student assignment, review, create.

This keeps the flow list-first, gives a clear “selected set” review, and then allows controlled addition from the full bank without duplicates.
