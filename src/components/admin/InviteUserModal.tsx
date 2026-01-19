'use client'

import { useState } from 'react'
import { useSession } from 'better-auth/react'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'

export function InviteUserModal() {
  const { data: session } = useSession()
  const user = session?.user
  const userRole = (user?.role as any) || 'STUDENT'
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'STUDENT'>('STUDENT')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const canCreateAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN'
  const canCreateSuperAdmin = userRole === 'SUPER_ADMIN'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create invitation')
        return
      }

      setSuccess(true)
      setEmail('')
      setRole('STUDENT')
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
        window.location.reload() // Refresh to show new invitation
      }, 2000)
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="primary"
        size="medium"
        className="flex items-center gap-2"
      >
        <FaPlus />
        Invite User
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Invite User</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  Invitation sent successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                  disabled={loading}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={loading}
                  >
                    <option value="STUDENT">Student</option>
                    {canCreateAdmin && <option value="ADMIN">Admin</option>}
                    {canCreateSuperAdmin && <option value="SUPER_ADMIN">Super Admin</option>}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {canCreateSuperAdmin 
                      ? 'You can create Super Admin, Admin, and Student users'
                      : canCreateAdmin
                      ? 'You can create Admin and Student users'
                      : 'You can only create Student users'}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
