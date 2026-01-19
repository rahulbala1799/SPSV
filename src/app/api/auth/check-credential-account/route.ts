import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Check if a user has a credential account in Better Auth
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

    // Find user in Better Auth
    const authUser = await prisma.$queryRawUnsafe<Array<{
      id: string
      email: string
    }>>(
      `SELECT id, email FROM "user" WHERE email = $1 LIMIT 1`,
      email
    )

    if (!authUser || authUser.length === 0) {
      return NextResponse.json({
        exists: false,
        hasCredential: false,
      })
    }

    const userId = authUser[0].id

    // Check if credential account exists
    const account = await prisma.$queryRawUnsafe<Array<{
      id: string
      password: string | null
    }>>(
      `SELECT id, password FROM "account" WHERE "userId" = $1 AND "providerId" = 'credential' LIMIT 1`,
      userId
    )

    return NextResponse.json({
      exists: true,
      hasCredential: account && account.length > 0 && account[0].password !== null,
    })
  } catch (error) {
    console.error('Check credential account error:', error)
    return NextResponse.json(
      { error: 'Failed to check credential account' },
      { status: 500 }
    )
  }
}
