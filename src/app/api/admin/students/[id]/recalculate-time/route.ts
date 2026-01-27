import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { recalculateStudentTime } from '@/lib/analytics'

export async function POST(
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

    // Recalculate time for all chapters
    const result = await recalculateStudentTime(studentId)

    return NextResponse.json({
      success: true,
      message: `Recalculated time for ${result.chaptersUpdated} chapters`,
      chaptersUpdated: result.chaptersUpdated,
      totalTimeCalculated: result.totalTimeCalculated,
      totalTimeFormatted: `${Math.floor(result.totalTimeCalculated / 3600)}h ${Math.floor((result.totalTimeCalculated % 3600) / 60)}m`
    })
  } catch (error: any) {
    console.error('Error recalculating time:', error)
    return NextResponse.json(
      { error: 'Failed to recalculate time' },
      { status: 500 }
    )
  }
}
