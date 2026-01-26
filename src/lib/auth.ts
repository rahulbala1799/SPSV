import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export interface SessionUser {
  id: string
  email: string
  name: string | null
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT'
}

/**
 * Get user from session/cookie
 * In a real app, you'd use JWT tokens or session cookies
 * For now, we'll use a simple approach
 */
export async function getCurrentUser(request: NextRequest): Promise<SessionUser | null> {
  try {
    // Get userId from cookie (you should implement proper session management)
    const userId = request.cookies.get('userId')?.value
    
    if (!userId) {
      return null
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })
    
    if (!user) {
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Check if user is admin (includes SUPER_ADMIN)
 */
export async function isAdmin(request: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(request)
  return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
}

/**
 * Verify admin access - throws error if not admin (includes SUPER_ADMIN)
 */
export async function requireAdmin(request: NextRequest): Promise<SessionUser> {
  const user = await getCurrentUser(request)
  
  if (!user) {
    throw new Error('Unauthorized - Please login')
  }
  
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    throw new Error('Forbidden - Admin access required')
  }
  
  return user
}
