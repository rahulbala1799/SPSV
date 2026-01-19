import { auth } from "./auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function getCurrentUser() {
  const headersList = await headers()
  const session = await auth.api.getSession({ 
    headers: headersList as any 
  })
  
  if (!session?.user) return null
  
  // Get role from our users table (Better Auth doesn't store custom fields in session)
  const prisma = (await import("./prisma")).prisma
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  })
  
  const role = (dbUser?.role as any) || 'STUDENT'
  
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name || '',
    role,
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }
  return user
}

export async function requireSuperAdmin() {
  const user = await requireAuth()
  if (user.role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }
  return user
}

export function canCreateAdmin(userRole: string): boolean {
  return userRole === "SUPER_ADMIN" || userRole === "ADMIN"
}
