# Question Flagging Feature - Implementation Guide

## Overview

This document describes the implementation of a comprehensive question flagging feature that allows students to flag questions from multiple contexts (chapters, timed tests, untimed tests, and assigned tests) with intelligent deduplication and context-aware UI behavior.

## Feature Requirements

### Core Functionality
1. **Universal Flagging**: Users can flag questions from:
   - Chapters (MCQ chapters)
   - Timed Tests (using QuestionBank)
   - Untimed Tests (using Question model)
   - Assigned Tests (using Question model)

2. **Deduplication**: If a user flags the same question multiple times from different contexts, the system stores only one flag record per student per question.

3. **Context-Aware Behavior**:
   - **In Tests** (Timed, Untimed, Assigned):
     - Users can flag questions
     - Users CANNOT see if a question is already flagged
     - If they flag an already-flagged question, the system accepts the flag but maintains only one record
   
   - **In Chapters**:
     - Users can see if a question is flagged (visual indicator)
     - Users can flag questions
     - Users can unflag questions
     - Flag status is visible in the UI

4. **Restrictions**:
   - Unflagging is ONLY allowed from chapters
   - Unflagging is NOT allowed during any test context

## Database Schema

### New Model: `FlaggedQuestion`

```prisma
model FlaggedQuestion {
  id            String    @id @default(cuid())
  studentId     String
  student       Student   @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  // Support both Question and QuestionBank
  questionId    String?   // For Question model (chapters, untimed, assigned tests)
  question      Question? @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  questionBankId String?  // For QuestionBank model (timed tests)
  questionBank  QuestionBank? @relation(fields: [questionBankId], references: [id], onDelete: Cascade)
  
  // Track where the question was flagged from
  flaggedFrom   FlaggedFrom @default(CHAPTER)
  
  // Metadata
  flaggedAt     DateTime  @default(now())
  unflaggedAt   DateTime? // When unflagging occurred (if applicable)
  isActive      Boolean   @default(true) // false when unflagged
  
  // Notes: Only one of questionId or questionBankId should be set
  // Unique constraints are handled via partial indexes in migration SQL
  // (Prisma doesn't support partial unique indexes directly)
  
  @@index([studentId, isActive])
  @@index([questionId])
  @@index([questionBankId])
  @@map("flagged_questions")
}
```

### New Enum: `FlaggedFrom`

```prisma
enum FlaggedFrom {
  CHAPTER        // Flagged from chapter view
  TIMED_TEST     // Flagged from timed test
  UNTIMED_TEST   // Flagged from untimed test
  ASSIGNED_TEST  // Flagged from assigned test
}
```

### Updated Models

#### Student Model
Add relation to flagged questions:

```prisma
model Student {
  // ... existing fields ...
  flaggedQuestions FlaggedQuestion[]
  // ... rest of fields ...
}
```

#### Question Model
Add relation to flagged questions:

```prisma
model Question {
  // ... existing fields ...
  flaggedQuestions FlaggedQuestion[]
  // ... rest of fields ...
}
```

#### QuestionBank Model
Add relation to flagged questions:

```prisma
model QuestionBank {
  // ... existing fields ...
  flaggedQuestions FlaggedQuestion[]
  // ... rest of fields ...
}
```

## Migration SQL

### Step 1: Create Enum Type

```sql
-- CreateEnum
CREATE TYPE "FlaggedFrom" AS ENUM ('CHAPTER', 'TIMED_TEST', 'UNTIMED_TEST', 'ASSIGNED_TEST');
```

### Step 2: Create FlaggedQuestion Table

```sql
-- CreateTable
CREATE TABLE "flagged_questions" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "questionId" TEXT,
    "questionBankId" TEXT,
    "flaggedFrom" "FlaggedFrom" NOT NULL DEFAULT 'CHAPTER',
    "flaggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unflaggedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "flagged_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "flagged_questions_studentId_isActive_idx" ON "flagged_questions"("studentId", "isActive");

-- CreateIndex
CREATE INDEX "flagged_questions_questionId_idx" ON "flagged_questions"("questionId");

-- CreateIndex
CREATE INDEX "flagged_questions_questionBankId_idx" ON "flagged_questions"("questionBankId");

-- CreateUniqueConstraint
-- Note: PostgreSQL unique constraints treat NULLs specially (multiple NULLs allowed)
-- We need separate partial unique indexes for Question and QuestionBank
-- This ensures one active flag per student per question

-- Unique index for Question model (questionId is NOT NULL, questionBankId IS NULL)
CREATE UNIQUE INDEX "flagged_questions_student_question_unique_idx" 
ON "flagged_questions"("studentId", "questionId") 
WHERE "isActive" = true AND "questionId" IS NOT NULL;

-- Unique index for QuestionBank model (questionBankId is NOT NULL, questionId IS NULL)
CREATE UNIQUE INDEX "flagged_questions_student_questionbank_unique_idx" 
ON "flagged_questions"("studentId", "questionBankId") 
WHERE "isActive" = true AND "questionBankId" IS NOT NULL;

-- AddForeignKey
ALTER TABLE "flagged_questions" ADD CONSTRAINT "flagged_questions_studentId_fkey" 
FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flagged_questions" ADD CONSTRAINT "flagged_questions_questionId_fkey" 
FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flagged_questions" ADD CONSTRAINT "flagged_questions_questionBankId_fkey" 
FOREIGN KEY ("questionBankId") REFERENCES "question_bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### Step 3: Add Check Constraint (Optional but Recommended)

```sql
-- Ensure only one of questionId or questionBankId is set
ALTER TABLE "flagged_questions" 
ADD CONSTRAINT "flagged_questions_question_xor_check" 
CHECK (
  ("questionId" IS NOT NULL AND "questionBankId" IS NULL) OR
  ("questionId" IS NULL AND "questionBankId" IS NOT NULL)
);
```

## API Endpoints

### 1. Flag a Question

**POST** `/api/questions/flag`

Flags a question from any context. Handles deduplication automatically.

**Request Body:**
```typescript
{
  questionId?: string;        // For Question model (chapters, untimed, assigned)
  questionBankId?: string;     // For QuestionBank model (timed tests)
  flaggedFrom: 'CHAPTER' | 'TIMED_TEST' | 'UNTIMED_TEST' | 'ASSIGNED_TEST';
}
```

**Response:**
```typescript
{
  success: boolean;
  flagged: boolean;  // true if newly flagged, false if already flagged
  flagId: string;
  message: string;
}
```

**Business Logic:**
- Check if an active flag already exists for this student + question combination
- If exists: return success with `flagged: false` (no new record created)
- If not exists: create new flag record with `isActive: true`
- Always return success (user doesn't need to know if it was already flagged in tests)

### 2. Unflag a Question

**POST** `/api/questions/unflag`

Unflags a question. Only allowed from chapter context.

**Request Body:**
```typescript
{
  questionId: string;  // Required - only for Question model (chapters)
}
```

**Response:**
```typescript
{
  success: boolean;
  unflagged: boolean;
  message: string;
}
```

**Business Logic:**
- Only works for `questionId` (not `questionBankId`)
- Sets `isActive: false` and `unflaggedAt: now()`
- Returns error if trying to unflag a QuestionBank question

### 3. Get Flagged Questions for Student

**GET** `/api/student/flagged-questions`

Returns all active flagged questions for the current student.

**Query Parameters:**
- `includeInactive?: boolean` - Include unflagged questions (default: false)

**Response:**
```typescript
{
  flaggedQuestions: Array<{
    id: string;
    questionId?: string;
    questionBankId?: string;
    flaggedFrom: string;
    flaggedAt: string;
    question?: {
      id: string;
      questionText: string;
      chapterId: string;
      chapter: {
        id: string;
        title: string;
      };
    };
    questionBank?: {
      id: string;
      questionText: string;
      category: string;
    };
  }>;
  total: number;
}
```

**Implementation Note:**
- Fetch flagged questions with both `question` and `questionBank` relations
- Use `include` to get related data:
  ```typescript
  const flags = await prisma.flaggedQuestion.findMany({
    where: {
      studentId,
      isActive: includeInactive ? undefined : true,
    },
    include: {
      question: {
        include: {
          chapter: {
            select: { id: true, title: true },
          },
        },
      },
      questionBank: true,
    },
    orderBy: { flaggedAt: 'desc' },
  });
  ```

### 4. Check if Question is Flagged (Chapter Context Only)

**GET** `/api/questions/[questionId]/flag-status`

Returns flag status for a specific question. Only used in chapter context.

**Response:**
```typescript
{
  isFlagged: boolean;
  flaggedAt?: string;
  flaggedFrom?: string;
}
```

**Note:** This endpoint should NOT be called from test contexts to maintain the requirement that users cannot see flag status during tests.

## UI Integration Points

### 1. Chapter Pages

**Location:** `src/app/dashboard/chapters/[chapterId]/quiz/page.tsx` and similar chapter quiz pages

**Components to Update:**
- `MCQQuestion` component (`src/components/chapters/MCQQuestion.tsx`)

**Changes Required:**
1. Add flag icon/button to question header
2. Show flag status visually (e.g., red flag icon if flagged)
3. Allow toggling flag status (flag/unflag)
4. Fetch flag status when loading questions
5. Call flag/unflag API on user action

**Example UI:**
```tsx
// In MCQQuestion component
<div className="flex items-center gap-2 mb-3">
  <span>Question {question.questionNumber}</span>
  {isFlagged && (
    <FaFlag className="text-red-500" title="Flagged for review" />
  )}
  <button
    onClick={handleToggleFlag}
    className="ml-auto"
  >
    {isFlagged ? (
      <FaFlag className="text-red-500" title="Unflag question" />
    ) : (
      <FaRegFlag className="text-gray-400" title="Flag question" />
    )}
  </button>
</div>
```

### 2. Timed Test Pages

**Location:** `src/app/dashboard/timed-tests/session/[id]/page.tsx`

**Changes Required:**
1. Add flag button to question display
2. Do NOT show flag status
3. Call flag API on click (always shows as "not flagged" to user)
4. Handle both QuestionBank questions

**Example UI:**
```tsx
// In timed test question display
<div className="flex items-center justify-between">
  <h2>{currentQuestion.questionText}</h2>
  <button
    onClick={() => handleFlagQuestion(currentQuestion.id, 'TIMED_TEST')}
    className="p-2 hover:bg-gray-100 rounded"
    title="Flag this question"
  >
    <FaRegFlag className="text-gray-400" />
  </button>
</div>
```

### 3. Untimed Test Pages

**Location:** `src/app/dashboard/tests/untimed/[id]/page.tsx`

**Changes Required:**
1. Add flag button to question display
2. Do NOT show flag status
3. Call flag API on click
4. Use Question model (questionId)

**Example UI:**
```tsx
// Similar to timed tests but uses questionId
<button
  onClick={() => handleFlagQuestion(question.id, 'UNTIMED_TEST')}
  className="p-2 hover:bg-gray-100 rounded"
  title="Flag this question"
>
  <FaRegFlag className="text-gray-400" />
</button>
```

### 4. Assigned Test Pages

**Location:** `src/app/dashboard/tests/assigned/[id]/page.tsx`

**Changes Required:**
1. Add flag button to question display
2. Do NOT show flag status
3. Call flag API on click
4. Use Question model (questionId)

**Example UI:**
```tsx
// Similar to untimed tests
<button
  onClick={() => handleFlagQuestion(question.id, 'ASSIGNED_TEST')}
  className="p-2 hover:bg-gray-100 rounded"
  title="Flag this question"
>
  <FaRegFlag className="text-gray-400" />
</button>
```

## Implementation Details

### Flagging Logic (Deduplication)

```typescript
async function flagQuestion(
  studentId: string,
  questionId?: string,
  questionBankId?: string,
  flaggedFrom: FlaggedFrom
) {
  // Validate: exactly one ID must be provided
  if (!questionId && !questionBankId) {
    throw new Error('Either questionId or questionBankId must be provided');
  }
  if (questionId && questionBankId) {
    throw new Error('Cannot provide both questionId and questionBankId');
  }

  // Check for existing active flag
  // Build where clause based on which ID is provided
  const whereClause: any = {
    studentId,
    isActive: true,
  };
  
  if (questionId) {
    whereClause.questionId = questionId;
    whereClause.questionBankId = null;
  } else {
    whereClause.questionId = null;
    whereClause.questionBankId = questionBankId;
  }

  const existingFlag = await prisma.flaggedQuestion.findFirst({
    where: whereClause,
  });

  if (existingFlag) {
    // Already flagged - return success but don't create duplicate
    return {
      flagged: false,
      flagId: existingFlag.id,
      message: 'Question is already flagged',
    };
  }

  // Create new flag
  // Note: The unique indexes will prevent duplicates at DB level
  // But we check first to provide better user feedback
  try {
    const flag = await prisma.flaggedQuestion.create({
      data: {
        studentId,
        questionId: questionId || null,
        questionBankId: questionBankId || null,
        flaggedFrom,
        isActive: true,
      },
    });

    return {
      flagged: true,
      flagId: flag.id,
      message: 'Question flagged successfully',
    };
  } catch (error: any) {
    // Handle unique constraint violation (safety net)
    if (error.code === 'P2002') {
      // Duplicate entry - query to get existing flag
      const existingFlag = await prisma.flaggedQuestion.findFirst({
        where: whereClause,
      });
      
      return {
        flagged: false,
        flagId: existingFlag?.id || '',
        message: 'Question is already flagged',
      };
    }
    throw error;
  }
}
```

### Unflagging Logic

```typescript
async function unflagQuestion(studentId: string, questionId: string) {
  // Only allow unflagging Question model (not QuestionBank)
  const flag = await prisma.flaggedQuestion.findFirst({
    where: {
      studentId,
      questionId,
      isActive: true,
    },
  });

  if (!flag) {
    return {
      unflagged: false,
      message: 'Question is not flagged',
    };
  }

  // Soft delete by setting isActive to false
  await prisma.flaggedQuestion.update({
    where: { id: flag.id },
    data: {
      isActive: false,
      unflaggedAt: new Date(),
    },
  });

  return {
    unflagged: true,
    message: 'Question unflagged successfully',
  };
}
```

### Fetching Flag Status (Chapter Context Only)

```typescript
async function getFlagStatus(studentId: string, questionId: string) {
  const flag = await prisma.flaggedQuestion.findFirst({
    where: {
      studentId,
      questionId,
      isActive: true,
    },
  });

  return {
    isFlagged: !!flag,
    flaggedAt: flag?.flaggedAt,
    flaggedFrom: flag?.flaggedFrom,
  };
}
```

## Data Flow

### Flagging from Chapter
1. User clicks flag button in chapter
2. Frontend calls `GET /api/questions/[questionId]/flag-status` to check current status
3. If not flagged: Frontend calls `POST /api/questions/flag` with `flaggedFrom: 'CHAPTER'`
4. If flagged: Frontend calls `POST /api/questions/unflag` to unflag
5. UI updates to show new flag status

### Flagging from Test
1. User clicks flag button during test
2. Frontend calls `POST /api/questions/flag` with appropriate `flaggedFrom`
3. API handles deduplication (may return `flagged: false` if already flagged)
4. UI shows flag button as clicked (but doesn't reveal if already flagged)
5. No flag status check is performed (user cannot see if already flagged)

## Testing Checklist

### Functional Tests
- [ ] Flag question from chapter - creates new flag
- [ ] Flag same question again from chapter - shows as already flagged
- [ ] Unflag question from chapter - removes flag
- [ ] Flag question from timed test - creates flag
- [ ] Flag same question from untimed test - deduplicates (only one flag)
- [ ] Flag same question from assigned test - deduplicates
- [ ] Flag question from test - user cannot see if already flagged
- [ ] Try to unflag from test context - should fail or not be available
- [ ] Flag QuestionBank question from timed test
- [ ] Flag Question model question from chapter
- [ ] Get all flagged questions for student
- [ ] Flag status visible in chapters
- [ ] Flag status NOT visible in tests

### Edge Cases
- [ ] Flag question, then delete question - flag should cascade delete
- [ ] Flag question, then delete student - flag should cascade delete
- [ ] Flag question with invalid questionId - should error
- [ ] Flag question with both questionId and questionBankId - should error
- [ ] Flag question with neither questionId nor questionBankId - should error

## Migration Steps

1. **Update Prisma Schema**
   - Add `FlaggedQuestion` model
   - Add `FlaggedFrom` enum
   - Add relations to `Student`, `Question`, and `QuestionBank`

2. **Generate Migration**
   ```bash
   npx prisma migrate dev --name add_question_flagging_feature
   ```

3. **Review Migration SQL**
   - Ensure unique constraint is correct
   - Verify foreign key constraints
   - Check indexes are created

4. **Run Migration**
   ```bash
   npx prisma migrate deploy
   ```

5. **Update Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Implement API Endpoints**
   - Create flag endpoint
   - Create unflag endpoint
   - Create get flagged questions endpoint
   - Create check flag status endpoint

7. **Update UI Components**
   - Add flag buttons to chapter pages
   - Add flag buttons to test pages
   - Implement flag status display in chapters
   - Ensure no flag status display in tests

8. **Test Thoroughly**
   - Test all flagging scenarios
   - Test deduplication
   - Test context-aware behavior
   - Test edge cases

## Security Considerations

1. **Authorization**: All endpoints must verify the user is authenticated and is a student
2. **Student ID Validation**: Ensure students can only flag/unflag their own questions
3. **Input Validation**: Validate questionId and questionBankId exist and belong to valid questions
4. **Rate Limiting**: Consider rate limiting on flag endpoints to prevent abuse
5. **Audit Trail**: The `flaggedAt` and `unflaggedAt` timestamps provide an audit trail

## Performance Considerations

1. **Indexes**: The unique index on `(studentId, questionId, questionBankId)` where `isActive = true` ensures fast lookups
2. **Query Optimization**: When fetching questions for chapters, include flag status in a single query using `include`
3. **Caching**: Consider caching flag status for frequently accessed questions (optional)

## Future Enhancements (Optional)

1. **Flag Reasons**: Allow users to provide a reason for flagging (e.g., "Unclear question", "Wrong answer", "Typo")
2. **Admin Review**: Allow admins to view all flagged questions and take action
3. **Flag Categories**: Categorize flags (content issue, technical issue, etc.)
4. **Bulk Operations**: Allow users to flag/unflag multiple questions at once
5. **Flag Statistics**: Show how many times a question has been flagged across all users

## Notes

- The unique constraint uses a partial index to ensure only one active flag per student per question
- Soft deletion (isActive flag) is used instead of hard deletion to maintain audit trail
- The check constraint ensures data integrity (only one of questionId or questionBankId is set)
- Flag status is intentionally hidden in test contexts to prevent bias or distraction during testing
