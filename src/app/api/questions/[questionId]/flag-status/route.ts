import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/questions/[questionId]/flag-status
 * Get flag status for a specific question (Chapter context only)
 * This endpoint should NOT be called from test contexts
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get student profile
    const student = await prisma.student.findUnique({
      where: { userId: user.id }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      )
    }

    // Find active flag
    const flag = await prisma.flaggedQuestion.findFirst({
      where: {
        studentId: student.id,
        questionId: params.questionId,
        isActive: true,
      },
    })

    return NextResponse.json({
      isFlagged: !!flag,
      flaggedAt: flag?.flaggedAt,
      flaggedFrom: flag?.flaggedFrom,
    })
  } catch (error: any) {
    console.error('Error getting flag status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get flag status' },
      { status: 500 }
    )
  }
}
