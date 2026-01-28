# Test Metrics & Analytics - Complete Documentation

## Overview

This document provides a comprehensive overview of all metrics collected during test sessions, how they can be improved, and recommendations for enhancing student learning through better analytics.

---

## 📊 Current Metrics Collection

### 1. Timed Tests (Full Timed & Mock Tests)

#### Test Session Level Metrics
**Stored in `TestSession` model:**
- **Test Identification:**
  - `id`: Unique session identifier
  - `testType`: FULL_TIMED or MOCK
  - `status`: IN_PROGRESS, COMPLETED, ABANDONED
  - `userId`: Student identifier

- **Question Composition:**
  - `totalQuestions`: Total questions in test
  - `industryQuestions`: Number of industry knowledge questions
  - `areaQuestions`: Number of area knowledge questions

- **Time Metrics:**
  - `timeAllotted`: Total time allocated (in seconds)
  - `timeRemaining`: Time remaining at submission (in seconds)
  - `startedAt`: When test was started
  - `completedAt`: When test was completed
  - `createdAt`: Session creation timestamp
  - `updatedAt`: Last update timestamp

- **Score Metrics:**
  - `score`: Raw score (number of correct answers)
  - `scorePercentage`: Overall percentage score
  - `industryScore`: Correct industry questions count
  - `areaScore`: Correct area questions count
  - `industryPercentage`: Industry category percentage
  - `areaPercentage`: Area category percentage

#### Question Level Metrics (TimedTestQuestion)
**Stored in `TimedTestQuestion` model:**
- `id`: Question identifier
- `sessionId`: Parent session
- `questionBankId`: Source question bank reference
- `orderNumber`: Question position in test
- `questionText`: Question content (snapshot)
- `optionA`, `optionB`, `optionC`, `optionD`: Answer options (snapshot)
- `correctAnswer`: Correct answer (snapshot)
- `explanation`: Answer explanation (snapshot)
- `category`: INDUSTRY or AREA_KNOWLEDGE
- `createdAt`: Question snapshot timestamp

#### Answer Level Metrics (TimedTestAnswer)
**Stored in `TimedTestAnswer` model:**
- `id`: Answer identifier
- `sessionId`: Parent session
- `questionId`: Related question
- `selectedAnswer`: Student's selected answer (A, B, C, D)
- `isCorrect`: Boolean indicating correctness
- `timeSpent`: Time spent on this question (in seconds)
- `answeredAt`: Timestamp when answer was submitted
- `createdAt`: Answer creation timestamp
- `updatedAt`: Last update timestamp

#### Analytics Tracking (TimedTestAttemptTracking)
**Stored in `TimedTestAttemptTracking` model:**
- `id`: Tracking identifier
- `studentId`: Student identifier
- `testSessionId`: Related test session
- `testType`: FULL_TIMED or MOCK
- `attemptNumber`: Sequential attempt number for this test type
- `startedAt`: Test start time
- `completedAt`: Test completion time
- `durationSeconds`: Total test duration
- `score`: Raw score
- `maxScore`: Maximum possible score
- `percentage`: Score percentage
- `questionsTotal`: Total questions
- `questionsCorrect`: Correct answers count
- `industryCorrect`: Industry questions correct
- `areaCorrect`: Area questions correct
- `status`: IN_PROGRESS, COMPLETED, ABANDONED

---

### 2. Untimed Tests

#### Test Attempt Level Metrics
**Stored in `UntimedTestAttempt` model:**
- **Test Identification:**
  - `id`: Unique attempt identifier
  - `studentId`: Student identifier
  - `category`: INDUSTRY_KNOWLEDGE or AREA_KNOWLEDGE
  - `questionCount`: Number of questions (5, 10, 15, etc.)
  - `state`: CREATED, IN_PROGRESS, COMPLETED

- **Score Metrics:**
  - `score`: Percentage score (0-100)
  - `correctAnswers`: Number of correct answers
  - `totalAnswered`: Total questions answered

- **Time Metrics:**
  - `createdAt`: Test creation timestamp
  - `startedAt`: When first question was answered
  - `completedAt`: When test was completed
  - `lastQuestionAt`: Last question answered timestamp
  - `expiresAt`: Expiration time for CREATED state (24h)

#### Question Level Metrics (TestQuestion)
**Stored in `TestQuestion` model:**
- `id`: Test question identifier
- `testAttemptId`: Parent test attempt
- `questionId`: Source question reference
- `questionOrder`: Position in test (1, 2, 3...)
- `selectedAnswer`: Student's answer (A, B, C, D)
- `isCorrect`: Boolean indicating correctness
- `answeredAt`: Timestamp when answered
- `idempotencyKey`: UUID v4 for idempotent submissions

---

### 3. Chapter Questions

#### Answer Level Metrics
**Stored in `Answer` model:**
- `id`: Answer identifier
- `studentId`: Student identifier
- `questionId`: Question identifier
- `selectedAnswer`: Student's selected option
- `isCorrect`: Boolean correctness
- `pointsEarned`: Points awarded (0 or question points)
- `answeredAt`: Timestamp of answer

#### Chapter Progress Metrics
**Stored in `ChapterProgress` model:**
- `id`: Progress identifier
- `studentId`: Student identifier
- `chapterId`: Chapter identifier
- `isCompleted`: Completion status
- `progressStatus`: NOT_STARTED, IN_PROGRESS, COMPLETED
- `progressPercent`: Progress percentage (0-100)
- `score`: Percentage score
- `totalQuestions`: Total questions in chapter
- `correctAnswers`: Correct answers count
- `timeSpentSeconds`: Time spent on chapter
- `startedAt`: Chapter start timestamp
- `completedAt`: Chapter completion timestamp
- `lastAccessed`: Last access timestamp
- `updatedAt`: Last update timestamp

---

### 4. Analytics & Activity Tracking

#### Question Attempt Tracking
**Stored in `QuestionAttempt` model:**
- `id`: Attempt identifier
- `studentId`: Student identifier
- `questionId`: Question identifier
- `chapterId`: Chapter identifier (if applicable)
- `topicId`: Topic identifier (if applicable)
- `attemptedAt`: Attempt timestamp
- `answerGiven`: Answer provided
- `isCorrect`: Correctness boolean
- `timeSpentSeconds`: Time spent on question
- `attemptNumber`: Sequential attempt number (1, 2, 3...)
- `testType`: 'timed', 'untimed', 'practice', 'chapter'

#### Student Activity Tracking
**Stored in `StudentActivity` model:**
- `id`: Activity identifier
- `studentId`: Student identifier
- `activityType`: LOGIN, LOGOUT, CHAPTER_VIEW, CHAPTER_COMPLETE, QUESTION_ATTEMPT, TEST_START, TEST_COMPLETE, SESSION_START, SESSION_END
- `timestamp`: Activity timestamp
- `duration`: Duration in seconds (for sessions)
- `metadata`: JSON context (chapter_id, question_id, test_id, etc.)

#### Daily Activity Aggregation
**Stored in `DailyActivity` model:**
- `id`: Daily activity identifier
- `studentId`: Student identifier
- `date`: Activity date
- `timeSpentSeconds`: Total time spent
- `questionsAttempted`: Questions attempted count
- `questionsCorrect`: Correct answers count
- `chaptersAccessed`: Array of chapter IDs accessed
- `testsAttempted`: Array of test IDs attempted
- `loginCount`: Number of logins
- `firstLoginAt`: First login timestamp
- `lastLogoutAt`: Last logout timestamp

#### Question Bank Statistics
**Stored in `QuestionBank` model:**
- `timesUsed`: How many times question has been used in tests
- `timesCorrect`: How many times question was answered correctly

---

## 🔍 Data Structure Analysis

### Current Data Flow

```
Test Start
  ↓
Question Display
  ↓
Answer Submission → TimedTestAnswer / TestQuestion / Answer
  ↓
Time Tracking → timeSpent (per question)
  ↓
Test Completion → TestSession / UntimedTestAttempt
  ↓
Score Calculation → score, scorePercentage, category breakdowns
  ↓
Analytics Tracking → TimedTestAttemptTracking / QuestionAttempt / StudentActivity
  ↓
Daily Aggregation → DailyActivity
```

### Missing Metrics & Gaps

1. **Per-Question Time Tracking:**
   - ✅ Collected for timed tests (`timeSpent` in `TimedTestAnswer`)
   - ❌ Not collected for untimed tests
   - ❌ Not collected for chapter questions (estimated at 40s)

2. **Answer Change Tracking:**
   - ✅ Modifications tracked in untimed tests (via `idempotencyKey`)
   - ❌ No history of answer changes
   - ❌ No count of how many times answer was changed

3. **Question Difficulty Performance:**
   - ✅ Question has `difficulty` field (easy, medium, hard)
   - ❌ Not tracked per student performance by difficulty
   - ❌ No difficulty-based analytics

4. **Time Distribution:**
   - ✅ Total time tracked
   - ❌ No breakdown of time spent per category
   - ❌ No analysis of time efficiency

5. **Question Flagging:**
   - ❌ **NOT IMPLEMENTED** - No way for students to flag questions for review

6. **Weak Question Identification:**
   - ✅ Can identify from `QuestionAttempt` (multiple attempts, low correctness)
   - ❌ No automated system to create tests from poorly answered questions

---

## 🚀 Recommended Improvements

### 1. Enhanced Time Tracking

#### Current State:
- Timed tests: Per-question time tracked
- Untimed tests: No per-question time
- Chapter questions: Estimated at 40 seconds

#### Recommended Improvements:

```typescript
// Add to TimedTestAnswer, TestQuestion, and Answer models:
- timeSpent: Int (already exists for TimedTestAnswer)
- timeToFirstAnswer: Int? // Time until first answer selected
- timeToFinalAnswer: Int? // Time until final answer (for changes)
- answerChanges: Int @default(0) // Number of times answer changed
- timeDistribution: Json? // Breakdown: { reading: 10, thinking: 20, answering: 10 }
```

**Benefits:**
- Identify questions that take too long
- Understand student thinking patterns
- Optimize test timing

---

### 2. Question Flagging System

#### Implementation Plan:

**Database Schema Addition:**
```prisma
model FlaggedQuestion {
  id            String   @id @default(cuid())
  studentId     String
  student       Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  questionId    String
  question      Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  chapterId     String?  // If flagged from chapter
  testSessionId String?  // If flagged from test
  reason        String?  // "difficult", "unclear", "review_later", "needs_explanation"
  notes         String?  // Student's personal notes
  flaggedAt     DateTime @default(now())
  reviewedAt    DateTime? // When student reviewed it
  isResolved    Boolean  @default(false) // Student marked as understood
  
  @@unique([studentId, questionId])
  @@index([studentId, isResolved])
  @@index([studentId, flaggedAt])
  @@map("flagged_questions")
}
```

**API Endpoints:**
```typescript
// POST /api/questions/[questionId]/flag
// DELETE /api/questions/[questionId]/flag
// GET /api/students/flagged-questions
// POST /api/questions/[questionId]/resolve-flag
```

**Features:**
- Flag questions from chapters or tests
- Add personal notes
- Filter flagged questions by reason
- Mark as resolved when understood
- Create custom tests from flagged questions

---

### 3. Weak Question Test Generation

#### Implementation Plan:

**Algorithm:**
```typescript
// Identify poorly answered questions
const weakQuestions = await prisma.questionAttempt.groupBy({
  by: ['questionId'],
  where: {
    studentId: studentId,
    isCorrect: false,
    // Or: attemptNumber > 1, // Questions requiring multiple attempts
  },
  _count: {
    id: true
  },
  having: {
    id: {
      _count: {
        gt: 1 // Attempted incorrectly more than once
      }
    }
  }
})

// Or based on percentage correctness
const lowAccuracyQuestions = await prisma.$queryRaw`
  SELECT qa.questionId, 
         COUNT(*) as attempts,
         SUM(CASE WHEN qa.isCorrect THEN 1 ELSE 0 END) as correct,
         (SUM(CASE WHEN qa.isCorrect THEN 1 ELSE 0 END)::float / COUNT(*)::float * 100) as accuracy
  FROM question_attempts qa
  WHERE qa.studentId = ${studentId}
  GROUP BY qa.questionId
  HAVING (SUM(CASE WHEN qa.isCorrect THEN 1 ELSE 0 END)::float / COUNT(*)::float * 100) < 50
  ORDER BY accuracy ASC
`
```

**API Endpoint:**
```typescript
// POST /api/tests/generate-weak-questions
// Query params: questionCount, category (optional), difficulty (optional)
// Returns: UntimedTestAttempt with questions from weak areas
```

**Features:**
- Generate tests from incorrectly answered questions
- Filter by category (Industry/Area)
- Filter by difficulty level
- Include flagged questions
- Track improvement over time

---

### 4. Enhanced Analytics Metrics

#### Additional Metrics to Track:

**1. Question Performance Metrics:**
```typescript
interface QuestionPerformance {
  questionId: string
  totalAttempts: number
  correctAttempts: number
  accuracy: number
  averageTimeSpent: number
  firstTryCorrect: boolean
  attemptsToMaster: number // How many attempts until consistently correct
  lastAttempted: Date
  difficultyRating: number // Student's personal difficulty (1-5)
}
```

**2. Category Performance Breakdown:**
```typescript
interface CategoryPerformance {
  category: string
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  averageTimeSpent: number
  improvementTrend: number[] // Accuracy over time
  weakSubtopics: string[] // Areas within category needing work
}
```

**3. Time Efficiency Metrics:**
```typescript
interface TimeEfficiency {
  averageTimePerQuestion: number
  timePerCategory: Record<string, number>
  timeDistribution: {
    reading: number
    thinking: number
    answering: number
  }
  speedImprovement: number // % improvement in speed over time
  optimalTimeRange: { min: number, max: number }
}
```

**4. Learning Curve Metrics:**
```typescript
interface LearningCurve {
  testNumber: number
  score: number
  date: Date
  categoryBreakdown: Record<string, number>
  timeEfficiency: number
  questionsCorrect: number
  improvementRate: number // Rate of improvement
  consistency: number // Score variance
}
```

**5. Weak Area Identification:**
```typescript
interface WeakArea {
  category: string
  subtopic?: string
  questionIds: string[]
  accuracy: number
  averageAttempts: number
  lastPracticed: Date
  recommendedAction: string
  priority: 'high' | 'medium' | 'low'
}
```

---

### 5. Student-Facing Metrics Dashboard

#### Recommended Metrics to Display:

**1. Test Performance Overview:**
- Overall test score trend
- Category performance comparison (Industry vs Area)
- Best and worst performing categories
- Test frequency and consistency
- Improvement rate over time

**2. Question-Level Insights:**
- Most challenging questions (multiple attempts)
- Questions never answered correctly
- Questions mastered (first-try correct)
- Flagged questions count
- Questions needing review

**3. Time Analytics:**
- Average time per question
- Time spent per category
- Time efficiency trends
- Optimal pacing recommendations

**4. Weak Areas:**
- Categories with <70% accuracy
- Subtopics needing attention
- Questions requiring multiple attempts
- Recommended focus areas

**5. Strengths:**
- Categories with >80% accuracy
- Consistently correct questions
- Fast response times
- Mastered topics

**6. Recommendations:**
- Personalized study suggestions
- Focus areas for improvement
- Practice test recommendations
- Review flagged questions

---

## 📈 Implementation Roadmap

### Phase 1: Question Flagging (High Priority)
1. Add `FlaggedQuestion` model to schema
2. Create migration
3. Implement flag/unflag API endpoints
4. Add UI components for flagging
5. Create flagged questions review page
6. Add flag count to analytics

**Estimated Time:** 2-3 days

### Phase 2: Weak Question Test Generation (High Priority)
1. Create algorithm to identify weak questions
2. Implement test generation API
3. Add UI for generating weak question tests
4. Track improvement metrics
5. Add to analytics dashboard

**Estimated Time:** 3-4 days

### Phase 3: Enhanced Time Tracking (Medium Priority)
1. Add time tracking to untimed tests
2. Implement per-question time capture
3. Add time distribution analysis
4. Create time efficiency metrics
5. Display in analytics dashboard

**Estimated Time:** 2-3 days

### Phase 4: Advanced Analytics (Medium Priority)
1. Implement question performance metrics
2. Add category performance breakdown
3. Create learning curve visualization
4. Build weak area identification system
5. Add personalized recommendations

**Estimated Time:** 4-5 days

### Phase 5: Student Dashboard Enhancements (Low Priority)
1. Redesign analytics dashboard
2. Add interactive charts and graphs
3. Implement filtering and sorting
4. Add export functionality
5. Create study plan recommendations

**Estimated Time:** 5-7 days

---

## 🎯 Use Cases

### Use Case 1: Student Flags Difficult Question
```
1. Student encounters difficult question in chapter
2. Clicks "Flag for Review" button
3. Optionally adds note: "Need to understand taxi regulations better"
4. Question added to flagged list
5. Student can later:
   - Review all flagged questions
   - Create practice test from flagged questions
   - Mark as resolved when understood
```

### Use Case 2: Generate Test from Weak Questions
```
1. Student views analytics dashboard
2. Sees "Weak Areas" section showing 15 questions with <50% accuracy
3. Clicks "Practice Weak Questions" button
4. System generates untimed test with:
   - 10 questions from weak areas
   - Mix of Industry and Area knowledge
   - Questions never answered correctly
5. Student takes test and improves
6. System tracks improvement and updates analytics
```

### Use Case 3: Track Improvement Over Time
```
1. Student takes multiple tests
2. System tracks:
   - Score trends
   - Category performance
   - Time efficiency
   - Question mastery
3. Dashboard shows:
   - "Your Industry Knowledge improved 15% this month"
   - "You're 20% faster at answering questions"
   - "You've mastered 45 new questions"
```

---

## 🔧 Technical Implementation Notes

### Database Queries for Weak Questions

```typescript
// Find questions with low accuracy
const weakQuestions = await prisma.$queryRaw`
  SELECT 
    qa.questionId,
    q.questionText,
    q.category,
    COUNT(*) as totalAttempts,
    SUM(CASE WHEN qa.isCorrect THEN 1 ELSE 0 END) as correctAttempts,
    (SUM(CASE WHEN qa.isCorrect THEN 1 ELSE 0 END)::float / COUNT(*)::float * 100) as accuracy,
    AVG(qa.timeSpentSeconds) as avgTimeSpent
  FROM question_attempts qa
  JOIN questions q ON qa.questionId = q.id
  WHERE qa.studentId = ${studentId}
  GROUP BY qa.questionId, q.questionText, q.category
  HAVING (SUM(CASE WHEN qa.isCorrect THEN 1 ELSE 0 END)::float / COUNT(*)::float * 100) < 70
  ORDER BY accuracy ASC, totalAttempts DESC
  LIMIT ${questionCount}
`
```

### Flagged Questions Query

```typescript
// Get all flagged questions for a student
const flaggedQuestions = await prisma.flaggedQuestion.findMany({
  where: {
    studentId: studentId,
    isResolved: false
  },
  include: {
    question: {
      include: {
        chapter: true
      }
    }
  },
  orderBy: {
    flaggedAt: 'desc'
  }
})
```

### Test Generation Logic

```typescript
async function generateWeakQuestionTest(
  studentId: string,
  questionCount: number,
  category?: QuestionCategory
) {
  // Get weak questions
  const weakQuestions = await getWeakQuestions(studentId, category)
  
  // Get flagged questions
  const flaggedQuestions = await prisma.flaggedQuestion.findMany({
    where: {
      studentId,
      isResolved: false
    },
    select: { questionId: true }
  })
  
  // Combine and deduplicate
  const questionIds = [
    ...weakQuestions.map(q => q.questionId),
    ...flaggedQuestions.map(f => f.questionId)
  ]
  
  // Shuffle and select
  const selectedQuestions = shuffle(questionIds).slice(0, questionCount)
  
  // Create untimed test
  const testAttempt = await prisma.untimedTestAttempt.create({
    data: {
      studentId,
      category: category || 'INDUSTRY_KNOWLEDGE',
      questionCount: selectedQuestions.length,
      testQuestions: {
        create: selectedQuestions.map((qId, index) => ({
          questionId: qId,
          questionOrder: index + 1
        }))
      }
    }
  })
  
  return testAttempt
}
```

---

## 📊 Metrics Summary Table

| Metric Category | Timed Tests | Untimed Tests | Chapter Questions | Analytics |
|----------------|-------------|---------------|-------------------|-----------|
| **Score** | ✅ | ✅ | ✅ | ✅ |
| **Percentage** | ✅ | ✅ | ✅ | ✅ |
| **Category Breakdown** | ✅ | ✅ | ✅ | ✅ |
| **Per-Question Time** | ✅ | ❌ | ❌ (estimated) | ❌ |
| **Answer Changes** | ❌ | ✅ (via idempotency) | ❌ | ❌ |
| **Attempt Number** | ✅ | ❌ | ✅ | ✅ |
| **Time Distribution** | ❌ | ❌ | ❌ | ❌ |
| **Question Flagging** | ❌ | ❌ | ❌ | ❌ |
| **Difficulty Performance** | ❌ | ❌ | ❌ | ❌ |
| **Learning Curve** | ✅ | ✅ | ❌ | ✅ |
| **Weak Area Identification** | ✅ | ✅ | ✅ | ✅ |
| **Daily Aggregation** | ✅ | ✅ | ✅ | ✅ |

---

## 🎓 Student Benefits

### Current Benefits:
1. **Performance Tracking:** See scores and progress over time
2. **Category Analysis:** Understand strengths and weaknesses
3. **Test History:** Review past test attempts
4. **Activity Tracking:** Monitor study time and frequency

### With Recommended Improvements:
1. **Targeted Practice:** Focus on weak areas automatically
2. **Question Review:** Flag and revisit difficult questions
3. **Time Optimization:** Understand pacing and efficiency
4. **Personalized Learning:** Get recommendations based on performance
5. **Mastery Tracking:** See which questions are mastered
6. **Study Planning:** Get actionable study recommendations

---

## 📝 Conclusion

The current system collects comprehensive metrics for test performance, but there are opportunities to enhance the learning experience through:

1. **Question Flagging:** Allow students to mark questions for later review
2. **Weak Question Tests:** Automatically generate practice tests from poorly answered questions
3. **Enhanced Time Tracking:** Better understand student pacing and efficiency
4. **Advanced Analytics:** Provide deeper insights into learning patterns
5. **Personalized Recommendations:** Guide students to focus on areas needing improvement

These improvements will help students:
- Identify and focus on weak areas
- Review difficult questions systematically
- Track improvement more effectively
- Optimize study time
- Prepare more efficiently for exams

---

## 🔗 Related Documentation

- `TIMED_TESTS_ANALYTICS_README.md` - Timed tests analytics implementation
- `UNTIMED_TESTS_BUILD_SPEC.md` - Untimed tests specification
- `STUDENT_PROFILE_ANALYTICS_README.md` - Student analytics overview
- `ADVANCED_ANALYTICS_COMPLETE.md` - Advanced analytics features

---

**Last Updated:** January 2025
**Version:** 1.0
