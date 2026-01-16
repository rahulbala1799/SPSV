# UI/UX Design Specification for SPSV Official Manual Page

## Overview

The SPSV Official Manual page will be a comprehensive, interactive learning platform with collapsible chapters and integrated multiple choice questions.

---

## Core Requirements

- ✅ Each chapter as a collapsible section
- ✅ 4 multiple choice questions per chapter
- ✅ Questions related to chapter content
- ✅ Access any chapter at any time
- ✅ Progress persists on page refresh (localStorage)
- ✅ Progress resets when navigating away (acceptable)

---

## Component Architecture

### 1. Main Page Component (`src/app/spsv-manual/page.tsx`)

```typescript
Features:
- Hero section with title and PDF download
- Table of Contents (sticky sidebar or top navigation)
- Chapter sections (collapsible)
- Progress indicator
- Search functionality
```

### 2. Chapter Component (`src/components/manual/ChapterSection.tsx`)

```typescript
Props:
- chapterId: string
- title: string
- pageRange: { start: number, end: number }
- content: string[]
- questions: Question[]

Features:
- Collapsible/expandable section
- Smooth scroll to chapter
- Content display with proper formatting
- Question section at bottom
- Progress tracking
```

### 3. Question Component (`src/components/manual/ChapterQuestions.tsx`)

```typescript
Props:
- chapterId: string
- questions: Question[]
- onAnswer: (chapterId, questionId, answer) => void

Features:
- 4 multiple choice questions
- Radio button selection
- Immediate feedback (optional or on submit)
- Answer persistence
- Score display
```

### 4. Progress Tracker (`src/components/manual/ProgressTracker.tsx`)

```typescript
Features:
- Overall progress percentage
- Chapters completed indicator
- Questions answered count
- Visual progress bar
```

---

## User Experience Flow

### Initial Page Load:
1. User lands on `/spsv-manual`
2. All chapters are collapsed by default
3. Table of Contents shows all chapters
4. Progress loaded from localStorage (if exists)
5. Previously answered questions show user's selections

### Interacting with Chapters:
1. User clicks on a chapter in TOC or expands a chapter section
2. Chapter smoothly scrolls into view and expands
3. User reads chapter content
4. User scrolls to bottom of chapter
5. User sees 4 multiple choice questions
6. User selects answers
7. Answers are saved to localStorage immediately
8. User can see which questions they've answered

### Navigation:
- User can jump to any chapter via TOC
- User can expand/collapse chapters independently
- User can search for specific content
- User can download PDF

### Refresh Behavior:
- **On page refresh**: All progress (answered questions) persists
- Chapter expansion state can be remembered or reset
- Answers remain visible
- Progress tracker shows current status

### Navigation Away:
- **When user navigates to different page**: Progress is cleared
- This is acceptable behavior per requirements
- On return, user starts fresh (or we can keep it - to be decided)

---

## State Management Strategy

### Local Storage Schema:

```typescript
interface ManualProgress {
  version: string; // For future updates
  timestamp: number;
  chapters: {
    [chapterId: string]: {
      expanded: boolean;
      questions: {
        [questionId: string]: {
          selectedAnswer: string;
          answeredAt: number;
          isCorrect?: boolean; // If we show immediate feedback
        }
      }
    }
  }
}
```

### React State:

```typescript
- Chapter expansion state (can sync with localStorage)
- Current search query
- Active chapter (for highlighting)
- Question answers (synced with localStorage)
```

---

## Question Format & Structure

### Question Data Model:

```typescript
interface Question {
  id: string; // Unique identifier
  chapterId: string;
  questionNumber: number; // 1-4
  question: string;
  options: {
    id: string;
    label: string;
  }[];
  correctAnswer: string; // ID of correct option
  explanation?: string; // Optional explanation shown after answering
  relatedPage?: number; // Page number where answer can be found
}
```

### Question Display:

```
┌─────────────────────────────────────────┐
│ Chapter 1: The SPSV Industry            │
│ [Content...]                            │
│                                         │
│ ─────────────────────────────────────  │
│ Test Your Knowledge                     │
│                                         │
│ Question 1 of 4                        │
│ What is the main role of the NTA?      │
│ ○ Option A                              │
│ ○ Option B                              │
│ ○ Option C                              │
│ ○ Option D                              │
│                                         │
│ [Previous] [Next] [Submit Answers]      │
│                                         │
│ Progress: 2/4 answered                  │
└─────────────────────────────────────────┘
```

---

## Visual Design Specifications

### Chapter Section:

- **Header**: 
  - Chapter title
  - Page range indicator
  - Expand/collapse icon
  - Progress indicator (X/4 questions answered)
  
- **Content Area**:
  - Formatted text with proper typography
  - Page number references
  - Images/diagrams if present
  - Print-friendly styling

- **Question Section**:
  - Clear separation from content
  - Numbered questions (1-4)
  - Radio button inputs
  - Submit/Check Answers button
  - Results display (if showing feedback)

### Color Scheme:

- **Chapter Header**: Green gradient (matching site theme)
- **Active Chapter**: Highlighted border
- **Answered Questions**: Green checkmark or indicator
- **Unanswered Questions**: Gray/neutral
- **Correct Answer**: Green highlight
- **Incorrect Answer**: Red highlight (if showing feedback)

### Responsive Design:

- **Desktop**: 
  - Sidebar TOC (sticky)
  - Full-width content
  - Questions inline with chapter
  
- **Tablet**:
  - Collapsible TOC
  - Full-width content
  - Questions below content
  
- **Mobile**:
  - Hamburger menu for TOC
  - Stacked layout
  - Questions in separate section

---

## Question Generation Strategy

### For Each Chapter:

1. **Analyze Content**: Review chapter content to identify key concepts
2. **Create Questions**: Generate 4 questions covering:
   - Key definitions (1 question)
   - Important regulations/rules (1 question)
   - Practical application (1 question)
   - Critical information (1 question)

3. **Question Types**:
   - Multiple choice (4 options)
   - One correct answer
   - Clear, unambiguous questions
   - Options should be plausible but distinct

### Example Questions for Chapter 1:

```
Q1: What does SPSV stand for?
A) Small Public Service Vehicle
B) Special Public Service Vehicle
C) Standard Public Service Vehicle
D) State Public Service Vehicle
Correct: A

Q2: Which organization is responsible for SPSV licensing?
A) Road Safety Authority
B) National Transport Authority
C) Department of Transport
D) Local Authorities
Correct: B

Q3: How many categories of SPSV are there?
A) 4
B) 5
C) 6
D) 7
Correct: C

Q4: What is the maximum passenger capacity (excluding driver) for an SPSV?
A) 6 passengers
B) 8 passengers
C) 10 passengers
D) 12 passengers
Correct: B
```

---

## Implementation Details

### localStorage Key:

```javascript
const STORAGE_KEY = 'spsv-manual-progress-v1';
```

### Persistence Logic:

```typescript
// Save progress
const saveProgress = (chapterId: string, questionId: string, answer: string) => {
  const progress = getProgress();
  if (!progress.chapters[chapterId]) {
    progress.chapters[chapterId] = { expanded: false, questions: {} };
  }
  progress.chapters[chapterId].questions[questionId] = {
    selectedAnswer: answer,
    answeredAt: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

// Load progress
const loadProgress = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : { chapters: {} };
};

// Clear on navigation (optional)
// Can be done in useEffect cleanup or on route change
```

### Chapter Expansion State:

```typescript
// Option 1: Remember expansion state
const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
  () => loadExpandedChapters()
);

// Option 2: Reset on load (simpler)
const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
```

---

## Features to Implement

### Phase 1: Core Functionality
- [ ] Chapter collapsible sections
- [ ] Content display with formatting
- [ ] 4 questions per chapter
- [ ] Answer selection (radio buttons)
- [ ] localStorage persistence
- [ ] Progress tracking

### Phase 2: Enhanced UX
- [ ] Table of Contents with navigation
- [ ] Search functionality
- [ ] Progress indicator/bar
- [ ] Chapter completion badges
- [ ] Smooth scrolling
- [ ] Print-friendly CSS

### Phase 3: Advanced Features
- [ ] Immediate feedback on answers (optional)
- [ ] Explanation for correct answers
- [ ] Related page references
- [ ] Bookmarking favorite chapters
- [ ] Export progress report
- [ ] PDF download integration

---

## Accessibility Considerations

- **Keyboard Navigation**: 
  - Tab through chapters
  - Enter/Space to expand/collapse
  - Arrow keys for question navigation
  
- **Screen Readers**:
  - Proper ARIA labels
  - Announce question numbers
  - Announce progress
  
- **Focus Management**:
  - Visible focus indicators
  - Logical tab order
  - Skip to content links

---

## Performance Optimization

- **Lazy Loading**: Load chapter content on expand
- **Virtual Scrolling**: For long chapters (if needed)
- **Code Splitting**: Separate bundle for manual page
- **Image Optimization**: Optimize any diagrams/images
- **Debounced Search**: Prevent excessive re-renders

---

## Testing Considerations

- **Unit Tests**:
  - Question component rendering
  - Answer selection logic
  - Progress persistence
  
- **Integration Tests**:
  - Chapter expansion/collapse
  - Navigation between chapters
  - localStorage operations
  
- **E2E Tests**:
  - Complete user flow
  - Progress persistence across refresh
  - Question answering workflow

---

## Future Enhancements (Optional)

- **User Accounts**: Save progress to database
- **Analytics**: Track which chapters are most viewed
- **Comments/Notes**: Allow users to add personal notes
- **Study Mode**: Hide answers until ready
- **Timed Tests**: Add time limits for questions
- **Certificates**: Generate completion certificates

---

**Status**: Design Phase Complete - Ready for Implementation
**Last Updated**: January 2024
**Next Steps**: 
1. Create component structure
2. Implement chapter sections
3. Add question components
4. Integrate localStorage
5. Test persistence behavior
