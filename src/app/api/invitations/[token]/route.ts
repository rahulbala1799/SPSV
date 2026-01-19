import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stackServerApp } from '@/lib/stack'
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

    // Create user in Neon Auth
    const stackUser = await stackServerApp().createUser({
      primaryEmail: invitation.email,
      displayName: name,
      password,
      clientMetadata: {
        role: invitation.role,
      },
      serverMetadata: {
        role: invitation.role,
      },
    })

    // Also create in our users table for progress tracking
    const user = await prisma.user.create({
      data: {
        id: stackUser.id, // Use Neon Auth user ID
        email: invitation.email,
        name,
        password: '', // No password needed, Neon Auth handles it
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
