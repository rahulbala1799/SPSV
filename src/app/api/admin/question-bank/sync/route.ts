import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { syncQuestionsToQuestionBank, cleanupQuestionBank } from '@/lib/questionBankSync'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/question-bank/sync
 * Synchronize questions from Question model to QuestionBank for timed tests
 * Admin only endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Parse request body for optional parameters
    const body = await request.json().catch(() => ({}))
    const { chapterIds, cleanup } = body

    // Perform sync
    const syncResult = await syncQuestionsToQuestionBank(chapterIds)

    // Optionally cleanup orphaned questions
    let cleanupResult = null
    if (cleanup === true) {
      cleanupResult = await cleanupQuestionBank()
    }

    return NextResponse.json({
      success: true,
      message: 'QuestionBank synchronized successfully',
      sync: syncResult,
      cleanup: cleanupResult
    })
  } catch (error) {
    console.error('Error syncing QuestionBank:', error)
    return NextResponse.json(
      {
        error: 'Failed to sync QuestionBank',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/question-bank/sync
 * Get current QuestionBank statistics
 * Admin only endpoint
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { prisma } = await import('@/lib/prisma')

    // Get statistics
    const [
      totalQuestions,
      industryQuestions,
      areaQuestions,
      activeQuestions,
      inactiveQuestions,
      questionsInChapters,
      activeChapters
    ] = await Promise.all([
      prisma.questionBank.count(),
      prisma.questionBank.count({ where: { category: 'INDUSTRY', isActive: true } }),
      prisma.questionBank.count({ where: { category: 'AREA_KNOWLEDGE', isActive: true } }),
      prisma.questionBank.count({ where: { isActive: true } }),
      prisma.questionBank.count({ where: { isActive: false } }),
      prisma.question.count({ where: { chapter: { isActive: true } } }),
      prisma.chapter.count({ where: { isActive: true } })
    ])

    // Check if sync is needed
    const syncNeeded = questionsInChapters > activeQuestions

    return NextResponse.json({
      success: true,
      statistics: {
        questionBank: {
          total: totalQuestions,
          active: activeQuestions,
          inactive: inactiveQuestions,
          byCategory: {
            industry: industryQuestions,
            areaKnowledge: areaQuestions
          }
        },
        chapters: {
          active: activeChapters,
          totalQuestions: questionsInChapters
        },
        syncStatus: {
          needed: syncNeeded,
          difference: questionsInChapters - activeQuestions
        }
      },
      requirements: {
        fullTimedTest: {
          industryNeeded: 54,
          areaNeeded: 36,
          industryAvailable: industryQuestions,
          areaAvailable: areaQuestions,
          canRunFullTest: industryQuestions >= 54 && areaQuestions >= 36
        }
      }
    })
  } catch (error) {
    console.error('Error getting QuestionBank stats:', error)
    return NextResponse.json(
      {
        error: 'Failed to get QuestionBank statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
