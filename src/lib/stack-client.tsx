'use client'

import { StackProvider, StackClientApp } from '@stackframe/stack'
import { useMemo } from 'react'

export function StackAuthProvider({ children }: { children: React.ReactNode }) {
  const stackClientApp = useMemo(() => {
    const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID
    const publishableClientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY

    // During build, if env vars aren't set, return null and let it fail gracefully
    // The app will work at runtime when env vars are properly set
    if (!projectId) {
      // Return null to prevent initialization during build
      // This will cause a runtime error if env vars aren't set, which is expected
      return null
    }

    return new StackClientApp({
      projectId,
      publishableClientKey: publishableClientKey || undefined,
      tokenStore: 'cookie',
    })
  }, [])

  // Only render provider if app is initialized
  if (!stackClientApp) {
    return <>{children}</>
  }

  return (
    <StackProvider app={stackClientApp}>
      {children}
    </StackProvider>
  )
}
