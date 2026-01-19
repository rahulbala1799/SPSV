import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "STUDENT",
      },
    },
  },
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL}` 
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  basePath: "/api/auth",
})

export type Session = typeof auth.$Infer.Session
