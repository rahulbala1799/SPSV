# MCQ Chapter Implementation Guide
## Southside Full Chapter - Database-Driven MCQ System

## Overview

This document outlines the complete implementation plan for adding the **Southside Full** chapter as an interactive MCQ (Multiple Choice Questions) system in the student dashboard. Questions will be stored in the database and students can answer them with immediate feedback.

---

## Table of Contents

1. [Database Schema Design](#database-schema-design)
2. [Data Structure](#data-structure)
3. [API Routes](#api-routes)
4. [Frontend Components](#frontend-components)
5. [User Flow](#user-flow)
6. [Implementation Steps](#implementation-steps)
7. [Testing Plan](#testing-plan)

---

## Database Schema Design

### New Prisma Models

```prisma
// Chapter model for organizing course content
model Chapter {
  id          String    @id @default(cuid())
  title       String
  description String?
  chapterNumber Int      // e.g., 1, 2, 3...
  type        ChapterType @default(MCQ) // MCQ, READING, VIDEO, etc.
  duration    Int?      // Estimated minutes
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  questions   Question[]
  progress    ChapterProgress[]
  
  @@map("chapters")
}

enum ChapterType {
  MCQ
  READING
  VIDEO
  MIXED
}

// Question model for storing MCQ questions
model Question {
  id          String    @id @default(cuid())
  chapterId   String
  chapter     Chapter   @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  
  questionText String    // The actual question
  questionNumber Int     // Order within chapter (1, 2, 3...)
  
  options     Json      // Array of option objects
  // Structure: [
  //   { id: "A", text: "Option A" },
  //   { id: "B", text: "Option B" },
  //   { id: "C", text: "Option C" },
  //   { id: "D", text: "Option D" }
  // ]
  
  correctAnswer String  // The ID of correct option (e.g., "A", "B", "C", "D")
  explanation    String? // Optional explanation for the answer
  
  points        Int      @default(1) // Points for correct answer
  difficulty    String   @default("medium") // easy, medium, hard
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  answers       Answer[]
  
  @@unique([chapterId, questionNumber])
  @@map("questions")
}

// Track student answers and progress
model Answer {
  id          String    @id @default(cuid())
  studentId   String
  student     Student   @relation(fields: [studentId], references: [id], onDelete: Cascade)
  questionId  String
  question    Question  @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  selectedAnswer String  // The option ID the student selected
  isCorrect    Boolean
  pointsEarned Int      @default(0)
  
  answeredAt   DateTime  @default(now())
  
  @@unique([studentId, questionId]) // One answer per student per question
  @@map("answers")
}

// Track chapter completion progress
model ChapterProgress {
  id          String    @id @default(cuid())
  studentId   String
  student     Student   @relation(fields: [studentId], references: [id], onDelete: Cascade)
  chapterId   String
  chapter     Chapter   @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  
  isCompleted Boolean   @default(false)
  score       Int?      // Percentage score
  totalQuestions Int
  correctAnswers Int    @default(0)
  startedAt   DateTime?
  completedAt DateTime?
  
  lastAccessed DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@unique([studentId, chapterId]) // One progress record per student per chapter
  @@map("chapter_progress")
}
```

### Updated Student Model

```prisma
model Student {
  // ... existing fields ...
  
  answers         Answer[]
  chapterProgress ChapterProgress[]
}
```

---

## Data Structure

### Chapter Data Example

```json
{
  "id": "chapter_southside_full",
  "title": "Southside Full",
  "description": "Test your knowledge of roads, landmarks, and locations in Dublin's Southside area",
  "chapterNumber": 1,
  "type": "MCQ",
  "duration": 30,
  "isActive": true
}
```

### Question Data Example

```json
{
  "id": "q1",
  "chapterId": "chapter_southside_full",
  "questionText": "Which road runs between Merrion to Ballsbridge?",
  "questionNumber": 1,
  "options": [
    { "id": "A", "text": "Nutley Lane" },
    { "id": "B", "text": "Anglesea Road" },
    { "id": "C", "text": "Strand Road" },
    { "id": "D", "text": "Merrion Road" }
  ],
  "correctAnswer": "D",
  "explanation": "Merrion Road is the main road connecting Merrion to Ballsbridge.",
  "points": 1,
  "difficulty": "medium"
}
```

### Answer Data Example

```json
{
  "studentId": "student_123",
  "questionId": "q1",
  "selectedAnswer": "D",
  "isCorrect": true,
  "pointsEarned": 1,
  "answeredAt": "2026-01-26T10:30:00Z"
}
```

### Chapter Progress Data Example

```json
{
  "studentId": "student_123",
  "chapterId": "chapter_southside_full",
  "isCompleted": false,
  "score": 85,
  "totalQuestions": 20,
  "correctAnswers": 17,
  "startedAt": "2026-01-26T10:00:00Z",
  "completedAt": null,
  "lastAccessed": "2026-01-26T10:35:00Z"
}
```

---

## API Routes

### 1. Get Chapter Details
**Endpoint:** `GET /api/chapters/[chapterId]`

**Response:**
```json
{
  "chapter": {
    "id": "chapter_southside_full",
    "title": "Southside Full",
    "description": "...",
    "chapterNumber": 1,
    "type": "MCQ",
    "duration": 30
  },
  "totalQuestions": 20,
  "studentProgress": {
    "isCompleted": false,
    "score": null,
    "correctAnswers": 0,
    "totalQuestions": 20
  }
}
```

### 2. Get Questions for Chapter
**Endpoint:** `GET /api/chapters/[chapterId]/questions`

**Query Parameters:**
- `includeAnswers` (optional): Include student's previous answers

**Response:**
```json
{
  "questions": [
    {
      "id": "q1",
      "questionText": "Which road runs between Merrion to Ballsbridge?",
      "questionNumber": 1,
      "options": [
        { "id": "A", "text": "Nutley Lane" },
        { "id": "B", "text": "Anglesea Road" },
        { "id": "C", "text": "Strand Road" },
        { "id": "D", "text": "Merrion Road" }
      ],
      "studentAnswer": {
        "selectedAnswer": "D",
        "isCorrect": true,
        "answeredAt": "2026-01-26T10:30:00Z"
      } // Only if includeAnswers=true
    }
  ]
}
```

### 3. Submit Answer
**Endpoint:** `POST /api/chapters/[chapterId]/questions/[questionId]/answer`

**Request Body:**
```json
{
  "selectedAnswer": "D"
}
```

**Response:**
```json
{
  "success": true,
  "isCorrect": true,
  "correctAnswer": "D",
  "explanation": "Merrion Road is the main road connecting Merrion to Ballsbridge.",
  "pointsEarned": 1,
  "chapterProgress": {
    "correctAnswers": 1,
    "totalQuestions": 20,
    "score": 5
  }
}
```

### 4. Get Chapter Progress
**Endpoint:** `GET /api/chapters/[chapterId]/progress`

**Response:**
```json
{
  "progress": {
    "isCompleted": false,
    "score": 85,
    "totalQuestions": 20,
    "correctAnswers": 17,
    "startedAt": "2026-01-26T10:00:00Z",
    "completedAt": null
  },
  "answers": [
    {
      "questionId": "q1",
      "selectedAnswer": "D",
      "isCorrect": true
    }
  ]
}
```

### 5. Complete Chapter
**Endpoint:** `POST /api/chapters/[chapterId]/complete`

**Response:**
```json
{
  "success": true,
  "progress": {
    "isCompleted": true,
    "score": 85,
    "totalQuestions": 20,
    "correctAnswers": 17,
    "completedAt": "2026-01-26T10:45:00Z"
  }
}
```

---

## Frontend Components

### 1. Chapter Detail Page
**File:** `src/app/dashboard/chapters/[id]/page.tsx`

**Features:**
- Display chapter title and description
- Show progress indicator
- List all questions
- Show which questions are answered
- "Start Chapter" / "Continue Chapter" button

### 2. MCQ Question Component
**File:** `src/components/chapters/MCQQuestion.tsx`

**Features:**
- Display question text
- Show 4 multiple choice options
- Highlight selected answer
- Show correct/incorrect feedback immediately
- Display explanation after answer
- Disable interaction after answering
- Show points earned

### 3. Chapter Quiz Page
**File:** `src/app/dashboard/chapters/[id]/quiz/page.tsx`

**Features:**
- Full-screen quiz interface
- One question at a time (or all questions scrollable)
- Progress bar showing completion
- Submit answer button
- Next/Previous question navigation
- Score display
- "Complete Chapter" button when all answered

### 4. Chapter Results Page
**File:** `src/app/dashboard/chapters/[id]/results/page.tsx`

**Features:**
- Final score display
- Percentage score
- List of all questions with answers
- Correct/incorrect indicators
- Option to retake
- Return to chapters list

---

## User Flow

### Flow 1: Starting a Chapter

```
1. Student clicks on "Southside Full" chapter
   ↓
2. Chapter detail page loads
   - Shows chapter info
   - Shows progress (if started)
   - Shows "Start" or "Continue" button
   ↓
3. Student clicks "Start Chapter"
   ↓
4. Quiz page loads
   - Fetches all questions
   - Shows first question
   - Initializes progress tracking
```

### Flow 2: Answering Questions

```
1. Student sees question with 4 options
   ↓
2. Student selects an option (A, B, C, or D)
   ↓
3. Student clicks "Submit Answer" button
   ↓
4. API call to submit answer
   ↓
5. Immediate feedback:
   - Selected option highlighted (green if correct, red if wrong)
   - Correct answer highlighted in green
   - Explanation shown (if available)
   - Points earned displayed
   ↓
6. Progress updated
   ↓
7. Next question button appears
   ↓
8. Student proceeds to next question
```

### Flow 3: Completing Chapter

```
1. Student answers all questions
   ↓
2. "Complete Chapter" button appears
   ↓
3. Student clicks button
   ↓
4. API call to mark chapter as completed
   ↓
5. Results page loads
   - Shows final score
   - Shows all questions with answers
   - Shows pass/fail status
   ↓
6. Student can:
   - Return to chapters list
   - Retake chapter (optional)
```

---

## Implementation Steps

### Phase 1: Database Setup

1. **Update Prisma Schema**
   ```bash
   # Add new models to prisma/schema.prisma
   # Run migration
   npx prisma migrate dev --name add_mcq_chapters
   npx prisma generate
   ```

2. **Seed Database with Southside Full Chapter**
   - Create seed script: `prisma/seed-southside-chapter.ts`
   - Insert chapter data
   - Insert all 20 questions
   - Run: `npx tsx prisma/seed-southside-chapter.ts`

### Phase 2: API Development

1. **Create API Routes**
   - `/api/chapters/[chapterId]/route.ts` - Get chapter
   - `/api/chapters/[chapterId]/questions/route.ts` - Get questions
   - `/api/chapters/[chapterId]/questions/[questionId]/answer/route.ts` - Submit answer
   - `/api/chapters/[chapterId]/progress/route.ts` - Get progress
   - `/api/chapters/[chapterId]/complete/route.ts` - Complete chapter

2. **Add Authentication Middleware**
   - Verify student is logged in
   - Verify student owns the progress/answers

3. **Add Validation**
   - Validate answer format
   - Validate question exists
   - Validate chapter exists

### Phase 3: Frontend Development

1. **Update Chapters List Page**
   - Add "Southside Full" chapter
   - Show completion status
   - Show score if completed

2. **Create Chapter Detail Page**
   - `/dashboard/chapters/southside-full/page.tsx`
   - Show chapter info
   - Show progress
   - Start/Continue button

3. **Create Quiz Page**
   - `/dashboard/chapters/southside-full/quiz/page.tsx`
   - MCQ question component
   - Answer submission
   - Progress tracking
   - Navigation

4. **Create Results Page**
   - `/dashboard/chapters/southside-full/results/page.tsx`
   - Score display
   - Answer review
   - Completion status

5. **Create MCQ Components**
   - `MCQQuestion.tsx` - Single question component
   - `MCQOption.tsx` - Option button component
   - `AnswerFeedback.tsx` - Feedback display component

### Phase 4: Integration

1. **Update Dashboard**
   - Show chapter completion in progress
   - Update statistics

2. **Update Progress Page**
   - Show chapter scores
   - Show completion status

3. **Add Navigation**
   - Link from chapters list to chapter detail
   - Link from chapter detail to quiz
   - Link from quiz to results

### Phase 5: Testing

1. **Test Database**
   - Verify questions are stored correctly
   - Verify answers are saved
   - Verify progress is tracked

2. **Test API**
   - Test all endpoints
   - Test authentication
   - Test error handling

3. **Test Frontend**
   - Test question display
   - Test answer submission
   - Test feedback display
   - Test progress tracking
   - Test mobile responsiveness

---

## Database Seed Script Structure

```typescript
// prisma/seed-southside-chapter.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedSouthsideChapter() {
  // Create chapter
  const chapter = await prisma.chapter.create({
    data: {
      title: "Southside Full",
      description: "Test your knowledge of roads, landmarks, and locations in Dublin's Southside area",
      chapterNumber: 1,
      type: "MCQ",
      duration: 30,
      isActive: true
    }
  })

  // Create questions
  const questions = [
    {
      questionText: "Which road runs between Merrion to Ballsbridge?",
      questionNumber: 1,
      options: [
        { id: "A", text: "Nutley Lane" },
        { id: "B", text: "Anglesea Road" },
        { id: "C", text: "Strand Road" },
        { id: "D", text: "Merrion Road" }
      ],
      correctAnswer: "D",
      explanation: "Merrion Road is the main road connecting Merrion to Ballsbridge.",
      points: 1,
      difficulty: "medium"
    },
    // ... all 20 questions
  ]

  for (const q of questions) {
    await prisma.question.create({
      data: {
        chapterId: chapter.id,
        questionText: q.questionText,
        questionNumber: q.questionNumber,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: q.points,
        difficulty: q.difficulty
      }
    })
  }

  console.log('✅ Southside Full chapter seeded successfully!')
}

seedSouthsideChapter()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

---

## Component Structure

```
src/
├── app/
│   └── dashboard/
│       └── chapters/
│           └── [id]/
│               ├── page.tsx          # Chapter detail page
│               ├── quiz/
│               │   └── page.tsx      # Quiz interface
│               └── results/
│                   └── page.tsx      # Results page
├── components/
│   └── chapters/
│       ├── MCQQuestion.tsx          # Question component
│       ├── MCQOption.tsx            # Option button
│       ├── AnswerFeedback.tsx       # Feedback display
│       └── ChapterProgress.tsx      # Progress indicator
└── lib/
    └── questions.ts                 # Question utilities
```

---

## UI/UX Design Considerations

### Mobile-First Design
- Large touch targets for options (min 44x44px)
- Swipe gestures for next/previous question
- Full-screen quiz mode
- Sticky submit button

### Feedback Design
- **Correct Answer:** Green highlight, checkmark icon
- **Incorrect Answer:** Red highlight, X icon
- **Correct Answer Highlight:** Green border on correct option
- **Explanation:** Expandable section below question
- **Points:** Animated counter

### Progress Indicators
- Progress bar at top of quiz
- Question counter (e.g., "Question 5 of 20")
- Completion percentage
- Score display

### Accessibility
- Keyboard navigation (arrow keys, Enter)
- Screen reader support
- High contrast mode
- Focus indicators

---

## Security Considerations

1. **Authentication**
   - All API routes require student authentication
   - Verify student owns the answer/progress

2. **Validation**
   - Validate answer format (must be A, B, C, or D)
   - Validate question exists
   - Prevent duplicate answers
   - Rate limiting on answer submission

3. **Data Protection**
   - Don't expose correct answers before submission
   - Store answers securely
   - Prevent answer manipulation

---

## Performance Optimizations

1. **Database**
   - Index on `chapterId` and `questionNumber`
   - Index on `studentId` and `questionId` for answers
   - Use transactions for answer submission

2. **Frontend**
   - Lazy load questions
   - Cache chapter data
   - Optimistic UI updates
   - Debounce answer submissions

3. **API**
   - Cache chapter data
   - Batch question fetching
   - Use pagination if needed

---

## Testing Plan

### Unit Tests
- Question component rendering
- Answer submission logic
- Score calculation
- Progress tracking

### Integration Tests
- API endpoint testing
- Database operations
- Authentication flow

### E2E Tests
- Complete chapter flow
- Answer submission
- Progress tracking
- Results display

---

## Future Enhancements

1. **Question Types**
   - Multiple correct answers
   - True/False questions
   - Image-based questions
   - Map-based questions

2. **Features**
   - Question hints
   - Time limits
   - Question shuffling
   - Retake with different questions
   - Leaderboards
   - Question explanations with images

3. **Analytics**
   - Track most missed questions
   - Average time per question
   - Difficulty analysis
   - Student performance trends

---

## Migration Checklist

- [ ] Update Prisma schema with new models
- [ ] Run database migration
- [ ] Create seed script for Southside Full chapter
- [ ] Seed database with questions
- [ ] Create API routes
- [ ] Create frontend components
- [ ] Update chapters list page
- [ ] Create chapter detail page
- [ ] Create quiz page
- [ ] Create results page
- [ ] Add navigation links
- [ ] Update dashboard progress
- [ ] Test all functionality
- [ ] Deploy to production

---

## Estimated Implementation Time

- **Database Setup:** 2-3 hours
- **API Development:** 4-6 hours
- **Frontend Development:** 6-8 hours
- **Testing & Bug Fixes:** 2-3 hours
- **Total:** 14-20 hours

---

**Document Created:** January 2026  
**Status:** Ready for Implementation  
**Next Step:** Begin Phase 1 - Database Setup
