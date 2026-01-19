import { requireAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { UserTable } from '@/components/admin/UserTable'
import { InvitationTable } from '@/components/admin/InvitationTable'
import { InviteUserModal } from '@/components/admin/InviteUserModal'

export default async function AdminDashboardPage() {
  await requireAdmin()

  const [users, invitations] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            progress: true,
            questionAnswers: true,
          }
        }
      }
    }),
    prisma.invitation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        inviter: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })
  ])

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.emailVerified).length,
    pendingInvitations: invitations.filter(i => !i.acceptedAt).length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and invitations</p>
        </div>
        <InviteUserModal />
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Invitations</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingInvitations}</p>
        </div>
      </div>

      {/* Tables */}
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Users</h2>
          <UserTable users={users} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Invitations</h2>
          <InvitationTable invitations={invitations} />
        </div>
      </div>
    </div>
  )
}
