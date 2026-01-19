import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('[Auth] Missing credentials')
            return null
          }

          console.log(`[Auth] Attempting login for: ${credentials.email}`)

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })

          if (!user) {
            console.log(`[Auth] User not found: ${credentials.email}`)
            return null
          }

          console.log(`[Auth] User found: ${user.email}, verifying password...`)

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            console.log(`[Auth] Invalid password for: ${credentials.email}`)
            return null
          }

          console.log(`[Auth] ✅ Successful login: ${user.email} (${user.role})`)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('[Auth] ❌ Error during authorization:', error)
          if (error instanceof Error) {
            console.error('[Auth] Error message:', error.message)
            console.error('[Auth] Error stack:', error.stack)
          }
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role as 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT'
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
  trustHost: true, // Required for Vercel and custom domains
})
