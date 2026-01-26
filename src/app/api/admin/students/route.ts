import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// GET all students
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin(request)

    const students = await prisma.student.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ students }, { status: 200 })
  } catch (error: any) {
    console.error('Get students error:', error)
    
    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('Unauthorized') ? 401 : 403 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

// POST - Create new student
const createStudentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin(request)

    const body = await request.json()
    const validatedData = createStudentSchema.parse(body)
    const { name, email, password, phoneNumber, dateOfBirth, address, emergencyContact } = validatedData

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and student profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          name: name.trim(),
          password: hashedPassword,
          role: 'STUDENT'
        }
      })

      const student = await tx.student.create({
        data: {
          userId: user.id,
          phoneNumber: phoneNumber || null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          address: address || null,
          emergencyContact: emergencyContact || null,
          status: 'active'
        }
      })

      return { user, student }
    })

    return NextResponse.json(
      {
        success: true,
        student: {
          id: result.student.id,
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name
          }
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create student error:', error)
    
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
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}
