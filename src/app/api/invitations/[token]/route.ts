import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const acceptInviteSchema = z.object({
  name: z.string().min(2),
  password: z.string().min(8),
  confirmPassword: z.string().optional(),
})

// GET - Validate invitation token
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token: params.token }
    })

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation token' },
        { status: 404 }
      )
    }

    if (invitation.acceptedAt) {
      return NextResponse.json(
        { error: 'This invitation has already been accepted' },
        { status: 400 }
      )
    }

    if (new Date() > invitation.expiresAt) {
      return NextResponse.json(
        { error: 'This invitation has expired' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      email: invitation.email,
      role: invitation.role,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to validate invitation' },
      { status: 500 }
    )
  }
}

// POST - Accept invitation and create user
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token: params.token }
    })

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation token' },
        { status: 404 }
      )
    }

    if (invitation.acceptedAt) {
      return NextResponse.json(
        { error: 'This invitation has already been accepted' },
        { status: 400 }
      )
    }

    if (new Date() > invitation.expiresAt) {
      return NextResponse.json(
        { error: 'This invitation has expired' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, password } = acceptInviteSchema.parse(body)

    // Create user in Better Auth
    const authResponse = await auth.api.signUpEmail({
      body: {
        email: invitation.email,
        password,
        name,
      },
      headers: request.headers as any,
    })

    if (!authResponse?.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Better Auth creates its own user table, but we need to sync with our users table
    // Update our users table to match Better Auth user
    const user = await prisma.user.upsert({
      where: { id: authResponse.user.id },
      update: {
        email: invitation.email,
        name,
        role: invitation.role as any,
        invitedBy: invitation.invitedBy,
        invitedAt: new Date(),
        emailVerified: new Date(),
      },
      create: {
        id: authResponse.user.id,
        email: invitation.email,
        name,
        password: '', // Better Auth handles password
        role: invitation.role as any,
        invitedBy: invitation.invitedBy,
        invitedAt: new Date(),
        emailVerified: new Date(),
      }
    })

    // Mark invitation as accepted
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    })
  } catch (error) {
    console.error('Accept invitation error:', error)
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    )
  }
}
