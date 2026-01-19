'use client'

import { StackProvider, StackClientApp } from '@stackframe/stack'

const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID
const publishableClientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY

if (!projectId) {
  throw new Error('NEXT_PUBLIC_STACK_PROJECT_ID is not set')
}

const stackClientApp = new StackClientApp({
  projectId,
  publishableClientKey: publishableClientKey || undefined,
})

export function StackAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider app={stackClientApp}>
      {children}
    </StackProvider>
  )
}
