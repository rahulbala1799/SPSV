'use client'

import { StackProvider } from '@stackframe/stack'
import { stackServerApp } from './stack'

export function StackAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider
      app={stackServerApp}
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
