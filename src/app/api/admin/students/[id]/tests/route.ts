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
      where: { id: studentId },
      include: { user: true }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Fetch untimed test attempts
    const untimedTests = await prisma.untimedTestAttempt.findMany({
      where: {
        studentId,
        state: 'COMPLETED'
      },
      orderBy: { completedAt: 'desc' }
    })

    // Fetch timed test attempts
    const timedTests = await prisma.testSession.findMany({
      where: {
        userId: student.userId,
        status: 'COMPLETED'
      },
      orderBy: { completedAt: 'desc' }
    })

    // Combine and format test data
    const allTests = [
      ...untimedTests.map(test => ({
        id: test.id,
        testName: `${test.category} Test - ${test.questionCount} Questions`,
        testType: 'Untimed',
        category: test.category,
        dateAttempted: test.completedAt?.toISOString() || test.createdAt.toISOString(),
        score: test.score || 0,
        scorePercentage: test.score || 0,
        questionsTotal: test.questionCount,
        questionsCorrect: test.correctAnswers,
        questionsIncorrect: test.questionCount - test.correctAnswers,
        timeTaken: test.completedAt && test.startedAt
          ? Math.floor((test.completedAt.getTime() - test.startedAt.getTime()) / 1000)
          : null,
        status: (test.score || 0) >= 80 ? 'Passed' : 'Failed'
      })),
      ...timedTests.map(test => ({
        id: test.id,
        testName: `${test.testType} Test`,
        testType: 'Timed',
        category: test.testType,
        dateAttempted: test.completedAt?.toISOString() || test.startedAt.toISOString(),
        score: test.score || 0,
        scorePercentage: Number(test.scorePercentage) || 0,
        questionsTotal: test.totalQuestions,
        questionsCorrect: test.score || 0,
        questionsIncorrect: test.totalQuestions - (test.score || 0),
        timeTaken: test.completedAt && test.startedAt
          ? Math.floor((test.completedAt.getTime() - test.startedAt.getTime()) / 1000)
          : test.timeAllotted - test.timeRemaining,
        status: (Number(test.scorePercentage) || 0) >= 80 ? 'Passed' : 'Failed',
        industryScore: test.industryScore,
        areaScore: test.areaScore,
        industryPercentage: Number(test.industryPercentage) || 0,
        areaPercentage: Number(test.areaPercentage) || 0
      }))
    ]

    // Sort by date (most recent first)
    allTests.sort((a, b) => 
      new Date(b.dateAttempted).getTime() - new Date(a.dateAttempted).getTime()
    )

    // Calculate summary statistics
    const summary = {
      totalTests: allTests.length,
      untimedTests: untimedTests.length,
      timedTests: timedTests.length,
      passedTests: allTests.filter(t => t.status === 'Passed').length,
      failedTests: allTests.filter(t => t.status === 'Failed').length,
      averageScore: allTests.length > 0
        ? Math.round(allTests.reduce((sum, t) => sum + t.scorePercentage, 0) / allTests.length * 10) / 10
        : 0,
      bestScore: allTests.length > 0
        ? Math.max(...allTests.map(t => t.scorePercentage))
        : 0,
      recentScore: allTests.length > 0 ? allTests[0].scorePercentage : 0,
      passRate: allTests.length > 0
        ? Math.round((allTests.filter(t => t.status === 'Passed').length / allTests.length) * 100)
        : 0
    }

    return NextResponse.json({ 
      tests: allTests,
      summary
    })
  } catch (error: any) {
    console.error('Error fetching test performance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch test performance data' },
      { status: 500 }
    )
  }
}
