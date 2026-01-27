'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page immediately
    router.replace('/login')
  }, [router])

  // Show a brief message while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Registration Not Available</h1>
          <p className="text-gray-600 mb-6">
            Public registration is disabled. Student accounts are created by administrators only.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            If you already have an account, you will be redirected to the sign in page.
          </p>
          <Link 
            href="/login" 
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
