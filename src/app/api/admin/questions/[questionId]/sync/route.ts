import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { syncSingleQuestion } from '@/lib/questionBankSyncFast'

/**
 * POST /api/admin/questions/[questionId]/sync
 * Sync a single question to QuestionBank (instant)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  try {
    await requireAdmin(request)

    const startTime = Date.now()
    const result = await syncSingleQuestion(params.questionId)
    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      result,
      duration,
      message: result.created 
        ? 'Question created in QuestionBank' 
        : result.updated 
        ? 'Question updated in QuestionBank'
        : 'Question sync skipped (check reason)',
    })
  } catch (error: any) {
    console.error('Error syncing question:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sync question' },
      { status: 500 }
    )
  }
}
