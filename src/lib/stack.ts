import { StackServerApp } from '@stackframe/stack'

let stackServerAppInstance: StackServerApp | null = null

export function getStackServerApp(): StackServerApp {
  if (!stackServerAppInstance) {
    // Don't throw during build - StackServerApp will handle missing env vars
    // The error will occur at runtime when actually used, which is expected
    stackServerAppInstance = new StackServerApp({
      tokenStore: 'nextjs-cookie',
      urls: {
        signIn: '/login',
        signUp: '/signup',
        afterSignIn: '/dashboard',
        afterSignUp: '/dashboard',
      },
    })
  }
  return stackServerAppInstance
}

// Export as function to prevent build-time initialization
export const stackServerApp = getStackServerApp
