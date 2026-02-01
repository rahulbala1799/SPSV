# Chapter & Question Addition & Sync Workflow

## Overview

This document explains how chapters and questions are added, edited, and automatically synced to the QuestionBank and student sections.

---

## 🔄 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN ACTIONS                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │  1. Create/Edit Chapter             │
        │     - Title, Description, Category   │
        │     - isActive: false (default)     │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │  2. Add Questions to Chapter         │
        │     - Question Text, Options        │
        │     - Correct Answer, Explanation    │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │  3. Publish Chapter                │
        │     - Set isActive: true            │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │  4. AUTO-SYNC TRIGGERED             │
        │     - All questions → QuestionBank  │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │  5. STUDENT ACCESS                  │
        │     - Chapter visible in dashboard  │
        │     - Questions in timed tests      │
        └─────────────────────────────────────┘
```

---

## 📝 Step-by-Step Process

### **1. Creating a New Chapter**

**Location**: `/admin/content`

**Process**:
1. Admin clicks "Add Chapter" button
2. Fills in form:
   - Title (required)
   - Description (optional)
   - Chapter Number (required)
   - Category: `INDUSTRY_KNOWLEDGE` or `AREA_KNOWLEDGE`
   - Type: `MCQ` (default)
   - Duration: minutes (default: 30)
   - **isActive: `false`** (default - chapter is hidden from students)

**API Call**: `POST /api/admin/content/chapters`

**What Happens**:
```typescript
// src/app/api/admin/content/chapters/route.ts
const chapter = await prisma.chapter.create({
  data: {
    title,
    description,
    chapterNumber,
    type: 'MCQ',
    category,
    duration: 30,
    isActive: false  // ← Hidden from students initially
  }
})
```

**Result**: 
- ✅ Chapter created in database
- ❌ **NOT visible to students** (isActive = false)
- ❌ **NOT synced to QuestionBank** (no questions yet)

---

### **2. Adding Questions to a Chapter**

**Location**: `/admin/content` → Expand chapter → "Add Question"

**Process**:
1. Admin expands the chapter
2. Clicks "Add Question"
3. Fills in:
   - Question Text
   - 4 Options (A, B, C, D)
   - Correct Answer (radio button)
   - Explanation (optional)
   - Difficulty: Easy/Medium/Hard
   - Points (default: 10)

**API Call**: `POST /api/admin/content/questions`

**What Happens**:
```typescript
// src/app/api/admin/content/questions/route.ts

// 1. Create question in database
const question = await prisma.question.create({
  data: {
    chapterId,
    questionText,
    options: [{ id: 'A', text: '...' }, ...],
    correctAnswer: 'A',
    explanation,
    difficulty: 'MEDIUM',
    points: 10,
    category: chapter.category
  }
})

// 2. AUTO-SYNC if chapter is active
if (chapter.isActive) {
  await syncSingleQuestion(question.id)  // ← Instant sync!
}
```

**Sync Logic** (`syncSingleQuestion`):
```typescript
// src/lib/questionBankSyncFast.ts

// 1. Get question with chapter info
const question = await prisma.question.findUnique({
  where: { id: questionId },
  include: { chapter: true }
})

// 2. Skip if chapter not active
if (!question.chapter.isActive) {
  return { skipped: true }
}

// 3. Map category
// INDUSTRY_KNOWLEDGE → INDUSTRY
// AREA_KNOWLEDGE → AREA_KNOWLEDGE

// 4. Check if exists in QuestionBank (by sourceQuestionId)
const existing = await prisma.questionBank.findFirst({
  where: { sourceQuestionId: questionId }
})

// 5. Create or Update
if (existing) {
  await prisma.questionBank.update({ ... })  // Update
} else {
  await prisma.questionBank.create({
    data: {
      sourceQuestionId: questionId,  // ← Links back to original
      questionText,
      optionA, optionB, optionC, optionD,
      correctAnswer,
      explanation,
      category: 'INDUSTRY' | 'AREA_KNOWLEDGE',
      isActive: true
    }
  })
}
```

**Result**:
- ✅ Question saved to `Question` table
- ✅ **If chapter is active**: Question automatically synced to `QuestionBank`
- ✅ **If chapter is inactive**: Question saved but NOT in QuestionBank yet

---

### **3. Publishing a Chapter (Making it Visible to Students)**

**Location**: `/admin/content` → Click "Show to Students" button

**Process**:
1. Admin clicks "Show to Students" (or toggles visibility)
2. This sets `isActive: true`

**API Call**: `PATCH /api/admin/content/chapters/[chapterId]`

**What Happens**:
```typescript
// src/app/api/admin/content/chapters/[chapterId]/route.ts

const wasActive = chapter.isActive  // false
const willBeActive = body.isActive  // true

// Update chapter
const updatedChapter = await prisma.chapter.update({
  where: { id: chapterId },
  data: { isActive: true }
})

// AUTO-SYNC all questions in chapter
if (willBeActive && !wasActive) {
  // Chapter just became active - sync ALL questions
  await syncChapterQuestions(chapterId)
}
```

**Sync Logic** (`syncChapterQuestions`):
```typescript
// src/lib/questionBankSyncFast.ts

// 1. Get all questions from chapter
const questions = await prisma.question.findMany({
  where: {
    chapterId: { in: chapterIds },
    chapter: { isActive: true }
  },
  select: { id: true }
})

// 2. Sync each question
const questionIds = questions.map(q => q.id)
await syncMultipleQuestions(questionIds)  // Uses syncSingleQuestion for each
```

**Result**:
- ✅ Chapter `isActive` set to `true`
- ✅ **ALL questions in chapter** automatically synced to QuestionBank
- ✅ Chapter now visible to students
- ✅ Questions available in timed tests

---

### **4. Editing a Question**

**Location**: `/admin/content` → Expand chapter → Click edit icon on question

**Process**:
1. Admin edits question fields
2. Saves changes

**API Call**: `PATCH /api/admin/content/questions/[questionId]`

**What Happens**:
```typescript
// src/app/api/admin/content/questions/[questionId]/route.ts

// 1. Update question
const updatedQuestion = await prisma.question.update({
  where: { id: questionId },
  data: body
})

// 2. AUTO-SYNC if chapter is active
if (question.chapter.isActive) {
  await syncSingleQuestion(questionId)  // ← Updates QuestionBank instantly
}
```

**Result**:
- ✅ Question updated in database
- ✅ **If chapter active**: QuestionBank entry updated immediately
- ✅ Changes appear in student view and tests instantly

---

### **5. Deleting a Question**

**Location**: `/admin/content` → Expand chapter → Click delete icon

**API Call**: `DELETE /api/admin/content/questions/[questionId]`

**What Happens**:
```typescript
// src/app/api/admin/content/questions/[questionId]/route.ts

// 1. Deactivate in QuestionBank first
await deactivateQuestionInBank(questionId)

// 2. Delete from database
await prisma.question.delete({
  where: { id: questionId }
})
```

**Deactivation Logic**:
```typescript
// src/lib/questionBankSyncFast.ts

await prisma.questionBank.updateMany({
  where: { sourceQuestionId: questionId },
  data: { isActive: false }  // ← Soft delete (not removed, just hidden)
})
```

**Result**:
- ✅ Question removed from database
- ✅ QuestionBank entry deactivated (isActive: false)
- ✅ No longer appears in student tests

---

### **6. Unpublishing a Chapter (Hiding from Students)**

**Location**: `/admin/content` → Click "Hide from Students"

**Process**:
1. Admin toggles `isActive: false`

**API Call**: `PATCH /api/admin/content/chapters/[chapterId]`

**What Happens**:
```typescript
// src/app/api/admin/content/chapters/[chapterId]/route.ts

const wasActive = chapter.isActive  // true
const willBeActive = false

// Update chapter
await prisma.chapter.update({
  where: { id: chapterId },
  data: { isActive: false }
})

// Deactivate all questions in QuestionBank
if (!willBeActive && wasActive) {
  await deactivateChapterQuestions(chapterId)
}
```

**Deactivation Logic**:
```typescript
// src/lib/questionBankSyncFast.ts

// Get all questions from chapter
const questions = await prisma.question.findMany({
  where: { chapterId: { in: chapterIds } },
  select: { id: true }
})

// Deactivate all in QuestionBank
await prisma.questionBank.updateMany({
  where: {
    sourceQuestionId: { in: questions.map(q => q.id) }
  },
  data: { isActive: false }
})
```

**Result**:
- ✅ Chapter hidden from students
- ✅ All questions in QuestionBank deactivated
- ✅ Chapter no longer appears in student dashboard
- ✅ Questions removed from timed tests

---

## 🎓 Student Access Flow

### **How Students See Chapters**

**API**: `GET /api/student/progress`

**Filtering**:
```typescript
// src/app/api/student/progress/route.ts

// Only get ACTIVE chapters
const allChapters = await prisma.chapter.findMany({
  where: { isActive: true },  // ← Only active chapters!
  orderBy: { chapterNumber: 'asc' }
})
```

**Student Dashboard** (`/dashboard`):
- Shows only chapters where `isActive: true`
- Displays progress, completion status
- Links to chapter practice pages

**Chapters Page** (`/dashboard/chapters`):
- Lists all active chapters
- Shows completion badges
- Links to individual chapter pages

**Chapter Practice** (`/dashboard/chapters/[chapterId]`):
- Fetches questions from `Question` table
- Only shows questions from active chapters
- Tracks answers in `Answer` table

---

## 🧪 Timed Tests Access

**How Questions Appear in Timed Tests**:

Timed tests pull questions from the `QuestionBank` table, not directly from chapters.

**QuestionBank Structure**:
```typescript
model QuestionBank {
  id              String
  sourceQuestionId String?  // ← Links back to Question.id
  questionText    String
  optionA, optionB, optionC, optionD
  correctAnswer   String
  explanation     String?
  category        QuestionCategory  // INDUSTRY or AREA_KNOWLEDGE
  isActive        Boolean
  timesUsed       Int
  timesCorrect    Int
}
```

**Test Generation**:
```typescript
// When student starts a timed test
const questions = await prisma.questionBank.findMany({
  where: {
    category: 'INDUSTRY',  // or 'AREA_KNOWLEDGE'
    isActive: true  // ← Only active questions
  }
})
```

**Key Points**:
- ✅ Only `isActive: true` questions appear in tests
- ✅ Questions are synced automatically when chapter is published
- ✅ Updates to questions sync instantly to QuestionBank
- ✅ Deleted questions are deactivated (not removed) from QuestionBank

---

## 🔑 Key Concepts

### **1. Two-Stage Publishing**

**Stage 1: Draft (isActive: false)**
- Chapter created
- Questions added
- **NOT visible to students**
- **NOT in QuestionBank**

**Stage 2: Published (isActive: true)**
- Admin clicks "Show to Students"
- **ALL questions auto-synced to QuestionBank**
- Chapter visible to students
- Questions available in timed tests

### **2. Automatic Syncing**

**When Sync Happens**:
- ✅ **Question created** → Syncs if chapter is active
- ✅ **Question updated** → Syncs if chapter is active
- ✅ **Chapter published** → Syncs ALL questions in chapter
- ✅ **Question deleted** → Deactivates in QuestionBank

**When Sync is Skipped**:
- ❌ Chapter is inactive (isActive: false)
- ❌ Question has invalid category
- ❌ Question has invalid options format

### **3. Source Question ID Linking**

Every QuestionBank entry has a `sourceQuestionId` that links back to the original `Question.id`:

```typescript
QuestionBank {
  sourceQuestionId: "question_123"  // ← Links to Question.id
  questionText: "..."
  ...
}
```

**Benefits**:
- Fast lookup (indexed field)
- Prevents duplicates
- Easy updates (find by sourceQuestionId)
- Tracks origin of each question

### **4. Soft Deletes**

Questions are **never hard-deleted** from QuestionBank. Instead:
- `isActive: false` → Hidden from tests
- Data preserved for analytics
- Can be reactivated if needed

---

## 📊 Data Flow Summary

```
┌─────────────────┐
│  Admin Creates  │
│     Chapter     │
│ (isActive:false)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Admin Adds     │
│    Questions    │
│ (No sync yet)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Admin Publishes│
│  (isActive:true) │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  AUTO-SYNC: All Questions        │
│  → QuestionBank                  │
└────────┬─────────────────────────┘
         │
         ├─────────────────┐
         ▼                 ▼
┌─────────────────┐  ┌─────────────────┐
│ Student View    │  │ Timed Tests     │
│ (Chapters Page) │  │ (QuestionBank)  │
└─────────────────┘  └─────────────────┘
```

---

## 🛠️ Technical Implementation Files

### **API Routes**:
- `src/app/api/admin/content/chapters/route.ts` - Create chapter
- `src/app/api/admin/content/chapters/[chapterId]/route.ts` - Update/Delete chapter
- `src/app/api/admin/content/questions/route.ts` - Create question
- `src/app/api/admin/content/questions/[questionId]/route.ts` - Update/Delete question

### **Sync Functions**:
- `src/lib/questionBankSyncFast.ts` - All sync logic
  - `syncSingleQuestion()` - Sync one question
  - `syncMultipleQuestions()` - Sync multiple
  - `syncChapterQuestions()` - Sync entire chapter
  - `deactivateQuestionInBank()` - Deactivate question
  - `deactivateChapterQuestions()` - Deactivate all chapter questions

### **Student APIs**:
- `src/app/api/student/progress/route.ts` - Get student progress (filters by isActive)
- `src/app/api/chapters/[chapterId]/questions/route.ts` - Get questions for chapter

---

## ✅ Best Practices

1. **Always create chapters with `isActive: false` first**
   - Add all questions
   - Review and test
   - Then publish

2. **Questions sync automatically when chapter is published**
   - No manual sync needed
   - All questions in chapter synced at once

3. **Editing questions syncs instantly**
   - Changes appear immediately in QuestionBank
   - Students see updates right away

4. **Deleting questions is safe**
   - Soft-deleted from QuestionBank (isActive: false)
   - Can be reactivated if needed

5. **Unpublishing a chapter hides it from students**
   - Questions deactivated in QuestionBank
   - Chapter can be republished later

---

## 🎯 Summary

**The system is fully automatic:**

1. **Create Chapter** → Hidden from students
2. **Add Questions** → Saved but not synced (if chapter inactive)
3. **Publish Chapter** → **ALL questions auto-sync to QuestionBank**
4. **Students See** → Only active chapters
5. **Timed Tests Use** → Only active questions from QuestionBank

**No manual steps required!** Everything syncs automatically when you publish a chapter or when you add/edit questions to an active chapter.
