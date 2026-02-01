import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

/**
 * POST /api/student/assigned-tests/[id]/submit
 * Submit test answers
 * Now supports multiple attempts with improvement tracking
 */
export async function POST(
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

    const body = await request.json()
    const { attemptId, answers } = body

    if (!attemptId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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

    // Verify attempt belongs to this student
    const attempt = await prisma.assignedTestAttempt.findFirst({
      where: {
        id: attemptId,
        studentId,
        testId: params.id
      },
      include: {
        test: {
          include: {
            testQuestions: {
              include: {
                question: true
              }
            }
          }
        }
      }
    })

    if (!attempt) {
      return NextResponse.json(
        { error: 'Test attempt not found' },
        { status: 404 }
      )
    }

    // Check if already completed
    if (attempt.completedAt) {
      return NextResponse.json(
        { error: 'Test already submitted' },
        { status: 400 }
      )
    }

    // Get previous attempt for improvement calculation
    const previousAttempt = attempt.attemptNumber > 1 
      ? await prisma.assignedTestAttempt.findFirst({
          where: {
            testId: params.id,
            studentId,
            attemptNumber: attempt.attemptNumber - 1,
            completedAt: { not: null }
          }
        })
      : null

    // Get question data for grading
    const questionMap = new Map(
      attempt.test.testQuestions.map(tq => [tq.question.id, tq.question])
    )

    // Grade answers
    let correctCount = 0
    const gradedAnswers = answers.map((answer: any) => {
      const question = questionMap.get(answer.questionId)
      if (!question) {
        throw new Error(`Question ${answer.questionId} not found in test`)
      }

      const isCorrect = answer.selectedAnswer === question.correctAnswer
      if (isCorrect) correctCount++

      return {
        attemptId,
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        answeredAt: new Date()
      }
    })

    // Calculate score
    const totalQuestions = attempt.test.questionCount
    const percentageScore = Math.round((correctCount / totalQuestions) * 100)
    const now = new Date()
    const timeSpentSeconds = Math.floor((now.getTime() - attempt.startedAt.getTime()) / 1000)

    // Calculate improvement from previous attempt
    const improvementFromPrevious = previousAttempt?.score 
      ? percentageScore - previousAttempt.score 
      : null

    // Get the assignment to update multi-attempt stats
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
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    // Calculate new stats
    const isFirstAttempt = attempt.attemptNumber === 1
    const firstScore = isFirstAttempt ? percentageScore : (assignment.firstScore ?? percentageScore)
    const currentBestScore = assignment.bestScore ?? 0
    const newBestScore = Math.max(currentBestScore, percentageScore)
    const improvement = newBestScore - firstScore

    // Save results in transaction
    const results = await prisma.$transaction(async (tx) => {
      // Save answers
      await tx.assignedTestAnswer.createMany({
        data: gradedAnswers
      })

      // Update attempt
      await tx.assignedTestAttempt.update({
        where: { id: attemptId },
        data: {
          completedAt: now,
          timeSpentSeconds,
          score: percentageScore,
          correctAnswers: correctCount,
          percentageScore,
          improvementFromPrevious
        }
      })

      // Update assignment with latest score and multi-attempt stats
      await tx.assignedTestStudent.update({
        where: {
          testId_studentId: {
            testId: params.id,
            studentId
          }
        },
        data: {
          status: 'COMPLETED',
          completedAt: now,
          score: percentageScore, // Latest score
          correctAnswers: correctCount,
          totalAttempts: attempt.attemptNumber,
          firstScore: firstScore,
          bestScore: newBestScore,
          improvement: improvement > 0 ? improvement : null
        }
      })

      return {
        score: percentageScore,
        correctAnswers: correctCount,
        totalQuestions,
        percentageScore,
        completedAt: now,
        timeSpentSeconds,
        attemptNumber: attempt.attemptNumber,
        improvementFromPrevious,
        bestScore: newBestScore,
        totalAttempts: attempt.attemptNumber
      }
    })

    return NextResponse.json({
      success: true,
      results
    })
  } catch (error: any) {
    console.error('Error submitting test:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit test' },
      { status: 500 }
    )
  }
}
