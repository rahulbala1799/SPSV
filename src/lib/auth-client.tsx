"use client"

import { createAuthClient } from "better-auth/react"
import { ReactNode } from "react"

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
      : "http://localhost:3000",
  basePath: "/api/auth",
})

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
