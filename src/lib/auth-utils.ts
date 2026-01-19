import { auth } from "./auth"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
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
