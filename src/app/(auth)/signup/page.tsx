'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      // Check if user exists in our users table first
      const checkResponse = await fetch('/api/users/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      })

      if (checkResponse.ok) {
        const checkData = await checkResponse.json()
        if (checkData.exists) {
          setError('User with this email already exists. Please sign in instead.')
          setLoading(false)
          return
        }
      }

      const result = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      })
      
      if (result.error) {
        // Check if error is about existing user
        if (result.error.message?.toLowerCase().includes('already exists') || 
            result.error.message?.toLowerCase().includes('user already exists')) {
          // User exists in Better Auth but maybe not in our users table
          // Try to sync and then redirect to login
          try {
            await fetch('/api/auth/sync-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: formData.email }),
            })
          } catch (syncError) {
            console.error('Sync error:', syncError)
          }
          setError('User with this email already exists. Please sign in instead.')
        } else {
          setError(result.error.message || 'Failed to create account')
        }
        setLoading(false)
        return
      }
      
      // Sync user to our users table after successful signup
      try {
        const syncResponse = await fetch('/api/auth/sync-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        })
        if (!syncResponse.ok) {
          console.error('Sync failed but signup succeeded')
        }
      } catch (syncError) {
        console.error('Sync error (non-fatal):', syncError)
        // Don't fail signup if sync fails - user can still log in
      }
      
      // Successful signup - redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      console.error('Signup error:', error)
      setError(error?.message || 'Failed to create account')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Sign up to access your course</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your full name"
            required
            disabled={loading}
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your.email@example.com"
            required
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Create a password (min. 8 characters)"
            required
            disabled={loading}
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Confirm your password"
            required
            disabled={loading}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-green-600 hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
