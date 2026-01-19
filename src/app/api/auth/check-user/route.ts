import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Check if a user exists in Better Auth's user table
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check Better Auth's user table (lowercase 'user')
    const authUser = await prisma.$queryRawUnsafe<Array<{
      id: string
      email: string
    }>>(
      `SELECT id, email FROM "user" WHERE email = $1 LIMIT 1`,
      email
    )

    return NextResponse.json({
      exists: authUser && authUser.length > 0,
    })
  } catch (error) {
    console.error('Check Better Auth user error:', error)
    return NextResponse.json(
      { error: 'Failed to check user' },
      { status: 500 }
    )
  }
}
