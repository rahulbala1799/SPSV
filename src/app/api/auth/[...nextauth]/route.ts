import { handlers } from "@/lib/auth"

// Ensure this runs in Node.js runtime (not Edge)
export const runtime = 'nodejs'

export const { GET, POST } = handlers
