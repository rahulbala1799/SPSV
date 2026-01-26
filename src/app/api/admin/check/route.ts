import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * Check if current user is admin
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { isAdmin: false, authenticated: false },
        { status: 200 }
      )
    }
    
    return NextResponse.json(
      {
        isAdmin: user.role === 'ADMIN',
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Check admin error:', error)
    return NextResponse.json(
      { isAdmin: false, authenticated: false, error: 'Failed to check admin status' },
      { status: 500 }
    )
  }
}
