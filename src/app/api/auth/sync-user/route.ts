import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

/**
 * Sync Better Auth user to our users table
 * Called after successful signup to create/update user in our users table
 * Can be called with email in body or will use current session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    let authUser: { id: string; email: string; name?: string | null; emailVerified?: boolean } | null = null

    // Try to get user from session first
    const headersList = await headers()
    const session = await auth.api.getSession({
      headers: headersList as any,
    }).catch(() => null)

    if (session?.user) {
      authUser = session.user
    } else if (body.email) {
      // If no session but email provided, find user in Better Auth's user table
      const authUserRecord = await prisma.$queryRawUnsafe<Array<{
        id: string
        email: string
        name: string | null
        emailVerified: boolean
      }>>(
        `SELECT id, email, name, "emailVerified" FROM "user" WHERE email = $1 LIMIT 1`,
        body.email
      )

      if (authUserRecord && authUserRecord.length > 0) {
        authUser = {
          id: authUserRecord[0].id,
          email: authUserRecord[0].email,
          name: authUserRecord[0].name,
          emailVerified: authUserRecord[0].emailVerified,
        }
      }
    }

    if (!authUser) {
      return NextResponse.json(
        { error: 'User not found. Please sign up first.' },
        { status: 404 }
      )
    }

    // Check if user already exists in our users table (by email or ID)
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: authUser.email },
    })

    const existingUserById = await prisma.user.findUnique({
      where: { id: authUser.id },
    })

    if (existingUserByEmail || existingUserById) {
      // User exists - update to sync with Better Auth
      const userToUpdate = existingUserById || existingUserByEmail!
      const updatedUser = await prisma.user.update({
        where: { id: userToUpdate.id },
        data: {
          id: authUser.id, // Sync the ID
          email: authUser.email,
          name: authUser.name || userToUpdate.name,
          emailVerified: authUser.emailVerified ? new Date() : null,
        },
      })

      return NextResponse.json({
        success: true,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
        },
      })
    }

    // Create new user in our users table
    const newUser = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email,
        name: authUser.name || '',
        password: '', // Better Auth handles password
        role: 'STUDENT', // Default role
        emailVerified: authUser.emailVerified ? new Date() : null,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    })
  } catch (error: any) {
    console.error('Sync user error:', error)
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    )
  }
}
