# Student Profile Analytics - Implementation Guide

## Overview

This document outlines the implementation of a comprehensive student analytics and progress tracking system for the admin panel. Admins will be able to view detailed performance metrics, learning patterns, and progress reports for any student.

## User Flow

**Entry Point**: Admin clicks on a student row in `/admin/students`  
**Destination**: `/admin/students/[studentId]/profile`  
**Return**: Back button returns to student list

---

## Implementation Phases

### Phase 1: Foundation & Basic Profile (Essential)
Core infrastructure and basic student information display.

### Phase 2: Progress & Test Analytics (High Priority)
Chapter progress and test performance tracking.

### Phase 3: Question Analytics (Medium Priority)
Detailed question-level insights and difficulty analysis.

### Phase 4: Advanced Analytics (Nice to Have)
Activity timelines, time analytics, and comparison features.

---

## Phase 1: Foundation & Basic Profile

### 1.1 Database Schema Changes

Create new Prisma models to track student activity:

```prisma
// Add to schema.prisma

// Track all student activities
model StudentActivity {
  id            String   @id @default(cuid())
  studentId     String
  student       Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  activityType  ActivityType
  timestamp     DateTime @default(now())
  duration      Int?     // Duration in seconds (for sessions)
  metadata      Json?    // Additional context (chapter_id, question_id, etc.)
  
  @@index([studentId, timestamp])
  @@index([activityType, timestamp])
}

enum ActivityType {
  LOGIN
  LOGOUT
  CHAPTER_VIEW
  CHAPTER_COMPLETE
  QUESTION_ATTEMPT
  TEST_START
  TEST_COMPLETE
}

// Track chapter progress per student
model ChapterProgress {
  id                String   @id @default(cuid())
  studentId         String
  student           Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  chapterId         String
  chapter           Chapter  @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  status            ProgressStatus @default(NOT_STARTED)
  progressPercent   Int      @default(0)
  timeSpentSeconds  Int      @default(0)
  startedAt         DateTime?
  completedAt       DateTime?
  questionsAttempted Int     @default(0)
  questionsCorrect  Int      @default(0)
  
  @@unique([studentId, chapterId])
  @@index([studentId])
  @@index([chapterId])
}

enum ProgressStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}

// Track all test attempts
model TestAttempt {
  id                String   @id @default(cuid())
  studentId         String
  student           Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  testId            String   // Reference to test (could be chapter test, final test, etc.)
  testName          String
  testType          String   // "timed", "untimed", "practice", etc.
  attemptNumber     Int      @default(1)
  startedAt         DateTime @default(now())
  completedAt       DateTime?
  durationSeconds   Int?
  score             Int      @default(0)
  maxScore          Int
  percentage        Float    @default(0)
  questionsTotal    Int
  questionsCorrect  Int      @default(0)
  status            TestStatus @default(IN_PROGRESS)
  answers           Json     // Array of {questionId, answer, isCorrect, timeSpent}
  
  @@index([studentId, testId])
  @@index([studentId, completedAt])
}

enum TestStatus {
  IN_PROGRESS
  COMPLETED
  ABANDONED
}

// Track individual question attempts
model QuestionAttempt {
  id            String   @id @default(cuid())
  studentId     String
  student       Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  questionId    String
  chapterId     String?
  topicId       String?
  attemptedAt   DateTime @default(now())
  answerGiven   String
  isCorrect     Boolean
  timeSpentSeconds Int?
  attemptNumber Int      @default(1) // How many times they've tried this question
  
  @@index([studentId, questionId])
  @@index([studentId, attemptedAt])
  @@index([questionId])
}

// Daily aggregated stats (for performance optimization)
model DailyActivity {
  id                String   @id @default(cuid())
  studentId         String
  student           Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  date              DateTime @db.Date
  timeSpentSeconds  Int      @default(0)
  questionsAttempted Int     @default(0)
  questionsCorrect  Int      @default(0)
  chaptersAccessed  Json     // Array of chapter IDs
  testsAttempted    Json     // Array of test IDs
  loginCount        Int      @default(0)
  firstLoginAt      DateTime?
  lastLogoutAt      DateTime?
  
  @@unique([studentId, date])
  @@index([studentId, date])
}
```

**Update Student Model:**

```prisma
model Student {
  // ... existing fields ...
  
  // Add relations
  activities         StudentActivity[]
  chapterProgress    ChapterProgress[]
  testAttempts       TestAttempt[]
  questionAttempts   QuestionAttempt[]
  dailyActivities    DailyActivity[]
}
```

### 1.2 Migration Commands

```bash
# Create and apply migration
npx prisma migrate dev --name add_student_analytics

# Generate Prisma Client
npx prisma generate
```

### 1.3 Make Student Rows Clickable

**Update:** `src/components/admin/StudentTable.tsx`

```typescript
// Add onClick handler to table row
<tr 
  key={student.id} 
  onClick={() => router.push(`/admin/students/${student.id}/profile`)}
  className="hover:bg-gray-50 transition-colors cursor-pointer"
>
```

Add router import:
```typescript
import { useRouter } from 'next/navigation'

// Inside component
const router = useRouter()
```

### 1.4 Create Student Profile Page

**Create:** `src/app/admin/students/[id]/profile/page.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiMail, FiPhone, FiCalendar, FiEdit2 } from 'react-icons/fi'

interface StudentProfile {
  id: string
  user: {
    id: string
    email: string
    name: string | null
    createdAt: string
  }
  phoneNumber: string | null
  dateOfBirth: string | null
  address: string | null
  status: string
  enrollmentDate: string
}

interface StudentStats {
  totalStudyTime: number // in seconds
  chaptersCompleted: number
  totalChapters: number
  currentChapter: string | null
  testsAttempted: number
  averageScore: number
  bestScore: number
  questionsAttempted: number
  questionsCorrect: number
  overallCompletion: number
}

export default function StudentProfilePage() {
  const router = useRouter()
  const params = useParams()
  const studentId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [stats, setStats] = useState<StudentStats | null>(null)

  useEffect(() => {
    fetchStudentProfile()
  }, [studentId])

  const fetchStudentProfile = async () => {
    try {
      // Check admin access
      const adminCheck = await fetch('/api/admin/check')
      const adminData = await adminCheck.json()

      if (!adminData.authenticated || !adminData.isAdmin) {
        router.push('/login')
        return
      }

      // Fetch student profile
      const response = await fetch(`/api/admin/students/${studentId}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to load student')
        setLoading(false)
        return
      }

      setStudent(data.student)

      // Fetch student statistics
      const statsResponse = await fetch(`/api/admin/students/${studentId}/stats`)
      const statsData = await statsResponse.json()

      if (statsResponse.ok) {
        setStats(statsData.stats)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching student profile:', error)
      setError('Failed to load student profile')
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getDaysSinceEnrollment = (enrollmentDate: string) => {
    const now = new Date()
    const enrolled = new Date(enrollmentDate)
    const diffTime = Math.abs(now.getTime() - enrolled.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student profile...</p>
        </div>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Student not found'}</p>
          <Link
            href="/admin/students"
            className="text-green-600 hover:underline"
          >
            Back to Students
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/students"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Detailed analytics and progress tracking
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Header Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {/* Profile Photo Placeholder */}
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">
                    {student.user.name?.charAt(0).toUpperCase() || 'S'}
                  </span>
                </div>
              </div>

              {/* Student Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {student.user.name || 'No Name'}
                  </h2>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(student.status)}`}>
                    {student.status}
                  </span>
                </div>

                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    <span>{student.user.email}</span>
                  </div>
                  {student.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <FiPhone className="w-4 h-4" />
                      <span>{student.phoneNumber}</span>
                    </div>
                  )}
                  {student.dateOfBirth && (
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4" />
                      <span>DOB: {formatDate(student.dateOfBirth)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    <span>
                      Enrolled: {formatDate(student.enrollmentDate)} 
                      <span className="text-gray-500 ml-2">
                        ({getDaysSinceEnrollment(student.enrollmentDate)} days ago)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Completion Circle */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32">
                  <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-green-600"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 * (1 - (stats?.overallCompletion || 0) / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-gray-900">
                  {stats?.overallCompletion || 0}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Overall Completion</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => alert('Edit functionality coming soon')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FiEdit2 className="w-4 h-4" />
              Edit Details
            </button>
            <button
              onClick={() => alert('Status change functionality coming soon')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {student.status === 'active' ? 'Suspend Student' : 'Activate Student'}
            </button>
          </div>
        </div>

        {/* Quick Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Study Time */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Study Time</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatDuration(stats?.totalStudyTime || 0)}
            </div>
            <p className="text-sm text-gray-500">
              ~{Math.round((stats?.totalStudyTime || 0) / getDaysSinceEnrollment(student.enrollmentDate) / 60)} min/day
            </p>
          </div>

          {/* Chapters Progress */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Chapters Progress</h3>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.chaptersCompleted || 0} / {stats?.totalChapters || 0}
            </div>
            <p className="text-sm text-gray-500">
              {stats?.currentChapter || 'No active chapter'}
            </p>
          </div>

          {/* Test Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Test Performance</h3>
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.averageScore.toFixed(1) || 0}%
            </div>
            <p className="text-sm text-gray-500">
              {stats?.testsAttempted || 0} tests · Best: {stats?.bestScore || 0}%
            </p>
          </div>

          {/* Questions Attempted */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Questions</h3>
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.questionsAttempted || 0}
            </div>
            <p className="text-sm text-gray-500">
              {stats ? Math.round((stats.questionsCorrect / stats.questionsAttempted) * 100) || 0 : 0}% correct
            </p>
          </div>
        </div>

        {/* Coming Soon Sections */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">More Analytics Coming Soon</h3>
            <p className="text-gray-600">
              Detailed chapter progress, test history, question analytics, activity timeline, 
              and more advanced features are being developed.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
```

### 1.5 Create Stats API Endpoint

**Create:** `src/app/api/admin/students/[id]/stats/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    const studentId = params.id

    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Calculate statistics
    // Note: This is basic implementation. As you add tracking models, 
    // these queries will become more sophisticated

    const stats = {
      totalStudyTime: 0, // Will be calculated from StudentActivity
      chaptersCompleted: 0, // From ChapterProgress
      totalChapters: 0, // Total chapters in system
      currentChapter: null, // From ChapterProgress
      testsAttempted: 0, // From TestAttempt
      averageScore: 0, // From TestAttempt
      bestScore: 0, // From TestAttempt
      questionsAttempted: 0, // From QuestionAttempt
      questionsCorrect: 0, // From QuestionAttempt
      overallCompletion: 0 // Calculated
    }

    return NextResponse.json({ stats })
  } catch (error: any) {
    console.error('Error fetching student stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student statistics' },
      { status: 500 }
    )
  }
}
```

---

## Phase 2: Progress & Test Analytics

### 2.1 Chapter Progress Section

**Create:** `src/components/admin/student-profile/ChapterProgressSection.tsx`

Key Features:
- List all chapters with progress bars
- Show completion status, time spent, accuracy rate
- Sorting options
- Expandable details

### 2.2 Test Performance Section

**Create:** `src/components/admin/student-profile/TestPerformanceSection.tsx`

Key Features:
- Table of all test attempts
- Click to view detailed breakdown
- Filter by date, status
- Export functionality

### 2.3 API Endpoints

**Create:**
- `GET /api/admin/students/[id]/chapters` - Get chapter progress
- `GET /api/admin/students/[id]/tests` - Get test history
- `GET /api/admin/students/[id]/tests/[testId]` - Get test details

---

## Phase 3: Question Analytics

### 3.1 Question Analytics Section

**Create:** `src/components/admin/student-profile/QuestionAnalyticsSection.tsx`

Key Features:
- Total attempts, success rates
- Most attempted questions
- Difficulty analysis (easy/medium/hard)

### 3.2 Strength & Weakness Analysis

**Create:** `src/components/admin/student-profile/StrengthWeaknessSection.tsx`

Key Features:
- Top 5 strong topics
- Top 5 weak topics
- Recommendations

### 3.3 API Endpoints

**Create:**
- `GET /api/admin/students/[id]/questions` - Get question attempts
- `GET /api/admin/students/[id]/analysis` - Get strength/weakness data

---

## Phase 4: Advanced Analytics

### 4.1 Activity Timeline

**Create:** `src/components/admin/student-profile/ActivityTimelineSection.tsx`

Key Features:
- Calendar heat map
- Daily activity breakdown
- Session tracking

### 4.2 Time Analytics

**Create:** `src/components/admin/student-profile/TimeAnalyticsSection.tsx`

Key Features:
- Time spent trends (chart)
- Session analytics
- Efficiency metrics

### 4.3 Recent Activity Feed

**Create:** `src/components/admin/student-profile/RecentActivitySection.tsx`

Key Features:
- Last 20 activities
- Relative timestamps
- Activity type icons

### 4.4 API Endpoints

**Create:**
- `GET /api/admin/students/[id]/activity` - Get activity log
- `GET /api/admin/students/[id]/daily-stats` - Get daily statistics

---

## Activity Tracking Implementation

To populate these analytics, you need to track student activities throughout the app.

### Track Activities in Your App

**Example: Track chapter completion**

```typescript
// In your chapter completion endpoint
import { prisma } from '@/lib/prisma'

async function trackChapterCompletion(studentId: string, chapterId: string) {
  await prisma.$transaction([
    // Update chapter progress
    prisma.chapterProgress.upsert({
      where: {
        studentId_chapterId: { studentId, chapterId }
      },
      update: {
        status: 'COMPLETED',
        completedAt: new Date(),
        progressPercent: 100
      },
      create: {
        studentId,
        chapterId,
        status: 'COMPLETED',
        completedAt: new Date(),
        progressPercent: 100
      }
    }),
    
    // Log activity
    prisma.studentActivity.create({
      data: {
        studentId,
        activityType: 'CHAPTER_COMPLETE',
        metadata: { chapterId }
      }
    })
  ])
}
```

**Example: Track question attempt**

```typescript
async function trackQuestionAttempt(
  studentId: string,
  questionId: string,
  answerGiven: string,
  isCorrect: boolean,
  timeSpentSeconds: number
) {
  // Get previous attempts for this question
  const previousAttempts = await prisma.questionAttempt.count({
    where: { studentId, questionId }
  })
  
  await prisma.questionAttempt.create({
    data: {
      studentId,
      questionId,
      answerGiven,
      isCorrect,
      timeSpentSeconds,
      attemptNumber: previousAttempts + 1
    }
  })
}
```

**Example: Track test completion**

```typescript
async function trackTestCompletion(
  studentId: string,
  testId: string,
  testName: string,
  answers: any[],
  score: number,
  maxScore: number
) {
  const questionsCorrect = answers.filter(a => a.isCorrect).length
  const percentage = (score / maxScore) * 100
  
  await prisma.testAttempt.create({
    data: {
      studentId,
      testId,
      testName,
      testType: 'timed', // or 'untimed'
      score,
      maxScore,
      percentage,
      questionsTotal: answers.length,
      questionsCorrect,
      status: 'COMPLETED',
      completedAt: new Date(),
      answers: answers // JSON array
    }
  })
}
```

---

## Export & Reporting Features

### PDF Report Generation

Install dependencies:
```bash
npm install jspdf jspdf-autotable
```

**Create:** `src/lib/reportGenerator.ts`

```typescript
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export function generateStudentReport(student: any, stats: any) {
  const doc = new jsPDF()
  
  // Add content
  doc.setFontSize(20)
  doc.text('Student Performance Report', 20, 20)
  
  doc.setFontSize(12)
  doc.text(`Name: ${student.user.name}`, 20, 40)
  doc.text(`Email: ${student.user.email}`, 20, 50)
  
  // Add tables and charts
  // ... implementation
  
  return doc
}
```

### CSV Export

**Create:** `src/lib/csvExporter.ts`

```typescript
export function exportToCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => 
        JSON.stringify(row[header] || '')
      ).join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}
```

---

## Performance Optimization

### Database Indexing

Already included in schema with `@@index` directives.

### Caching Strategy

**Consider using:**
- React Query for client-side caching
- Redis for server-side caching (optional)

```bash
npm install @tanstack/react-query
```

### Pagination

For large datasets, implement pagination:

```typescript
// Example API with pagination
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const skip = (page - 1) * limit
  
  const [data, total] = await Promise.all([
    prisma.questionAttempt.findMany({
      where: { studentId },
      skip,
      take: limit,
      orderBy: { attemptedAt: 'desc' }
    }),
    prisma.questionAttempt.count({
      where: { studentId }
    })
  ])
  
  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  })
}
```

---

## UI/UX Guidelines

### Color Coding Standards

```typescript
// Create shared constants
export const PERFORMANCE_COLORS = {
  excellent: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
  good: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
  fair: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
  poor: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
  neutral: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-500' }
}

export function getPerformanceColor(percentage: number) {
  if (percentage >= 80) return PERFORMANCE_COLORS.excellent
  if (percentage >= 60) return PERFORMANCE_COLORS.good
  if (percentage >= 40) return PERFORMANCE_COLORS.fair
  return PERFORMANCE_COLORS.poor
}
```

### Loading States

Use skeleton loaders for better UX:

```typescript
function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
    </div>
  )
}
```

---

## Testing Strategy

### Unit Tests

Test individual components and functions:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

### Integration Tests

Test API endpoints:

```bash
npm install --save-dev supertest
```

### Example Test

```typescript
// __tests__/api/students/stats.test.ts
import { GET } from '@/app/api/admin/students/[id]/stats/route'

describe('/api/admin/students/[id]/stats', () => {
  it('returns student statistics', async () => {
    // Test implementation
  })
})
```

---

## Implementation Checklist

### Phase 1: Foundation ✅
- [ ] Apply database migration
- [ ] Make student rows clickable
- [ ] Create student profile page
- [ ] Create basic stats API endpoint
- [ ] Display student header card
- [ ] Display quick statistics cards

### Phase 2: Progress & Test Analytics
- [ ] Create ChapterProgressSection component
- [ ] Create TestPerformanceSection component
- [ ] Create chapter progress API endpoint
- [ ] Create test history API endpoint
- [ ] Implement chapter tracking in app
- [ ] Implement test tracking in app

### Phase 3: Question Analytics
- [ ] Create QuestionAnalyticsSection component
- [ ] Create StrengthWeaknessSection component
- [ ] Create question analytics API endpoint
- [ ] Implement question attempt tracking
- [ ] Calculate difficulty levels
- [ ] Generate recommendations

### Phase 4: Advanced Analytics
- [ ] Create ActivityTimelineSection component
- [ ] Create TimeAnalyticsSection component
- [ ] Create RecentActivitySection component
- [ ] Create activity tracking API endpoints
- [ ] Implement daily aggregation job
- [ ] Add performance comparison (optional)

### Additional Features
- [ ] PDF report generation
- [ ] CSV export functionality
- [ ] Charts and visualizations (Chart.js or Recharts)
- [ ] Real-time updates (WebSocket)
- [ ] Notifications/alerts

---

## Recommended Libraries

```bash
# Charts and visualizations
npm install recharts

# Date handling
npm install date-fns

# Icons (already installed: react-icons)

# PDF generation
npm install jspdf jspdf-autotable

# State management (optional)
npm install zustand
```

---

## Next Steps

1. **Start with Phase 1**: Get the foundation working first
2. **Test thoroughly**: Ensure basic profile works before adding complexity
3. **Implement tracking**: Start tracking activities in your existing app flows
4. **Add phases incrementally**: Build and test each phase before moving to the next
5. **Gather feedback**: Show admin users and refine based on their needs

---

## Support & Maintenance

### Monitoring

Track these metrics:
- Page load times
- API response times
- Database query performance
- Cache hit rates

### Future Enhancements

- AI-powered insights and predictions
- Automated recommendations
- Student comparison and rankings
- Email reports
- Mobile app version

---

## Security Considerations

1. **Access Control**: All endpoints must verify admin role
2. **Data Privacy**: Ensure GDPR compliance if applicable
3. **Audit Logging**: Track who accessed which student profiles
4. **Rate Limiting**: Prevent abuse of export features

---

**Ready to begin? Start with Phase 1 and work your way through!** 🚀
