import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { z } from 'zod'

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'STUDENT']).default('STUDENT'),
})

// POST - Create invitation
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin()
    
    const body = await request.json()
    const { email, role } = inviteSchema.parse(body)

    const adminRole = admin.role as 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT'

    // Only SUPER_ADMIN can create SUPER_ADMIN
    if (role === 'SUPER_ADMIN' && adminRole !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Only Super Admin can create Super Admin users' },
        { status: 403 }
      )
    }

    // Only SUPER_ADMIN and ADMIN can create admins
    if (role === 'ADMIN' && adminRole !== 'SUPER_ADMIN' && adminRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only Super Admin and Admin can create admin users' },
        { status: 403 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Check for existing pending invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        acceptedAt: null,
        expiresAt: { gt: new Date() }
      }
    })

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'An active invitation already exists for this email' },
        { status: 400 }
      )
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        invitedBy: admin.id,
        role: role as 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT',
        expiresAt,
      }
    })

    // TODO: Send invitation email with link
    // Link format: /invite/[token]

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        token: invitation.token,
        expiresAt: invitation.expiresAt,
      }
    })
  } catch (error) {
    console.error('Invitation error:', error)
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    )
  }
}

// GET - List all invitations
export async function GET() {
  try {
    await requireAdmin()
    
    const invitations = await prisma.invitation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        inviter: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json({ invitations })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    )
  }
}
