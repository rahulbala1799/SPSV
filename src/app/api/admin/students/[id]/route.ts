import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// GET single student
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            emailVerified: true,
            createdAt: true
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ student }, { status: 200 })
  } catch (error: any) {
    console.error('Get student error:', error)
    
    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    )
  }
}

// PATCH - Update student
const updateStudentSchema = z.object({
  name: z.string().min(2).optional(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  status: z.enum(['active', 'suspended', 'completed']).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const validatedData = updateStudentSchema.parse(body)

    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: { user: true }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Update user name if provided
    const { name, ...studentData } = validatedData

    await prisma.$transaction(async (tx) => {
      if (name) {
        await tx.user.update({
          where: { id: student.userId },
          data: { name }
        })
      }

      await tx.student.update({
        where: { id: params.id },
        data: {
          phoneNumber: studentData.phoneNumber,
          dateOfBirth: studentData.dateOfBirth ? new Date(studentData.dateOfBirth) : undefined,
          address: studentData.address,
          emergencyContact: studentData.emergencyContact,
          status: studentData.status,
        }
      })
    })

    // Fetch updated student
    const updatedStudent = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            emailVerified: true,
            createdAt: true
          }
        }
      }
    })

    return NextResponse.json(
      { success: true, student: updatedStudent },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Update student error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    )
  }
}

// DELETE student
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    const student = await prisma.student.findUnique({
      where: { id: params.id }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Delete user (will cascade delete student due to onDelete: Cascade)
    await prisma.user.delete({
      where: { id: student.userId }
    })

    return NextResponse.json(
      { success: true, message: 'Student deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Delete student error:', error)
    
    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    )
  }
}
