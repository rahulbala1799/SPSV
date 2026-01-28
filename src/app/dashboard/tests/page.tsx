'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiClock, FiPlay, FiClipboard } from 'react-icons/fi'

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
              <p className="text-sm text-gray-600">Choose your test type</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Assigned Tests Section */}
          <Link
            href="/dashboard/tests/assigned"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 group border-2 border-green-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                <FiClipboard className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Assigned Tests</h2>
              <p className="text-sm text-gray-600 mb-4">
                Tests assigned by your instructor
              </p>
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <span>View Tests</span>
                <FiPlay className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Timed Tests Section */}
          <Link
            href="/dashboard/tests/timed"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
                <FiClock className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Timed Tests</h2>
              <p className="text-sm text-gray-600 mb-4">
                Practice tests with time limits to simulate real exam conditions
              </p>
              <div className="flex items-center gap-2 text-orange-600 font-semibold">
                <span>View Tests</span>
                <FiPlay className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Untimed Tests Section */}
          <Link
            href="/dashboard/tests/untimed"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <FiPlay className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Untimed Tests</h2>
              <p className="text-sm text-gray-600 mb-4">
                Take your time to practice and learn at your own pace
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <span>View Tests</span>
                <FiPlay className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
