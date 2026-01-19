'use client'

import { useState } from 'react'
import { useStackApp } from '@stackframe/stack'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  const stackApp = useStackApp()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      await stackApp.signInWithCredential({
        email,
        password,
      })
      
      // Successful login - redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error?.message || 'Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your course</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <LoginForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}
