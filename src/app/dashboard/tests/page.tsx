'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiClipboard, FiCheckCircle, FiClock, FiAward } from 'react-icons/fi'

interface Test {
  id: number
  title: string
  description: string
  questions: number
  duration: string
  passingScore: number
  completed: boolean
  score?: number
}

export default function TestsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAccess()
  }, [])

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

  const tests: Test[] = [
    {
      id: 1,
      title: 'Road Safety Test',
      description: 'Test your knowledge of road safety and traffic laws',
      questions: 20,
      duration: '20 min',
      passingScore: 80,
      completed: false
    },
    {
      id: 2,
      title: 'Area Knowledge Test',
      description: 'Dublin area navigation and landmarks',
      questions: 25,
      duration: '25 min',
      passingScore: 85,
      completed: false
    },
    {
      id: 3,
      title: 'Customer Service Test',
      description: 'Professional conduct and passenger interaction',
      questions: 15,
      duration: '15 min',
      passingScore: 80,
      completed: false
    },
    {
      id: 4,
      title: 'Legal Requirements Test',
      description: 'Understanding licensing and legal obligations',
      questions: 18,
      duration: '18 min',
      passingScore: 85,
      completed: false
    },
    {
      id: 5,
      title: 'Final Assessment',
      description: 'Comprehensive test covering all topics',
      questions: 50,
      duration: '60 min',
      passingScore: 85,
      completed: false
    },
  ]

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
              <p className="text-sm text-gray-600">{tests.length} tests available</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Complete all chapter materials before attempting tests. You need {tests[0].passingScore}% to pass each test.
          </p>
        </div>

        <div className="space-y-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/dashboard/tests/${test.id}`)}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                    test.completed ? 'bg-green-100' : 'bg-blue-100'
                  }`}
                >
                  {test.completed ? (
                    <FiCheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <FiClipboard className="w-6 h-6 text-blue-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-500">Test {test.id}</span>
                        {test.completed && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            Passed
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{test.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                      
                      {/* Test Info */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiClipboard className="w-4 h-4" />
                          <span>{test.questions} questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          <span>{test.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiAward className="w-4 h-4" />
                          <span>{test.passingScore}% to pass</span>
                        </div>
                      </div>

                      {test.completed && test.score && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Your score:</span>
                            <span className="text-lg font-bold text-green-600">{test.score}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
