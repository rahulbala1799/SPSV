import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VALID_SOURCES = ['enrollment', 'timetable', 'success-stories', 'test-guide', 'contact']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const fullName = String(body.fullName || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const phone = String(body.phone || '').trim()
    const source = String(body.source || 'enrollment').toLowerCase()

    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ error: 'Full name is required (min 2 characters)' }, { status: 400 })
    }
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }
    if (!phone || phone.length < 8) {
      return NextResponse.json({ error: 'Phone is required (min 8 characters)' }, { status: 400 })
    }
    if (!VALID_SOURCES.includes(source)) {
      return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
    }

    const lead = await prisma.websiteLead.create({
      data: {
        source,
        fullName,
        email,
        phone,
        daysFreeFrom: body.daysFreeFrom ? new Date(body.daysFreeFrom) : null,
        daysFreeTo: body.daysFreeTo ? new Date(body.daysFreeTo) : null,
        whichDays: body.whichDays?.trim() || null,
        preferredTime: body.preferredTime?.trim() || null,
        enrollmentType: body.enrollmentType?.trim() || null,
        preferredSchedule: body.preferredSchedule?.trim() || null,
        hasAppliedForTest: body.hasAppliedForTest === true,
        testDate: body.testDate ? new Date(body.testDate) : null,
        howDidYouHear: body.howDidYouHear?.trim() || null,
        additionalNotes: body.additionalNotes?.trim() || null,
      },
    })

    return NextResponse.json({ success: true, id: lead.id })
  } catch (error: any) {
    console.error('Lead submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit. Please try again.' },
      { status: 500 }
    )
  }
}
