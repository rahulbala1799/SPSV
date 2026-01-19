'use client'

import { StackProvider, StackClientApp } from '@stackframe/stack'

const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID
const publishableClientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY

// Don't throw during build - will fail at runtime if not set
// This allows the build to succeed even if env vars aren't set yet

const stackClientApp = new StackClientApp({
  projectId,
  publishableClientKey: publishableClientKey || undefined,
  tokenStore: 'cookie',
})

export function StackAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider app={stackClientApp}>
      {children}
    </StackProvider>
  )
}
