import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

/**
 * GET /api/student/assigned-tests
 * Get all tests assigned to the current student (with multi-attempt support)
 * Shows all tests including completed ones with retake option
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user and student profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true }
    })

    if (!user || !user.studentProfile) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    const studentId = user.studentProfile.id

    // Fetch ALL assigned tests (including completed)
    const assignments = await prisma.assignedTestStudent.findMany({
      where: {
        studentId
      },
      include: {
        test: {
          select: {
            id: true,
            title: true,
            description: true,
            questionCount: true,
            isTimed: true,
            timeLimitMinutes: true,
            dueDate: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // NOT_STARTED first, then IN_PROGRESS, then COMPLETED
        { assignedAt: 'desc' }
      ]
    })

    if (assignments.length === 0) {
      return NextResponse.json({
        success: true,
        tests: []
      })
    }

    // Get all attempts for these tests to compute stats
    const testIds = assignments.map(a => a.test.id)
    const allAttempts = await prisma.assignedTestAttempt.findMany({
      where: {
        testId: { in: testIds },
        studentId,
        completedAt: { not: null }
      },
      select: {
        testId: true,
        attemptNumber: true,
        score: true,
        completedAt: true
      },
      orderBy: [
        { testId: 'asc' },
        { attemptNumber: 'asc' }
      ]
    })

    // Group attempts by testId
    const attemptsByTest = new Map<string, typeof allAttempts>()
    allAttempts.forEach(attempt => {
      const existing = attemptsByTest.get(attempt.testId) || []
      existing.push(attempt)
      attemptsByTest.set(attempt.testId, existing)
    })

    // Format response with multi-attempt data
    const tests = assignments.map(assignment => {
      const attempts = attemptsByTest.get(assignment.test.id) || []
      const totalAttempts = attempts.length
      
      // Get best score (highest score across all attempts)
      const bestScore = attempts.length > 0 
        ? Math.max(...attempts.map(a => a.score || 0))
        : null
      
      // Get first attempt score
      const firstAttempt = attempts.find(a => a.attemptNumber === 1)
      const firstScore = firstAttempt?.score ?? null
      
      // Calculate improvement (best - first, only if multiple attempts)
      const improvement = (bestScore !== null && firstScore !== null && totalAttempts > 1 && bestScore > firstScore)
        ? bestScore - firstScore
        : null

      // Use assignment score as latest, or best available
      const latestScore = assignment.score ?? bestScore

      return {
        id: assignment.test.id,
        title: assignment.test.title,
        description: assignment.test.description,
        questionCount: assignment.test.questionCount,
        isTimed: assignment.test.isTimed,
        timeLimitMinutes: assignment.test.timeLimitMinutes,
        dueDate: assignment.test.dueDate,
        testStatus: assignment.test.status,
        assignedAt: assignment.assignedAt,
        status: assignment.status,
        startedAt: assignment.startedAt,
        completedAt: assignment.completedAt,
        // Latest attempt score
        score: latestScore,
        correctAnswers: assignment.correctAnswers,
        // Multi-attempt data (computed from attempts table)
        totalAttempts,
        bestScore,
        firstScore,
        improvement,
        // Can retake if completed (or if has attempts, allow retake)
        canRetake: assignment.status === 'COMPLETED' || totalAttempts > 0
      }
    })

    return NextResponse.json({
      success: true,
      tests
    })
  } catch (error: any) {
    console.error('Error fetching assigned tests:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch assigned tests' },
      { status: 500 }
    )
  }
}
