'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AcceptInviteForm } from '@/components/auth/AcceptInviteForm'

export default function AcceptInvitePage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invitation, setInvitation] = useState<{ email: string; role: string } | null>(null)

  useEffect(() => {
    async function validateInvitation() {
      try {
        const response = await fetch(`/api/invitations/${params.token}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Invalid invitation')
          return
        }

        setInvitation(data)
      } catch (error) {
        setError('Failed to validate invitation')
      } finally {
        setLoading(false)
      }
    }

    validateInvitation()
  }, [params.token])

  const handleSubmit = async (name: string, password: string) => {
    try {
      const response = await fetch(`/api/invitations/${params.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to accept invitation')
        return
      }

      // Redirect to login
      router.push('/login?message=Account created successfully. Please sign in.')
    } catch (error) {
      setError('An error occurred. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating invitation...</p>
        </div>
      </div>
    )
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-red-600 text-5xl mb-4">✕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
          <p className="text-gray-600 mb-6">{error || 'This invitation link is invalid or has expired.'}</p>
          <a href="/login" className="text-green-600 hover:underline">Go to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accept Invitation</h1>
          <p className="text-gray-600">Create your account to get started</p>
          <p className="text-sm text-gray-500 mt-2">Email: {invitation.email}</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <AcceptInviteForm onSubmit={handleSubmit} email={invitation.email} />
      </div>
    </div>
  )
}
