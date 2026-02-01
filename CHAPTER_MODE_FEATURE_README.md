# Chapter Mode Feature - Implementation Guide

## Overview

Chapter Mode is a new learning-focused section that appears in each chapter page, providing students with an interactive way to study questions, answers, and explanations in a non-quiz format. This feature is designed to complement the existing MCQ quiz functionality by offering a more guided learning experience.

## Feature Goals

1. **Learning-Focused Experience**: Provide a study mode where students can learn at their own pace without the pressure of a quiz
2. **Mobile-First Design**: Ensure the UI is optimized for mobile devices with touch-friendly interactions
3. **Consistent UI**: Match the visual design and interaction patterns from the Analytics page within chapters
4. **Integrated Experience**: Seamlessly integrate into existing chapter pages above the MCQ building section
5. **Progress Tracking**: Track question attempts and answers just like in quiz mode for analytics consistency

## User Experience Flow

### Entry Point
- Chapter Mode appears as a dedicated section on each chapter page
- Positioned above the "How many questions would you like to answer?" MCQ building section
- Clearly labeled as "Chapter Mode" with a brief description

### Learning Flow
1. Student opens a chapter page
2. Sees Chapter Mode section at the top
3. Can browse through all questions in the chapter
4. Each question displays:
   - Full question text
   - All answer options
   - Correct answer (visible for learning)
   - Explanation/description (if available)
5. Student can select an answer to test their knowledge
6. Upon submission, the answer is validated and tracked
7. Progress is updated in real-time
8. Student can continue through questions at their own pace

## UI/UX Requirements

### Visual Design
- **Theme**: Match the Analytics page dark theme (slate-900 background, slate-800 cards)
- **Color Scheme**: Use the same emerald/cyan gradient accents as Analytics
- **Typography**: Consistent font sizes and weights with Analytics page
- **Spacing**: Mobile-friendly padding and margins (px-4, py-5 pattern)
- **Cards**: Rounded-2xl cards with backdrop blur effects similar to Analytics

### Component Structure
1. **Chapter Mode Header**
   - Section title: "Chapter Mode"
   - Brief description: "Study questions and answers at your own pace"
   - Visual indicator (icon or badge)

2. **Question Display**
   - Expandable card format (similar to Analytics)
   - Question number and status indicator
   - Full question text
   - All answer options displayed
   - Correct answer highlighted/visible
   - Explanation section (if available)
   - Flag button for questions
   - Submit/Check Answer button

3. **Navigation**
   - Scrollable list of all questions
   - Progress indicator (e.g., "Question 5 of 61")
   - Ability to jump to specific questions (optional)

4. **Answer Interaction**
   - Select answer option
   - Submit to check correctness
   - Visual feedback (green for correct, red for incorrect)
   - Show correct answer if wrong
   - Display explanation after answering

### Mobile Optimization
- Touch-friendly button sizes (minimum 44x44px)
- Swipe-friendly card interactions
- Optimized text sizes for mobile reading
- Smooth scrolling and animations
- Bottom padding to account for navigation bars

## Integration Points

### Chapter Page Structure
Each chapter page (e.g., `/dashboard/chapters/routes/page.tsx`) should have:

1. **Chapter Info Card** (existing)
2. **Chapter Mode Section** (NEW - positioned here)
   - Full question list with interactive learning
   - Scrollable, expandable question cards
3. **Question Count Selector** (existing - MCQ building section)
4. **Action Buttons** (existing)

### API Endpoints to Use

#### Fetch Questions
- **Endpoint**: `GET /api/chapters/[chapterId]/questions`
- **Purpose**: Load all questions for the chapter
- **Parameters**: 
  - `includeAnswers: true` (to show correct answers in learning mode)
- **Response**: Array of questions with options, correctAnswer, explanation

#### Submit Answer
- **Endpoint**: `POST /api/chapters/[chapterId]/questions/[questionId]/answer`
- **Purpose**: Track student's answer attempt
- **Body**: `{ selectedAnswer: "A" }`
- **Response**: 
  - `isCorrect: boolean`
  - `correctAnswer: string`
  - `explanation: string`
  - `chapterProgress: object`

#### Get Analytics (Optional)
- **Endpoint**: `GET /api/analytics/chapter/[chapterId]`
- **Purpose**: Show progress indicators and question status
- **Use Case**: Display which questions are mastered, need review, or not attempted

### Data Flow

1. **Initial Load**
   - Fetch all questions for the chapter
   - Fetch student's existing answers (if any)
   - Fetch analytics data (optional, for status indicators)
   - Fetch attempt statistics for each question (NEW - shows attempts across all contexts)
   - Display questions in Chapter Mode section with attempt statistics

2. **Answer Submission**
   - Student selects an answer
   - Submit to answer API endpoint
   - Receive feedback (correct/incorrect)
   - Update local state
   - Refresh analytics (optional, for status updates)
   - Track attempt in database (via existing answer endpoint)
   - Refresh attempt statistics (NEW - update cross-context attempt counts)

3. **Progress Tracking**
   - Each answer submission creates/updates an Answer record
   - ChapterProgress is automatically updated
   - QuestionAttempt is tracked for analytics (with testType: 'chapter')
   - Achievements are checked (via existing system)
   - Attempt statistics are updated across all contexts

## Key Implementation Considerations

### Question Display Logic
- Show all questions in order (by questionNumber)
- Display correct answer immediately (learning mode, not quiz)
- Show explanation after student submits their answer
- Allow students to see correct answer even before answering (learning mode)

### Answer Tracking
- Use the same answer submission endpoint as quiz mode
- This ensures consistency in progress tracking
- Answers are stored in the `Answer` table
- Chapter progress is updated automatically
- Analytics remain consistent across quiz and Chapter Mode

### State Management
- Load all questions upfront (like Analytics page does)
- Store questions in local state
- Track which questions are expanded
- Track which questions have been answered in this session
- Track flagged questions

### Performance
- Preload all questions at once (similar to Analytics implementation)
- Lazy load question details if needed
- Optimize re-renders with proper React patterns
- Consider pagination for chapters with many questions (if >100)

### Accessibility
- Proper ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly
- Focus management for expanded questions

## UI Components Needed

### New Components
1. **ChapterModeSection** - Main container component
   - Props: `chapterId`, `chapterTitle`, `chapterSlug`
   - Handles question loading and display
   - Manages answer submissions

2. **ChapterModeQuestionCard** - Individual question card
   - Props: `question`, `onAnswer`, `isExpanded`, `onToggleExpand`
   - Displays question, options, answer, explanation
   - Handles answer selection and submission

### Reusable Components
- Can leverage existing components from Analytics if possible
- Flag button component (if exists)
- Status indicators (mastered, needs review, not attempted)

## Integration with Existing Features

### Analytics Integration
- Chapter Mode answers should appear in Analytics
- Question status should update in real-time
- Progress percentages should reflect Chapter Mode attempts

### Achievement System
- Chapter Mode answers should trigger achievement checks
- Points should be awarded for correct answers
- Streaks and daily activities should be tracked

### Flagging System
- Students can flag questions from Chapter Mode
- Flagged questions should sync with existing flagging system
- Flag status should be visible in Chapter Mode

### Progress Tracking
- Chapter progress should update when answers are submitted
- Completion status should reflect Chapter Mode progress
- Score calculations should include Chapter Mode attempts

## Question Attempt Tracking Across All Contexts

### Overview
The application uses a unified `QuestionAttempt` table to track all question attempts across different contexts (Chapter Quiz, Assigned Tests, Untimed Tests, and Timed Tests). This allows for comprehensive analytics showing how many times a question has been attempted and whether it has been learned.

### Question ID Consistency
**✅ Verified**: All questions use a consistent unique ID system:
- **Chapter Questions**: Use `Question` table with unique `id` field
- **Untimed Test Questions**: Reference the same `Question` table via `questionId`
- **Assigned Test Questions**: Reference the same `Question` table via `questionId`
- **Timed Test Questions**: Use `QuestionBank` table which has `sourceQuestionId` field linking back to the original `Question.id`

This means every question can be uniquely identified across all contexts using the `Question.id` field.

### QuestionAttempt Table Structure
The `QuestionAttempt` table tracks:
- `questionId`: The unique question ID (references Question.id)
- `studentId`: The student who attempted the question
- `testType`: Context where question was attempted ('chapter', 'untimed', 'assigned', 'timed', 'practice')
- `attemptNumber`: Sequential attempt number for this question
- `isCorrect`: Whether the answer was correct
- `answerGiven`: The answer option selected
- `attemptedAt`: Timestamp of the attempt
- `timeSpentSeconds`: Time spent on the question
- `chapterId`: Optional chapter context

### Current Tracking Status

#### ✅ Already Implemented
1. **Chapter Quiz Answers**
   - **Location**: `src/app/api/chapters/[chapterId]/questions/[questionId]/answer/route.ts`
   - **Status**: ✅ Fully implemented
   - **Test Type**: `'chapter'`
   - **Implementation**: Calls `trackQuestionAttempt()` after answer submission

2. **Untimed Test Answers**
   - **Location**: `src/app/api/tests/untimed/[id]/answer/route.ts`
   - **Status**: ✅ Fully implemented
   - **Test Type**: `'untimed'`
   - **Implementation**: Calls `trackQuestionAttempt()` after answer submission

#### ⚠️ Needs Implementation
3. **Assigned Test Answers**
   - **Location**: `src/app/api/student/assigned-tests/[id]/submit/route.ts`
   - **Status**: ⚠️ NOT currently tracking in QuestionAttempt
   - **Test Type**: Should be `'assigned'`
   - **Current Behavior**: Only saves to `AssignedTestAnswer` table
   - **Required Action**: Add `trackQuestionAttempt()` calls for each answer in the submission

4. **Timed Test Answers**
   - **Location**: `src/app/api/tests/sessions/[sessionId]/answer/route.ts`
   - **Status**: ⚠️ NOT currently tracking in QuestionAttempt
   - **Test Type**: Should be `'timed'`
   - **Current Behavior**: Only saves to `TimedTestAnswer` table
   - **Required Action**: Add `trackQuestionAttempt()` calls using `sourceQuestionId` from QuestionBank

### Displaying Attempt Statistics in Chapter Mode

#### API Endpoint Needed
Create a new endpoint or extend existing analytics endpoint to provide question attempt statistics:

**Endpoint**: `GET /api/questions/[questionId]/attempt-stats`

**Response Format**:
```json
{
  "questionId": "question_123",
  "totalAttempts": 15,
  "correctAttempts": 12,
  "incorrectAttempts": 3,
  "successRate": 80,
  "attemptsByContext": {
    "chapter": { "total": 8, "correct": 7, "incorrect": 1 },
    "untimed": { "total": 4, "correct": 3, "incorrect": 1 },
    "assigned": { "total": 2, "correct": 1, "incorrect": 1 },
    "timed": { "total": 1, "correct": 1, "incorrect": 0 }
  },
  "latestAttempt": {
    "attemptedAt": "2024-01-15T10:30:00Z",
    "isCorrect": true,
    "testType": "chapter"
  },
  "isLearned": true, // Based on recent success rate (e.g., last 3 attempts correct)
  "firstAttemptedAt": "2024-01-10T08:00:00Z",
  "lastCorrectAt": "2024-01-15T10:30:00Z"
}
```

#### Implementation Query
```typescript
// Get all attempts for a question across all contexts
const attempts = await prisma.questionAttempt.findMany({
  where: { 
    studentId: student.id,
    questionId: questionId 
  },
  orderBy: { attemptedAt: 'desc' }
})

// Group by testType
const attemptsByContext = attempts.reduce((acc, attempt) => {
  const type = attempt.testType || 'unknown'
  if (!acc[type]) {
    acc[type] = { total: 0, correct: 0, incorrect: 0 }
  }
  acc[type].total++
  if (attempt.isCorrect) {
    acc[type].correct++
  } else {
    acc[type].incorrect++
  }
  return acc
}, {})

// Calculate learning status (learned if last 3 attempts are correct)
const recentAttempts = attempts.slice(0, 3)
const isLearned = recentAttempts.length >= 3 && 
  recentAttempts.every(a => a.isCorrect)
```

### UI Display in Chapter Mode

Each question card should display:

1. **Attempt Statistics Badge**
   - Total attempts: "Attempted 15 times"
   - Success rate: "80% success rate"
   - Context breakdown: "8 in chapters, 4 in tests, 2 in assigned, 1 in timed"

2. **Learning Status Indicator**
   - 🟢 "Learned" - Last 3 attempts correct
   - 🟡 "Practicing" - Some recent attempts incorrect
   - ⚪ "New" - Not attempted yet

3. **Latest Attempt Info**
   - "Last attempted: 2 days ago"
   - "Last result: ✓ Correct" or "✗ Incorrect"

4. **Context Icons**
   - Show icons for each context where question was attempted
   - Color-coded by success rate in that context

### Implementation Requirements

#### For Chapter Mode Feature
1. **Fetch Attempt Statistics**
   - Call the attempt stats API for each question
   - Display statistics in question cards
   - Update statistics after each answer submission

2. **Track Chapter Mode Attempts**
   - Use `testType: 'chapter'` when tracking Chapter Mode answers
   - This ensures Chapter Mode attempts are included in statistics

#### For Complete System (Future Work)
1. **Add Tracking to Assigned Tests**
   - Modify `src/app/api/student/assigned-tests/[id]/submit/route.ts`
   - After saving `AssignedTestAnswer`, call `trackQuestionAttempt()` for each answer
   - Use `testType: 'assigned'`

2. **Add Tracking to Timed Tests**
   - Modify `src/app/api/tests/sessions/[sessionId]/answer/route.ts`
   - After saving `TimedTestAnswer`, look up `sourceQuestionId` from `QuestionBank`
   - Call `trackQuestionAttempt()` with the `sourceQuestionId`
   - Use `testType: 'timed'`

3. **Create Attempt Stats API**
   - New endpoint: `GET /api/questions/[questionId]/attempt-stats`
   - Aggregate data from `QuestionAttempt` table
   - Calculate learning status based on recent attempts
   - Return formatted statistics

### Benefits of Unified Tracking

1. **Comprehensive Analytics**: See all attempts across all contexts in one place
2. **Learning Status**: Determine if a question has been "learned" based on recent performance
3. **Context Awareness**: Understand which contexts (chapters vs tests) are more challenging
4. **Progress Tracking**: Track improvement over time regardless of where question was attempted
5. **Personalized Learning**: Identify questions that need more practice based on cross-context performance

### Data Consistency Notes

- **Question IDs are consistent**: All contexts reference the same `Question.id`
- **Timed tests use QuestionBank**: Must use `sourceQuestionId` to link back to original question
- **Multiple attempts allowed**: `QuestionAttempt` tracks every attempt, not just latest
- **Answer table is different**: `Answer` table stores latest answer per question, `QuestionAttempt` stores all attempts

## Technical Architecture

### Component Location
- New component: `src/components/chapters/ChapterModeSection.tsx`
- Or integrate directly into chapter page components

### Styling Approach
- Use Tailwind CSS classes matching Analytics page
- Dark theme: `bg-slate-900`, `bg-slate-800`, `text-white`
- Accent colors: `emerald-500`, `cyan-500`
- Card styling: `rounded-2xl`, `backdrop-blur`, `border-slate-700`

### State Management
- Use React hooks (useState, useEffect)
- Fetch questions on component mount
- Manage expanded question state
- Track answer submissions locally

### Error Handling
- Handle API errors gracefully
- Show loading states
- Display error messages if question loading fails
- Retry logic for failed submissions

## Testing Considerations

### Functional Testing
- Verify all questions load correctly
- Test answer submission flow
- Verify progress tracking updates
- Test flagging functionality
- Verify analytics integration

### UI/UX Testing
- Test on mobile devices (various screen sizes)
- Verify touch interactions
- Test scrolling performance with many questions
- Verify animations and transitions
- Test accessibility features

### Edge Cases
- Empty chapters (no questions)
- Chapters with single question
- Very long question text
- Missing explanations
- Network failures during submission

## Success Metrics

### User Engagement
- Number of questions viewed in Chapter Mode
- Time spent in Chapter Mode
- Completion rate of chapters via Chapter Mode

### Learning Effectiveness
- Improvement in quiz scores after using Chapter Mode
- Reduction in incorrect answers in subsequent attempts
- Increase in questions mastered

### Technical Performance
- Page load time
- Answer submission response time
- Smooth scrolling performance

## Future Enhancements (Optional)

1. **Bookmarking**: Allow students to bookmark specific questions
2. **Notes**: Let students add personal notes to questions
3. **Review Mode**: Filter to show only questions needing review
4. **Search**: Search questions by text
5. **Offline Support**: Cache questions for offline access
6. **Study Reminders**: Notifications for questions needing review

## Implementation Checklist

### Phase 1: Core Functionality
- [ ] Create ChapterModeSection component
- [ ] Implement question loading from API
- [ ] Display questions in card format
- [ ] Implement answer selection
- [ ] Integrate answer submission API
- [ ] Show correct/incorrect feedback
- [ ] Display explanations
- [ ] Create attempt statistics API endpoint (or extend existing)
- [ ] Fetch and display attempt statistics for each question
- [ ] Show learning status indicators (learned/practicing/new)

### Phase 2: UI/UX Polish
- [ ] Match Analytics page styling
- [ ] Implement expandable question cards
- [ ] Add status indicators
- [ ] Add attempt statistics badges (total attempts, success rate)
- [ ] Display context breakdown (chapters/tests/assigned/timed)
- [ ] Show learning status with visual indicators
- [ ] Implement flagging functionality
- [ ] Add progress indicators
- [ ] Optimize for mobile

### Phase 3: Integration
- [ ] Integrate into all chapter pages
- [ ] Verify analytics integration
- [ ] Test achievement system
- [ ] Verify progress tracking
- [ ] Test with all chapter types

### Phase 4: Testing & Refinement
- [ ] Cross-device testing
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] User acceptance testing
- [ ] Bug fixes and refinements

## Notes

- This feature should feel like a natural extension of the Analytics page
- The learning experience should be stress-free (no timer, no score pressure)
- All attempts should be tracked for consistency with existing systems
- The UI should be visually consistent with the rest of the application
- Mobile experience is critical - most users will access this on mobile devices

## Related Documentation

- `ANALYTICS_LEADERBOARDS_README.md` - Analytics system overview
- `MCQ_CHAPTER_IMPLEMENTATION.md` - Quiz implementation details
- `QUESTION_FLAGGING_FEATURE_README.md` - Flagging system
- `MOTIVATION_SYSTEM_COMPLETE.md` - Points and achievements
- `STUDENT_PROFILE_ANALYTICS_README.md` - Question attempt tracking system

## Additional Implementation Notes

### Completing Question Attempt Tracking System

To fully implement cross-context attempt tracking, the following work is needed:

1. **Assigned Tests Tracking** (Priority: Medium)
   - Add `trackQuestionAttempt()` calls in assigned test submission
   - Ensure each answer in assigned test is tracked
   - Use `testType: 'assigned'`

2. **Timed Tests Tracking** (Priority: Medium)
   - Add `trackQuestionAttempt()` calls in timed test answer submission
   - Map `QuestionBank.sourceQuestionId` to `Question.id`
   - Use `testType: 'timed'`

3. **Attempt Statistics API** (Priority: High for Chapter Mode)
   - Create endpoint to aggregate attempt data
   - Calculate learning status
   - Return formatted statistics for UI display

These implementations are not required for Chapter Mode to function, but will enhance the attempt statistics display and provide a complete cross-context tracking system.
