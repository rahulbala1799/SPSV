# Chapter score and progress – how it works

This doc explains how the **percentage (e.g. 86%)** shown for a chapter is calculated and why it can differ from “all correct in this run”.

---

## Is the percentage for “this run” or for all time?

The percentage you see for a chapter is **not** the score for the last practice run (e.g. “5 questions”).  
It is the **all-time score for that chapter**: of every question in the chapter you’ve ever answered, we use your **latest** answer per question and then compute:

- **Score** = (number of those latest answers that are correct) ÷ (number of distinct questions you’ve answered) × 100  
- So it’s an **aggregate across all attempts** in that chapter, not just the last session.

So: **it’s by design (aggregate), not a bug.**

---

## Example: why you might see 86% after getting 5/5

1. The chapter has **7 questions** in total.
2. Earlier you answered **7 questions** (e.g. “All questions” or two runs): you got **6 correct** and **1 wrong**.
3. Later you do a **“5 questions”** practice and get **all 5 correct** (5/5).
4. The system still has **7 unique questions** ever attempted. For each of those 7 it keeps only your **latest** answer. So you still have **6 correct** and **1 wrong** in that “latest per question” set.
5. **Score** = 6 ÷ 7 ≈ **86%**.

So even though “this run” was 100%, the **chapter score** stays 86% because it includes the earlier wrong answer.

---

## Where this is implemented

- **Backend:** `src/app/api/chapters/[chapterId]/questions/[questionId]/answer/route.ts`  
  - On each answer we:
    - Load **all** your answers for that chapter.
    - For each question, keep only the **latest** answer (by `answeredAt`).
    - Set:
      - `correctAnswers` = count of those latest answers that are correct.
      - `totalQuestions` = number of **unique questions** you’ve ever answered in that chapter (not the chapter’s total question count).
      - `score` = `(correctAnswers / totalQuestions) * 100`.
- **Stored in:** `ChapterProgress.score`, `ChapterProgress.correctAnswers`, `ChapterProgress.totalQuestions`.
- **Shown in:** Chapter list, chapter detail, and results pages use this same progress (so they all show the same aggregate percentage).

---

## Summary

| What you might expect | What the app does |
|-----------------------|-------------------|
| “Score for this 5-question run” | **No** – we don’t show a per-session score for the “5 questions” run. |
| “My overall accuracy in this chapter (latest answer per question)” | **Yes** – the percentage is this aggregate. |

So if you “select 5 questions and answer all correct” but see something like 86%, it’s because the **chapter** score is the aggregate of all questions you’ve ever attempted in that chapter (using your latest answer per question), not the score for the last 5 only.

---

## What the app shows now (results page)

If you want to show **both**:

- **Session score:** “This run: 5/5 (100%)”
- **Chapter score:** “Overall in this chapter: 86%”

then the app would need to:
- Either compute the session score on the results page from the questions and answers for the current run only, or
- Have the API return a session score when you finish a run (e.g. in the redirect or in the progress payload for that request).

The results page now shows **This run** (when you come from the quiz) and **Chapter total** (aggregate). If you open results without session params, only Chapter total is shown.
