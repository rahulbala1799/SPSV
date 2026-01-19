import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Verify the user is authenticated
    const headersList = await headers()
    const session = await auth.api.getSession({
      headers: headersList as any,
    })

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only allow users to get their own role, or admins to get any role
    const requestingUserId = session.user.id
    const targetUserId = params.userId

    // Get the requesting user's role
    const requestingUser = await prisma.user.findUnique({
      where: { id: requestingUserId },
      select: { role: true },
    })

    const requestingUserRole = requestingUser?.role as 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT' | undefined
    const isAdmin = requestingUserRole === 'ADMIN' || requestingUserRole === 'SUPER_ADMIN'

    // Users can only get their own role, admins can get any role
    if (requestingUserId !== targetUserId && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get the target user's role
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { role: true },
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      role: targetUser.role || 'STUDENT',
    })
  } catch (error) {
    console.error('Get user role error:', error)
    return NextResponse.json(
      { error: 'Failed to get user role' },
      { status: 500 }
    )
  }
}
