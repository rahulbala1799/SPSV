import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// POST - Mark all achievements as seen (clear isNew) for the current student
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Only students can use this' }, { status: 403 })
    }

    const student = await prisma.student.findUnique({
      where: { userId: user.id }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    await prisma.studentAchievement.updateMany({
      where: { studentId: student.id, isNew: true },
      data: { isNew: false }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Mark achievements seen error:', error)
    return NextResponse.json({ error: 'Failed to mark achievements as seen' }, { status: 500 })
  }
}
