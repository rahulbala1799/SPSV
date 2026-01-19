'use client'

import { StackProvider, StackClientApp } from '@stackframe/stack'
import { useMemo } from 'react'

export function StackAuthProvider({ children }: { children: React.ReactNode }) {
  const stackClientApp = useMemo(() => {
    const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID
    const publishableClientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY

    // Use placeholder during build if env vars aren't set
    // This will fail at runtime if env vars are still missing, which is expected
    if (!projectId) {
      // Return a minimal app instance that won't work but won't crash the build
      return new StackClientApp({
        projectId: 'placeholder',
        publishableClientKey: publishableClientKey || undefined,
        tokenStore: 'cookie',
      } as any)
    }

    return new StackClientApp({
      projectId,
      publishableClientKey: publishableClientKey || undefined,
      tokenStore: 'cookie',
    })
  }, [])

  return (
    <StackProvider app={stackClientApp}>
      {children}
    </StackProvider>
  )
}
