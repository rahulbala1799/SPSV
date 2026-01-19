// NextAuth type extensions
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT'
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    role: 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT'
  }
}

// NextAuth v5 doesn't use separate JWT module
// JWT types are handled internally

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
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT'
  createdAt: Date
  emailVerified?: Date | null
}

// Invitation types
export interface Invitation {
  id: string
  email: string
  token: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT'
  expiresAt: Date
  acceptedAt?: Date | null
  createdAt: Date
  inviter: {
    name?: string | null
    email: string
  }
}
