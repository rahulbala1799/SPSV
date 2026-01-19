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
