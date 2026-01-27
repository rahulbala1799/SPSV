'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

export default function TestsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const checkAccess = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()

      if (!response.ok || !data.user) {
        router.push('/login')
        return
      }

      if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
        router.push('/admin')
        return
      }

      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  useEffect(() => {
    checkAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Practice Tests</h1>
              <p className="text-sm text-gray-600">Tests and assessments</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Blank Canvas */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        {/* Empty state - ready for test implementation */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-500">Tests area - ready for implementation</p>
        </div>
      </main>
    </div>
  )
}
