import { getStackServerApp } from "./stack"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const user = await getStackServerApp().getUser()
  if (!user) return null
  
  // Get role from user metadata
  const role = (user.clientMetadata?.role || user.serverMetadata?.role || 'STUDENT') as 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT'
  
  return {
    id: user.id,
    email: user.primaryEmail,
    name: user.displayName,
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
