import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

/**
 * GET /api/student/assigned-tests/[id]/results
 * Get test results after completion (with all attempts)
 * ?attempt=<number> to get specific attempt (default: latest)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const requestedAttempt = searchParams.get('attempt')

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

    // Get the assignment to see total attempts and best/first scores
    const assignment = await prisma.assignedTestStudent.findUnique({
      where: {
        testId_studentId: {
          testId: params.id,
          studentId
        }
      }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Test not assigned to you' },
        { status: 404 }
      )
    }

    // Get ALL completed attempts for this test
    const allAttempts = await prisma.assignedTestAttempt.findMany({
      where: {
        testId: params.id,
        studentId,
        completedAt: { not: null }
      },
      orderBy: {
        attemptNumber: 'desc'
      },
      select: {
        id: true,
        attemptNumber: true,
        score: true,
        correctAnswers: true,
        totalQuestions: true,
        startedAt: true,
        completedAt: true,
        timeSpentSeconds: true,
        improvementFromPrevious: true
      }
    })

    if (allAttempts.length === 0) {
      return NextResponse.json(
        { error: 'No completed attempts found' },
        { status: 404 }
      )
    }

    // Get specific attempt or latest
    const targetAttemptNumber = requestedAttempt 
      ? parseInt(requestedAttempt, 10) 
      : allAttempts[0].attemptNumber

    const attempt = await prisma.assignedTestAttempt.findFirst({
      where: {
        testId: params.id,
        studentId,
        attemptNumber: targetAttemptNumber
      },
      include: {
        test: true,
        answers: {
          include: {
            question: true
          }
        }
      }
    })

    if (!attempt) {
      return NextResponse.json(
        { error: 'Attempt not found' },
        { status: 404 }
      )
    }

    if (!attempt.completedAt) {
      return NextResponse.json(
        { error: 'Test not completed yet' },
        { status: 400 }
      )
    }

    // Format answers with full details
    const answers = attempt.answers.map(answer => ({
      questionId: answer.question.id,
      questionText: answer.question.questionText,
      options: answer.question.options,
      selectedAnswer: answer.selectedAnswer,
      correctAnswer: answer.question.correctAnswer,
      isCorrect: answer.isCorrect,
      explanation: answer.question.explanation,
      answeredAt: answer.answeredAt
    }))

    // Format all attempts summary
    const attemptsSummary = allAttempts.map(a => ({
      attemptNumber: a.attemptNumber,
      score: a.score,
      correctAnswers: a.correctAnswers,
      totalQuestions: a.totalQuestions,
      completedAt: a.completedAt,
      timeSpentSeconds: a.timeSpentSeconds,
      improvementFromPrevious: a.improvementFromPrevious
    }))

    return NextResponse.json({
      success: true,
      // Current selected attempt
      attempt: {
        id: attempt.id,
        testTitle: attempt.test.title,
        attemptNumber: attempt.attemptNumber,
        score: attempt.score,
        correctAnswers: attempt.correctAnswers,
        totalQuestions: attempt.totalQuestions,
        percentageScore: Number(attempt.percentageScore),
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        timeSpentSeconds: attempt.timeSpentSeconds,
        improvementFromPrevious: attempt.improvementFromPrevious
      },
      answers,
      // All attempts summary for the UI
      allAttempts: attemptsSummary,
      // Overall stats
      stats: {
        totalAttempts: assignment.totalAttempts || allAttempts.length,
        bestScore: assignment.bestScore,
        firstScore: assignment.firstScore,
        improvement: assignment.improvement,
        latestScore: assignment.score
      }
    })
  } catch (error: any) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch results' },
      { status: 500 }
    )
  }
}
