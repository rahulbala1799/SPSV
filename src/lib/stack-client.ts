'use client'

import { StackProvider } from '@stackframe/stack'

const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID
const publishableClientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY

if (!projectId) {
  throw new Error('NEXT_PUBLIC_STACK_PROJECT_ID is not set')
}

export function StackAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider
      projectId={projectId}
      publishableClientKey={publishableClientKey}
      urls={{
        signIn: '/login',
        signUp: '/signup',
        afterSignIn: '/dashboard',
        afterSignUp: '/dashboard',
      }}
    >
      {children}
    </StackProvider>
  )
}
