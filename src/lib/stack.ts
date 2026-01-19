import { StackServerApp } from '@stackframe/stack'

if (!process.env.STACK_SECRET_SERVER_KEY) {
  throw new Error('STACK_SECRET_SERVER_KEY is not set')
}

if (!process.env.NEXT_PUBLIC_STACK_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_STACK_PROJECT_ID is not set')
}

export const stackServerApp = new StackServerApp({
  tokenStore: 'nextjs-cookie',
  urls: {
    signIn: '/login',
    signUp: '/signup',
    afterSignIn: '/dashboard',
    afterSignUp: '/dashboard',
  },
})
