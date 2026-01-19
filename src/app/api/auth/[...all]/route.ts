import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const dynamic = 'force-dynamic'

const handlers = toNextJsHandler(auth)

export async function GET(request: Request) {
  try {
    return await handlers.GET(request)
  } catch (error: any) {
    console.error('[Better Auth] GET error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function POST(request: Request) {
  try {
    return await handlers.POST(request)
  } catch (error: any) {
    console.error('[Better Auth] POST error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
