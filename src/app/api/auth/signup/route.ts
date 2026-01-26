import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: NextRequest) {
  // DISABLED: Public signup is disabled. Students must be added by admins.
  return NextResponse.json(
    { error: 'Public registration is currently disabled. Please contact an administrator.' },
    { status: 403 }
  )
  
  /* ORIGINAL CODE - UNCOMMENT TO RE-ENABLE PUBLIC SIGNUP
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = signupSchema.parse(body)
    const { name, email, password } = validatedData

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with STUDENT role and student profile
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          name: name.trim(),
          password: hashedPassword,
          role: 'STUDENT'
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      })

      // Create student profile
      await tx.student.create({
        data: {
          userId: user.id,
          status: 'active'
        }
      })

      return user
    })

    return NextResponse.json(
      {
        success: true,
        user: {
          id: result.id,
          email: result.email,
          name: result.name,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    // Handle other errors
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
  */
}
