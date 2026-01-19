# Authentication & Dashboard System - Implementation Plan

## Overview

This document outlines the implementation plan for an authentication system and admin dashboard for SPSV Mastery Class Dublin. The system will allow administrators to invite users, and invited users will be able to log in to access course chapters and practice questions.

**Key Requirements:**
- Single-tenant application (SPSV Dublin only)
- Admin dashboard for user management
- User invitation system
- User authentication (login/logout)
- Chapter access and progress tracking
- Practice questions access
- PostgreSQL database (Neon Server)

---

## Technology Stack

### Backend & Database
- **Next.js 14+** (App Router)
- **PostgreSQL** (Neon Server)
- **Prisma ORM** (Database management)
- **NextAuth.js v5** (Authentication)
- **TypeScript** (Type safety)

### Frontend
- **React** (UI components)
- **Tailwind CSS** (Styling)
- **React Hook Form** (Form handling)
- **Zod** (Schema validation)

---

## Database Schema

### 1. Users Table

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String    // Hashed password
  role          Role      @default(STUDENT)
  invitedBy     String?   // Admin user ID who invited
  invitedAt     DateTime?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  invitations   Invitation[] @relation("InvitedBy")
  progress      ChapterProgress[]
  questionAnswers QuestionAnswer[]
  
  @@map("users")
}

enum Role {
  ADMIN
  STUDENT
}
```

### 2. Invitations Table

```prisma
model Invitation {
  id            String   @id @default(cuid())
  email         String
  token         String   @unique
  invitedBy     String   // User ID (admin)
  role          Role     @default(STUDENT)
  expiresAt     DateTime
  acceptedAt    DateTime?
  createdAt     DateTime @default(now())
  
  // Relations
  inviter       User     @relation("InvitedBy", fields: [invitedBy], references: [id])
  
  @@map("invitations")
  @@index([token])
  @@index([email])
}
```

### 3. Chapter Progress Table

```prisma
model ChapterProgress {
  id            String   @id @default(cuid())
  userId        String
  chapterId     String   // Chapter identifier (e.g., "chapter-1")
  chapterTitle  String
  isCompleted   Boolean  @default(false)
  completedAt   DateTime?
  lastAccessed  DateTime @default(now())
  notes         String?  // User notes
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("chapter_progress")
  @@unique([userId, chapterId])
  @@index([userId])
}
```

### 4. Question Answers Table

```prisma
model QuestionAnswer {
  id            String   @id @default(cuid())
  userId        String
  chapterId     String
  questionId    String   // Question identifier
  selectedAnswer String  // User's selected answer (A, B, C, D)
  isCorrect     Boolean
  answeredAt    DateTime @default(now())
  
  // Relations
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("question_answers")
  @@index([userId, chapterId])
  @@index([userId])
}
```

### Complete Prisma Schema File

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  role          Role      @default(STUDENT)
  invitedBy     String?
  invitedAt     DateTime?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  invitations   Invitation[] @relation("InvitedBy")
  progress      ChapterProgress[]
  questionAnswers QuestionAnswer[]
  
  @@map("users")
}

enum Role {
  ADMIN
  STUDENT
}

model Invitation {
  id            String   @id @default(cuid())
  email         String
  token         String   @unique
  invitedBy     String
  role          Role     @default(STUDENT)
  expiresAt     DateTime
  acceptedAt    DateTime?
  createdAt     DateTime @default(now())
  
  inviter       User     @relation("InvitedBy", fields: [invitedBy], references: [id])
  
  @@map("invitations")
  @@index([token])
  @@index([email])
}

model ChapterProgress {
  id            String   @id @default(cuid())
  userId        String
  chapterId     String
  chapterTitle  String
  isCompleted   Boolean  @default(false)
  completedAt   DateTime?
  lastAccessed  DateTime @default(now())
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("chapter_progress")
  @@unique([userId, chapterId])
  @@index([userId])
}

model QuestionAnswer {
  id            String   @id @default(cuid())
  userId        String
  chapterId     String
  questionId    String
  selectedAnswer String
  isCorrect     Boolean
  answeredAt    DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("question_answers")
  @@index([userId, chapterId])
  @@index([userId])
}
```

---

## Environment Variables

Create `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# App
APP_NAME="SPSV Mastery Class Dublin"
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── invite/
│   │   │   └── [token]/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx (Student Dashboard)
│   │   │   └── chapters/
│   │   │       └── [chapterId]/
│   │   │           └── page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx (Admin Dashboard)
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   └── invitations/
│   │   │       └── page.tsx
│   │   └── layout.tsx (Protected layout)
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── users/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── invitations/
│   │   │   ├── route.ts
│   │   │   └── [token]/
│   │   │       └── route.ts
│   │   ├── progress/
│   │   │   └── route.ts
│   │   └── questions/
│   │       └── route.ts
│   └── layout.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── InviteForm.tsx
│   │   └── AcceptInviteForm.tsx
│   ├── dashboard/
│   │   ├── DashboardStats.tsx
│   │   ├── ChapterCard.tsx
│   │   ├── ProgressBar.tsx
│   │   └── QuestionCard.tsx
│   └── admin/
│       ├── UserTable.tsx
│       ├── InvitationTable.tsx
│       └── InviteUserModal.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── validations.ts
└── types/
    └── index.ts
```

---

## Implementation Steps

### Step 1: Setup Prisma & Database

#### 1.1 Install Dependencies

```bash
npm install @prisma/client
npm install -D prisma
npm install next-auth@beta
npm install bcryptjs
npm install @types/bcryptjs
npm install zod
npm install react-hook-form @hookform/resolvers
```

#### 1.2 Initialize Prisma

```bash
npx prisma init
```

#### 1.3 Create Prisma Client

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

#### 1.4 Run Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### Step 2: Setup NextAuth.js v5

#### 2.1 Create Auth Configuration

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
```

#### 2.2 Create NextAuth Route Handler

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

#### 2.3 Create Auth Utilities

```typescript
// src/lib/auth-utils.ts
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== "ADMIN") {
    redirect("/dashboard")
  }
  return user
}
```

---

### Step 3: Create Authentication Pages

#### 3.1 Login Page

```typescript
// src/app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your course</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <LoginForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}
```

#### 3.2 Login Form Component

```typescript
// src/components/auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void
  loading?: boolean
}

export function LoginForm({ onSubmit, loading }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your.email@example.com"
        required
        disabled={loading}
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
        disabled={loading}
      />

      <Button
        type="submit"
        variant="primary"
        size="large"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
```

---

### Step 4: Create Invitation System

#### 4.1 Invitation API Route

```typescript
// src/app/api/invitations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { z } from 'zod'

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'STUDENT']).default('STUDENT'),
})

// POST - Create invitation
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin()
    
    const body = await request.json()
    const { email, role } = inviteSchema.parse(body)

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
        role,
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
```

#### 4.2 Accept Invitation API Route

```typescript
// src/app/api/invitations/[token]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const acceptInviteSchema = z.object({
  name: z.string().min(2),
  password: z.string().min(8),
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: invitation.email,
        name,
        password: hashedPassword,
        role: invitation.role,
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
```

#### 4.3 Accept Invitation Page

```typescript
// src/app/(auth)/invite/[token]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AcceptInviteForm } from '@/components/auth/AcceptInviteForm'

export default function AcceptInvitePage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invitation, setInvitation] = useState<{ email: string; role: string } | null>(null)

  useEffect(() => {
    async function validateInvitation() {
      try {
        const response = await fetch(`/api/invitations/${params.token}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Invalid invitation')
          return
        }

        setInvitation(data)
      } catch (error) {
        setError('Failed to validate invitation')
      } finally {
        setLoading(false)
      }
    }

    validateInvitation()
  }, [params.token])

  const handleSubmit = async (name: string, password: string) => {
    try {
      const response = await fetch(`/api/invitations/${params.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to accept invitation')
        return
      }

      // Redirect to login
      router.push('/login?message=Account created successfully. Please sign in.')
    } catch (error) {
      setError('An error occurred. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating invitation...</p>
        </div>
      </div>
    )
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-red-600 text-5xl mb-4">✕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
          <p className="text-gray-600 mb-6">{error || 'This invitation link is invalid or has expired.'}</p>
          <a href="/login" className="text-green-600 hover:underline">Go to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accept Invitation</h1>
          <p className="text-gray-600">Create your account to get started</p>
          <p className="text-sm text-gray-500 mt-2">Email: {invitation.email}</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <AcceptInviteForm onSubmit={handleSubmit} email={invitation.email} />
      </div>
    </div>
  )
}
```

---

### Step 5: Create Protected Dashboard Layout

#### 5.1 Dashboard Layout

```typescript
// src/app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-utils'
import { Header } from '@/components/Header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>{children}</main>
    </div>
  )
}
```

#### 5.2 Student Dashboard

```typescript
// src/app/(dashboard)/dashboard/page.tsx
import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { ChapterCard } from '@/components/dashboard/ChapterCard'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { manualChapters } from '@/data/manualContent'

export default async function DashboardPage() {
  const user = await requireAuth()

  // Get user progress
  const progress = await prisma.chapterProgress.findMany({
    where: { userId: user.id },
  })

  // Get question answers count
  const questionAnswers = await prisma.questionAnswer.findMany({
    where: { userId: user.id },
  })

  const progressMap = new Map(
    progress.map(p => [p.chapterId, p])
  )

  const stats = {
    totalChapters: manualChapters.length,
    completedChapters: progress.filter(p => p.isCompleted).length,
    totalQuestions: questionAnswers.length,
    correctAnswers: questionAnswers.filter(q => q.isCorrect).length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name || user.email}!
        </h1>
        <p className="text-gray-600">
          Continue your SPSV test preparation
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Chapters</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {manualChapters.map((chapter) => {
            const chapterProgress = progressMap.get(chapter.id)
            return (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                progress={chapterProgress}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
```

---

### Step 6: Create Admin Dashboard

#### 6.1 Admin Dashboard Page

```typescript
// src/app/(dashboard)/admin/page.tsx
import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { UserTable } from '@/components/admin/UserTable'
import { InvitationTable } from '@/components/admin/InvitationTable'
import { InviteUserModal } from '@/components/admin/InviteUserModal'

export default async function AdminDashboardPage() {
  await requireAdmin()

  const [users, invitations] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            progress: true,
            questionAnswers: true,
          }
        }
      }
    }),
    prisma.invitation.findMany({
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
  ])

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.emailVerified).length,
    pendingInvitations: invitations.filter(i => !i.acceptedAt).length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and invitations</p>
        </div>
        <InviteUserModal />
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Invitations</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingInvitations}</p>
        </div>
      </div>

      {/* Tables */}
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Users</h2>
          <UserTable users={users} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Invitations</h2>
          <InvitationTable invitations={invitations} />
        </div>
      </div>
    </div>
  )
}
```

---

### Step 7: Create Progress Tracking API

#### 7.1 Progress API Route

```typescript
// src/app/api/progress/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const progressSchema = z.object({
  chapterId: z.string(),
  chapterTitle: z.string(),
  isCompleted: z.boolean().optional(),
  notes: z.string().optional(),
})

// GET - Get user progress
export async function GET() {
  try {
    const user = await requireAuth()
    
    const progress = await prisma.chapterProgress.findMany({
      where: { userId: user.id },
      orderBy: { lastAccessed: 'desc' },
    })

    return NextResponse.json({ progress })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

// POST - Update progress
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const data = progressSchema.parse(body)

    const progress = await prisma.chapterProgress.upsert({
      where: {
        userId_chapterId: {
          userId: user.id,
          chapterId: data.chapterId,
        }
      },
      update: {
        chapterTitle: data.chapterTitle,
        isCompleted: data.isCompleted ?? undefined,
        notes: data.notes,
        lastAccessed: new Date(),
        completedAt: data.isCompleted ? new Date() : undefined,
      },
      create: {
        userId: user.id,
        chapterId: data.chapterId,
        chapterTitle: data.chapterTitle,
        isCompleted: data.isCompleted ?? false,
        notes: data.notes,
        lastAccessed: new Date(),
        completedAt: data.isCompleted ? new Date() : undefined,
      }
    })

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Progress error:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
```

---

### Step 8: Create Question Answer API

#### 8.1 Question Answer API Route

```typescript
// src/app/api/questions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const answerSchema = z.object({
  chapterId: z.string(),
  questionId: z.string(),
  selectedAnswer: z.string(),
  isCorrect: z.boolean(),
})

// POST - Save question answer
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const data = answerSchema.parse(body)

    const answer = await prisma.questionAnswer.create({
      data: {
        userId: user.id,
        chapterId: data.chapterId,
        questionId: data.questionId,
        selectedAnswer: data.selectedAnswer,
        isCorrect: data.isCorrect,
      }
    })

    return NextResponse.json({ answer })
  } catch (error) {
    console.error('Question answer error:', error)
    return NextResponse.json(
      { error: 'Failed to save answer' },
      { status: 500 }
    )
  }
}

// GET - Get user's question answers
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const chapterId = searchParams.get('chapterId')

    const answers = await prisma.questionAnswer.findMany({
      where: {
        userId: user.id,
        ...(chapterId && { chapterId }),
      },
      orderBy: { answeredAt: 'desc' },
    })

    return NextResponse.json({ answers })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch answers' },
      { status: 500 }
    )
  }
}
```

---

## Missing Components & Utilities Implementation

### Step 9: Create Missing UI Components

#### 9.1 Input Component (CRITICAL - Used Everywhere)

```typescript
// src/components/Input.tsx
import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  className?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
          error 
            ? 'border-red-500 bg-red-50' 
            : disabled
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
```

#### 9.2 Button Component (CRITICAL - Used Everywhere)

```typescript
// src/components/Button.tsx
import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantStyles = {
    primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:bg-green-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 active:bg-gray-800',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500 active:bg-green-100 bg-transparent',
  }
  
  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

#### 9.3 Accept Invite Form Component

```typescript
// src/components/auth/AcceptInviteForm.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'

interface AcceptInviteFormProps {
  onSubmit: (name: string, password: string) => void
  email: string
  loading?: boolean
}

export function AcceptInviteForm({ onSubmit, email, loading }: AcceptInviteFormProps) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(name, password)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your full name"
        required
        disabled={loading}
        error={errors.name}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-500">This email was used for your invitation</p>
      </div>

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a password (min. 8 characters)"
        required
        disabled={loading}
        error={errors.password}
      />

      <Input
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your password"
        required
        disabled={loading}
        error={errors.confirmPassword}
      />

      <Button
        type="submit"
        variant="primary"
        size="large"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  )
}
```

#### 9.2 Dashboard Stats Component

```typescript
// src/components/dashboard/DashboardStats.tsx
'use client'

interface DashboardStatsProps {
  stats: {
    totalChapters: number
    completedChapters: number
    totalQuestions: number
    correctAnswers: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const completionPercentage = stats.totalChapters > 0
    ? Math.round((stats.completedChapters / stats.totalChapters) * 100)
    : 0

  const accuracyPercentage = stats.totalQuestions > 0
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Chapters Completed</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.completedChapters} / {stats.totalChapters}
            </p>
          </div>
          <div className="text-3xl">📚</div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{completionPercentage}% Complete</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Questions Answered</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalQuestions}</p>
          </div>
          <div className="text-3xl">❓</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Correct Answers</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.correctAnswers}
            </p>
          </div>
          <div className="text-3xl">✅</div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${accuracyPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{accuracyPercentage}% Accuracy</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Progress</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{completionPercentage}%</p>
          </div>
          <div className="text-3xl">📊</div>
        </div>
      </div>
    </div>
  )
}
```

#### 9.3 Chapter Card Component

```typescript
// src/components/dashboard/ChapterCard.tsx
'use client'

import Link from 'next/link'
import { FaBook, FaCheckCircle, FaClock } from 'react-icons/fa'

interface ChapterProgress {
  id: string
  chapterId: string
  isCompleted: boolean
  lastAccessed: Date
  notes?: string | null
}

interface Chapter {
  id: string
  title: string
  pageRange?: { start: number; end: number }
}

interface ChapterCardProps {
  chapter: Chapter
  progress?: ChapterProgress
}

export function ChapterCard({ chapter, progress }: ChapterCardProps) {
  const isCompleted = progress?.isCompleted || false
  const lastAccessed = progress?.lastAccessed
    ? new Date(progress.lastAccessed).toLocaleDateString()
    : null

  return (
    <Link href={`/dashboard/chapters/${chapter.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-green-500 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
              <FaBook className={isCompleted ? 'text-green-600' : 'text-blue-600'} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{chapter.title}</h3>
              {chapter.pageRange && (
                <p className="text-sm text-gray-500">
                  Pages {chapter.pageRange.start}-{chapter.pageRange.end}
                </p>
              )}
            </div>
          </div>
          {isCompleted && (
            <FaCheckCircle className="text-green-500 text-xl" />
          )}
        </div>

        <div className="space-y-2">
          {lastAccessed && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaClock className="text-xs" />
              <span>Last accessed: {lastAccessed}</span>
            </div>
          )}

          {progress?.notes && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <p className="font-medium mb-1">Your Notes:</p>
              <p className="text-xs">{progress.notes.substring(0, 100)}...</p>
            </div>
          )}

          <div className="pt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              isCompleted
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {isCompleted ? 'Completed' : 'In Progress'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
```

#### 9.4 User Table Component

```typescript
// src/components/admin/UserTable.tsx
'use client'

import { FaEnvelope, FaUser, FaCalendarAlt } from 'react-icons/fa'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: Date
  emailVerified: Date | null
  _count: {
    progress: number
    questionAnswers: number
  }
}

interface UserTableProps {
  users: User[]
}

export function UserTable({ users }: UserTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Questions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FaUser className="text-green-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || 'No name'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <FaEnvelope className="text-xs" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user._count.progress} chapters
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user._count.questionAnswers} answered
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt className="text-xs" />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.emailVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.emailVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No users found
        </div>
      )}
    </div>
  )
}
```

#### 9.5 Invitation Table Component

```typescript
// src/components/admin/InvitationTable.tsx
'use client'

import { FaEnvelope, FaUser, FaClock, FaCheckCircle, FaTimes } from 'react-icons/fa'

interface Invitation {
  id: string
  email: string
  token: string
  role: string
  expiresAt: Date
  acceptedAt: Date | null
  createdAt: Date
  inviter: {
    name: string | null
    email: string
  }
}

interface InvitationTableProps {
  invitations: Invitation[]
}

export function InvitationTable({ invitations }: InvitationTableProps) {
  const getInviteLink = (token: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/invite/${token}`
    }
    return ''
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invited By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invite Link
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expires
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invitations.map((invitation) => {
              const isExpired = new Date() > new Date(invitation.expiresAt)
              const isAccepted = invitation.acceptedAt !== null
              const inviteLink = getInviteLink(invitation.token)

              return (
                <tr key={invitation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {invitation.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      invitation.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {invitation.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaUser className="text-xs" />
                      {invitation.inviter.name || invitation.inviter.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {!isAccepted && !isExpired ? (
                      <button
                        onClick={() => copyToClipboard(inviteLink)}
                        className="text-xs text-green-600 hover:text-green-700 underline"
                      >
                        Copy Link
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaClock className="text-xs" />
                      {new Date(invitation.expiresAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isAccepted ? (
                      <span className="flex items-center gap-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <FaCheckCircle />
                        Accepted
                      </span>
                    ) : isExpired ? (
                      <span className="flex items-center gap-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        <FaTimes />
                        Expired
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {invitations.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No invitations found
        </div>
      )}
    </div>
  )
}
```

#### 9.6 Invite User Modal Component

```typescript
// src/components/admin/InviteUserModal.tsx
'use client'

import { useState } from 'react'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'

export function InviteUserModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'STUDENT'>('STUDENT')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create invitation')
        return
      }

      setSuccess(true)
      setEmail('')
      setRole('STUDENT')
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
        window.location.reload() // Refresh to show new invitation
      }, 2000)
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="primary"
        size="medium"
        className="flex items-center gap-2"
      >
        <FaPlus />
        Invite User
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Invite User</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  Invitation sent successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                  disabled={loading}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'ADMIN' | 'STUDENT')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={loading}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

### Step 10: Create Missing Type Definitions

#### 10.1 Type Definitions File

```typescript
// src/types/index.ts

// NextAuth type extensions
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    role: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
  }
}

// Chapter types
export interface Chapter {
  id: string
  title: string
  pageRange?: {
    start: number
    end: number
  }
  summary?: string
}

// Progress types
export interface ChapterProgress {
  id: string
  userId: string
  chapterId: string
  chapterTitle: string
  isCompleted: boolean
  completedAt?: Date | null
  lastAccessed: Date
  notes?: string | null
}

// Question types
export interface QuestionAnswer {
  id: string
  userId: string
  chapterId: string
  questionId: string
  selectedAnswer: string
  isCorrect: boolean
  answeredAt: Date
}

// User types
export interface User {
  id: string
  email: string
  name?: string | null
  role: 'ADMIN' | 'STUDENT'
  createdAt: Date
  emailVerified?: Date | null
}

// Invitation types
export interface Invitation {
  id: string
  email: string
  token: string
  role: 'ADMIN' | 'STUDENT'
  expiresAt: Date
  acceptedAt?: Date | null
  createdAt: Date
  inviter: {
    name?: string | null
    email: string
  }
}
```

### Step 11: Create Missing Utilities

#### 11.1 Utils File

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-IE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0
  return Math.round((part / total) * 100)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
```

#### 11.2 Validations File

```typescript
// src/lib/validations.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const acceptInviteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const inviteUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'STUDENT']).default('STUDENT'),
})

export const updateProgressSchema = z.object({
  chapterId: z.string().min(1),
  chapterTitle: z.string().min(1),
  isCompleted: z.boolean().optional(),
  notes: z.string().optional(),
})

export const questionAnswerSchema = z.object({
  chapterId: z.string().min(1),
  questionId: z.string().min(1),
  selectedAnswer: z.string().min(1),
  isCorrect: z.boolean(),
})
```

### Step 12: Update Manual Content Data

#### 12.1 Complete Manual Content File

```typescript
// src/data/manualContent.ts
// This should load from your existing pdf-organized.json or manual content

export interface ChapterContent {
  pageNumber: number
  content: string
}

export interface ManualChapter {
  id: string
  title: string
  pageRange: { start: number; end: number }
  totalPages: number
  summary: string
  pages: ChapterContent[]
}

// Load from your existing JSON structure
// You can import from pdf-organized.json or create a static array
export const manualChapters: ManualChapter[] = [
  {
    id: 'chapter-1',
    title: 'Welcome',
    pageRange: { start: 7, end: 7 },
    totalPages: 1,
    summary: 'Welcome to The Official Manual for Operating in the SPSV Industry',
    pages: [
      {
        pageNumber: 7,
        content: 'Welcome content...' // Load from your JSON
      }
    ]
  },
  {
    id: 'chapter-2',
    title: 'Terminology',
    pageRange: { start: 8, end: 12 },
    totalPages: 5,
    summary: 'Key terms and definitions used in the SPSV industry',
    pages: []
  },
  // Add all 14 chapters from your manual
  // You can dynamically load from pdf-organized.json
]

// Function to load from JSON file
export async function loadManualChapters(): Promise<ManualChapter[]> {
  try {
    // In production, fetch from your JSON file
    const response = await fetch('/pdf-organized.json')
    const data = await response.json()
    
    // Transform your JSON structure to ManualChapter format
    return data.map((chapter: any) => ({
      id: `chapter-${chapter.chapterId || chapter.id}`,
      title: chapter.title || chapter.name,
      pageRange: chapter.pageRange || { start: 0, end: 0 },
      totalPages: chapter.totalPages || 0,
      summary: chapter.summary || '',
      pages: chapter.pages || []
    }))
  } catch (error) {
    console.error('Failed to load manual chapters:', error)
    return manualChapters // Fallback to static data
  }
}
```

### Step 13: Update Header Component for Auth

#### 13.1 Updated Header with Auth

```typescript
// src/components/Header.tsx (Update existing)
'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

export function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="SPSV Mastery Class Dublin"
              width={60}
              height={60}
              className="h-12 w-12"
            />
          </Link>

          {session ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Dashboard
              </Link>
              {session.user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{session.user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-green-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
```

### Step 14: Add Required Dependencies

#### 14.1 Install All Dependencies

```bash
npm install @prisma/client next-auth@beta bcryptjs zod react-hook-form @hookform/resolvers clsx tailwind-merge react-icons resend
npm install -D prisma @types/bcryptjs
```

#### 14.2 Complete package.json Dependencies

```json
{
  "name": "spsv-mastery-class",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@prisma/client": "^5.7.0",
    "bcryptjs": "^2.4.3",
    "clsx": "^2.0.0",
    "next": "^14.0.0",
    "next-auth": "^5.0.0-beta.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.2",
    "react-icons": "^4.12.0",
    "resend": "^2.0.0",
    "tailwind-merge": "^2.1.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "prisma": "^5.7.0",
    "typescript": "^5.3.0"
  }
}
```

### Step 15: Setup SessionProvider (CRITICAL for NextAuth)

#### 15.1 Create Session Provider Wrapper

```typescript
// src/components/providers/SessionProvider.tsx
'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export function SessionProvider({ children }: { children: ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
```

#### 15.2 Update Root Layout with SessionProvider

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { ToastProvider } from '@/contexts/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SPSV Mastery Class Dublin',
  description: 'Professional SPSV test preparation courses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
```

### Step 16: Create Chapter Detail Page (CRITICAL - Referenced but Missing)

#### 16.1 Chapter Detail Page

```typescript
// src/app/(dashboard)/dashboard/chapters/[chapterId]/page.tsx
import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { manualChapters } from '@/data/manualContent'
import { notFound } from 'next/navigation'
import { ChapterSection } from '@/components/manual/ChapterSection'
import { ChapterQuestions } from '@/components/manual/ChapterQuestions'
import Link from 'next/link'
import { FaArrowLeft, FaBook } from 'react-icons/fa'

export default async function ChapterDetailPage({
  params,
}: {
  params: { chapterId: string }
}) {
  const user = await requireAuth()
  
  // Find the chapter
  const chapter = manualChapters.find(c => c.id === params.chapterId)
  
  if (!chapter) {
    notFound()
  }

  // Get user's progress for this chapter
  const progress = await prisma.chapterProgress.findUnique({
    where: {
      userId_chapterId: {
        userId: user.id,
        chapterId: params.chapterId,
      }
    }
  })

  // Get user's question answers for this chapter
  const questionAnswers = await prisma.questionAnswer.findMany({
    where: {
      userId: user.id,
      chapterId: params.chapterId,
    }
  })

  // Create a map of answered questions
  const answeredQuestions = new Map(
    questionAnswers.map(qa => [qa.questionId, qa])
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-4 transition-colors"
        >
          <FaArrowLeft />
          Back to Dashboard
        </Link>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <FaBook className="text-green-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{chapter.title}</h1>
            {chapter.pageRange && (
              <p className="text-gray-600">
                Pages {chapter.pageRange.start}-{chapter.pageRange.end}
              </p>
            )}
          </div>
        </div>

        {progress && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Progress</p>
                <p className="text-lg font-semibold text-gray-900">
                  {progress.isCompleted ? 'Completed' : 'In Progress'}
                </p>
              </div>
              {progress.isCompleted && (
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                  ✓ Completed
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chapter Content */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <ChapterSection
          chapter={chapter}
          progress={progress}
        />
      </div>

      {/* Chapter Questions */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Practice Questions
        </h2>
        <ChapterQuestions
          chapterId={params.chapterId}
          answeredQuestions={answeredQuestions}
        />
      </div>
    </div>
  )
}
```

#### 16.2 Update ChapterSection Component for Dashboard

```typescript
// src/components/manual/ChapterSection.tsx (Update existing or create new)
'use client'

import { useState, useEffect } from 'react'
import { ChapterProgress } from '@/types'

interface Chapter {
  id: string
  title: string
  pages: Array<{ pageNumber: number; content: string }>
  summary?: string
}

interface ChapterSectionProps {
  chapter: Chapter
  progress?: ChapterProgress | null
}

export function ChapterSection({ chapter, progress }: ChapterSectionProps) {
  const [isCompleted, setIsCompleted] = useState(progress?.isCompleted || false)
  const [notes, setNotes] = useState(progress?.notes || '')

  // Update progress when completed
  const handleComplete = async () => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          isCompleted: !isCompleted,
        }),
      })

      if (response.ok) {
        setIsCompleted(!isCompleted)
      }
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  // Save notes
  const handleSaveNotes = async () => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          notes,
        }),
      })
    } catch (error) {
      console.error('Failed to save notes:', error)
    }
  }

  return (
    <div className="space-y-6">
      {chapter.summary && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-gray-700">{chapter.summary}</p>
        </div>
      )}

      {chapter.pages.map((page, index) => (
        <div key={index} className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {page.content}
          </div>
        </div>
      ))}

      {/* Notes Section */}
      <div className="border-t pt-6 mt-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleSaveNotes}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Add your notes here..."
        />
      </div>

      {/* Complete Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleComplete}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            isCompleted
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
        </button>
      </div>
    </div>
  )
}
```

#### 16.3 Update ChapterQuestions Component for Dashboard

```typescript
// src/components/manual/ChapterQuestions.tsx (Update existing)
'use client'

import { useState, useEffect } from 'react'
import { QuestionAnswer } from '@/types'
import { manualQuestions } from '@/data/manualQuestions'

interface ChapterQuestionsProps {
  chapterId: string
  answeredQuestions: Map<string, QuestionAnswer>
}

export function ChapterQuestions({ chapterId, answeredQuestions }: ChapterQuestionsProps) {
  // Get questions for this chapter
  const chapterQuestions = manualQuestions.find(q => q.chapterId === chapterId)?.questions || []

  const handleAnswer = async (questionId: string, selectedAnswer: string, correctAnswer: string) => {
    const isCorrect = selectedAnswer === correctAnswer

    try {
      await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId,
          questionId,
          selectedAnswer,
          isCorrect,
        }),
      })

      // Refresh page to show updated answer
      window.location.reload()
    } catch (error) {
      console.error('Failed to save answer:', error)
    }
  }

  return (
    <div className="space-y-6">
      {chapterQuestions.map((question, index) => {
        const userAnswer = answeredQuestions.get(question.id)
        const isAnswered = !!userAnswer

        return (
          <div
            key={question.id}
            className={`border-2 rounded-lg p-6 ${
              isAnswered
                ? userAnswer.isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Question {index + 1}: {question.question}
            </h3>

            <div className="space-y-2 mb-4">
              {question.options.map((option) => {
                const isSelected = userAnswer?.selectedAnswer === option.id
                const isCorrect = option.id === question.correctAnswer

                return (
                  <button
                    key={option.id}
                    onClick={() => !isAnswered && handleAnswer(question.id, option.id, question.correctAnswer)}
                    disabled={isAnswered}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                      isAnswered
                        ? isCorrect
                          ? 'border-green-500 bg-green-100'
                          : isSelected
                          ? 'border-red-500 bg-red-100'
                          : 'border-gray-200 bg-gray-50'
                        : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
                    } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{option.id}.</span>
                      <span>{option.label}</span>
                      {isAnswered && isCorrect && (
                        <span className="ml-auto text-green-600 font-bold">✓</span>
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <span className="ml-auto text-red-600 font-bold">✗</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {isAnswered && question.explanation && (
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Explanation:</strong> {question.explanation}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

---

## Additional Infrastructure & Considerations

### Step 17: Email Service Setup (Optional but Recommended)

#### 15.1 Install Email Service

For sending invitation emails, you can use services like:
- **Resend** (Recommended for Next.js)
- **SendGrid**
- **AWS SES**
- **Nodemailer** (for custom SMTP)

#### 15.2 Resend Integration Example

```bash
npm install resend
```

```typescript
// src/lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInvitationEmail(
  email: string,
  inviteLink: string,
  inviterName?: string
) {
  try {
    await resend.emails.send({
      from: 'SPSV Mastery Class <noreply@spsv-dublin.ie>',
      to: email,
      subject: 'You\'ve been invited to SPSV Mastery Class',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Welcome to SPSV Mastery Class Dublin!</h1>
          <p>${inviterName || 'An administrator'} has invited you to join our platform.</p>
          <p>Click the button below to accept your invitation and create your account:</p>
          <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Accept Invitation
          </a>
          <p style="color: #666; font-size: 12px;">This invitation will expire in 7 days.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this invitation, you can safely ignore this email.</p>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}
```

#### 15.3 Update Invitation API to Send Email

Update `/src/app/api/invitations/route.ts` POST handler:

```typescript
// After creating invitation, add:
import { sendInvitationEmail } from '@/lib/email'

// ... existing code ...

const inviteLink = `${process.env.NEXTAUTH_URL}/invite/${invitation.token}`

// Send email (non-blocking)
sendInvitationEmail(invitation.email, inviteLink, admin.name || admin.email)
  .catch(err => console.error('Failed to send invitation email:', err))

return NextResponse.json({ ... })
```

### Step 18: Environment Variable Validation

#### 16.1 Create Env Validation

```typescript
// src/lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  RESEND_API_KEY: z.string().optional(),
})

export function validateEnv() {
  try {
    return envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
    })
  } catch (error) {
    console.error('❌ Invalid environment variables:', error)
    throw new Error('Invalid environment variables')
  }
}

// Call this in your app initialization
// validateEnv()
```

### Step 19: Error Boundaries & Loading States

#### 17.1 Error Boundary Component

```typescript
// src/components/ErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'
import { Button } from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: undefined })
                window.location.reload()
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

#### 17.2 Loading Component

```typescript
// src/components/Loading.tsx
export function Loading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
```

### Step 20: Toast Notification System

#### 18.1 Toast Context

```typescript
// src/contexts/ToastContext.tsx
'use client'

import { createContext, useContext, useState, useCallback } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { id, message, type }])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// Toast Container Component
function ToastContainer({ toasts, onRemove }: { toasts: Toast[], onRemove: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`min-w-[300px] p-4 rounded-lg shadow-lg flex items-center justify-between ${
            toast.type === 'success' ? 'bg-green-500 text-white' :
            toast.type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}
        >
          <p>{toast.message}</p>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-4 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
```

#### 20.2 Wrap App with Toast Provider

This is already done in Step 15.2 above - the ToastProvider is included in the root layout along with SessionProvider.

---

## Complete Implementation Checklist

### ✅ Core Components (All Provided)
- [x] Input component
- [x] Button component
- [x] Header component (with auth)
- [x] LoginForm component
- [x] AcceptInviteForm component
- [x] DashboardStats component
- [x] ChapterCard component
- [x] UserTable component
- [x] InvitationTable component
- [x] InviteUserModal component

### ✅ Data & Types (All Provided)
- [x] Type definitions (NextAuth extensions)
- [x] Manual content structure
- [x] Chapter types
- [x] Progress types
- [x] User types
- [x] Invitation types

### ✅ Utilities (All Provided)
- [x] Utils file (cn, formatDate, etc.)
- [x] Validations file (Zod schemas)
- [x] Prisma client setup
- [x] Auth utilities

### ✅ Infrastructure (All Provided)
- [x] Error boundaries
- [x] Loading components
- [x] Toast notification system
- [x] Email service integration (Resend example)
- [x] Environment variable validation

### ⚠️ Optional Enhancements
- [ ] Email service (Resend/SendGrid) - Code provided, needs API key
- [ ] Password reset functionality
- [ ] User profile page
- [ ] Progress analytics/charts
- [ ] Export functionality
- [ ] Notification system
- [ ] Chapter completion certificates

---

## ✅ CRITICAL FIXES - All Missing Components Added

### Fixed Issues:

1. **✅ Input Component** - Added complete implementation with proper TypeScript types extending HTMLInputElement
2. **✅ Button Component** - Added complete implementation with proper TypeScript types extending HTMLButtonElement
3. **✅ react-icons** - Added to package.json dependencies
4. **✅ SessionProvider** - Created wrapper component and added to root layout (Step 15)
5. **✅ Chapter Detail Page** - Complete implementation at `/dashboard/chapters/[chapterId]/page.tsx` (Step 16)
6. **✅ Complete package.json** - All dependencies including Next.js, React, TypeScript, react-icons
7. **✅ ChapterSection Component** - Updated for dashboard use with progress tracking
8. **✅ ChapterQuestions Component** - Updated for dashboard use with answer saving

### Build Errors Fixed:

- ❌ `Module not found: '@/components/Input'` → ✅ **FIXED** (Step 9.1)
- ❌ `Module not found: '@/components/Button'` → ✅ **FIXED** (Step 9.2)
- ❌ `Module not found: 'react-icons/fa'` → ✅ **FIXED** (Step 14.1 - added react-icons)
- ❌ `Property 'role' does not exist on type 'Session'` → ✅ **FIXED** (Step 10.1 - type definitions)
- ❌ `useSession() must be wrapped in <SessionProvider>` → ✅ **FIXED** (Step 15)
- ❌ `Chapter detail page 404` → ✅ **FIXED** (Step 16.1)

### Implementation Order:

1. **Step 1-8**: Database, Auth, API routes
2. **Step 9**: CRITICAL - Input & Button components (must be first!)
3. **Step 10**: Type definitions
4. **Step 11-13**: Utilities, data, Header
5. **Step 14**: Install dependencies (including react-icons)
6. **Step 15**: SessionProvider setup (CRITICAL for NextAuth)
7. **Step 16**: Chapter detail page (CRITICAL - referenced everywhere)
8. **Step 17-20**: Email, validation, error handling, toasts

---

## Initial Admin User Setup

### Create First Admin User Script

```typescript
// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@spsv-dublin.ie'
  const password = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!'
  const name = process.env.ADMIN_NAME || 'Admin User'

  const hashedPassword = await bcrypt.hash(password, 12)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    }
  })

  console.log('Admin user created:', {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Run with:
```bash
npx tsx scripts/create-admin.ts
```

---

## Security Considerations

1. **Password Hashing**: Use bcrypt with salt rounds of 12
2. **JWT Tokens**: Secure token storage, proper expiration
3. **Rate Limiting**: Implement rate limiting on auth endpoints
4. **CSRF Protection**: NextAuth handles this automatically
5. **SQL Injection**: Prisma prevents SQL injection
6. **XSS Protection**: Sanitize user inputs
7. **Role-Based Access**: Enforce admin-only routes
8. **Invitation Expiry**: 7-day expiry on invitations
9. **Password Requirements**: Minimum 8 characters (enforce in frontend)

---

## Testing Checklist

- [ ] User can log in with correct credentials
- [ ] User cannot log in with incorrect credentials
- [ ] Admin can create invitations
- [ ] Invitation link works and expires correctly
- [ ] User can accept invitation and create account
- [ ] User can access dashboard after login
- [ ] User can view chapters
- [ ] User progress is tracked correctly
- [ ] Question answers are saved
- [ ] Admin can view all users
- [ ] Admin can view all invitations
- [ ] Non-admin users cannot access admin routes
- [ ] Logged-out users are redirected to login

---

## Deployment Notes

1. **Environment Variables**: Set all required env vars in production
2. **Database Migrations**: Run `npx prisma migrate deploy` in production
3. **Prisma Client**: Generate client with `npx prisma generate`
4. **Admin User**: Create initial admin user in production
5. **Email Service**: Configure email service for invitations (SendGrid, Resend, etc.)

---

## Next Steps After Implementation

1. Add email service for invitation emails
2. Add password reset functionality
3. Add user profile page
4. Add progress analytics/charts
5. Add export functionality for admin reports
6. Add notification system
7. Add chapter completion certificates

---

**Last Updated**: January 2024  
**Status**: Planning Phase  
**Priority**: High
