import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET attempt statistics for a question across all contexts
export async function GET(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Only students can view attempt statistics' },
        { status: 403 }
      )
    }

    const student = await prisma.student.findUnique({
      where: { userId: user.id }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    // Get all attempts for this question
    const attempts = await prisma.questionAttempt.findMany({
      where: {
        studentId: student.id,
        questionId: params.questionId
      },
      orderBy: { attemptedAt: 'desc' }
    })

    // Calculate overall statistics
    const totalAttempts = attempts.length
    const correctAttempts = attempts.filter(a => a.isCorrect).length
    const incorrectAttempts = totalAttempts - correctAttempts
    const successRate = totalAttempts > 0 
      ? Math.round((correctAttempts / totalAttempts) * 100) 
      : 0

    // Group by testType (context)
    const attemptsByContext: Record<string, { total: number; correct: number; incorrect: number }> = {}
    
    attempts.forEach(attempt => {
      const type = attempt.testType || 'unknown'
      if (!attemptsByContext[type]) {
        attemptsByContext[type] = { total: 0, correct: 0, incorrect: 0 }
      }
      attemptsByContext[type].total++
      if (attempt.isCorrect) {
        attemptsByContext[type].correct++
      } else {
        attemptsByContext[type].incorrect++
      }
    })

    // Get latest attempt
    const latestAttempt = attempts.length > 0 ? {
      attemptedAt: attempts[0].attemptedAt.toISOString(),
      isCorrect: attempts[0].isCorrect,
      testType: attempts[0].testType || null
    } : null

    // Determine learning status
    // Learned if last 3 attempts are correct (if at least 3 attempts exist)
    const recentAttempts = attempts.slice(0, 3)
    const isLearned = recentAttempts.length >= 3 && 
      recentAttempts.every(a => a.isCorrect)

    // Get first and last correct attempt dates
    const firstAttempt = attempts.length > 0 ? attempts[attempts.length - 1].attemptedAt.toISOString() : null
    const lastCorrectAttempt = attempts.find(a => a.isCorrect)
    const lastCorrectAt = lastCorrectAttempt ? lastCorrectAttempt.attemptedAt.toISOString() : null

    return NextResponse.json({
      questionId: params.questionId,
      totalAttempts,
      correctAttempts,
      incorrectAttempts,
      successRate,
      attemptsByContext,
      latestAttempt,
      isLearned,
      firstAttemptedAt: firstAttempt,
      lastCorrectAt
    }, { status: 200 })
  } catch (error: any) {
    console.error('Get attempt stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attempt statistics' },
      { status: 500 }
    )
  }
}
