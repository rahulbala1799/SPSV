'use client'

import { StackProvider } from '@stackframe/stack'

if (!process.env.NEXT_PUBLIC_STACK_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_STACK_PROJECT_ID is not set')
}

export function StackAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider
      projectId={process.env.NEXT_PUBLIC_STACK_PROJECT_ID}
      publishableClientKey={process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY}
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
