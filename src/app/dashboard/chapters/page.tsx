'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiBook, FiCheckCircle, FiLock, FiClock } from 'react-icons/fi'

interface Chapter {
  id: number | string
  title: string
  description: string
  duration: string
  completed: boolean
  locked: boolean
}

export default function ChaptersPage() {
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

  const industryChapters: Chapter[] = [
    {
      id: 'industry-part1',
      title: 'Industry Knowledge - Part 1',
      description: 'SPSV regulations, National Transport Authority, licensing basics and vehicle requirements',
      duration: '25 min',
      completed: false,
      locked: false
    },
    {
      id: 'industry-part2',
      title: 'Industry Knowledge - Part 2',
      description: 'Driver licence applications, vetting process, vehicle specifications and safety requirements',
      duration: '30 min',
      completed: false,
      locked: false
    },
    {
      id: 'industry-part3',
      title: 'Industry Knowledge - Part 3',
      description: 'SPSV licensing procedures, vehicle requirements and advertising regulations',
      duration: '25 min',
      completed: false,
      locked: false
    },
  ]

  const areaChapters: Chapter[] = [
    {
      id: 'southside-full',
      title: 'Southside Full',
      description: 'Test your knowledge of roads, landmarks, and locations in Dublin\'s Southside area',
      duration: '30 min',
      completed: false,
      locked: false
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
              <h1 className="text-xl font-bold text-gray-900">Course Chapters</h1>
              <p className="text-sm text-gray-600">{industryChapters.length + areaChapters.length} chapters available</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        {/* Industry Knowledge Section */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Industry Knowledge</h2>
            <p className="text-sm text-gray-600">SPSV regulations, licensing and vehicle requirements</p>
          </div>
          <div className="space-y-4">
            {industryChapters.map((chapter) => (
              <div
                key={chapter.id}
                className={`bg-white rounded-2xl shadow-lg p-6 transition-all ${
                  chapter.locked
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:shadow-xl cursor-pointer transform hover:-translate-y-1'
                }`}
                onClick={() => {
                  if (!chapter.locked) {
                    router.push(`/dashboard/chapters/${chapter.id}`)
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                      chapter.completed
                        ? 'bg-green-100'
                        : chapter.locked
                        ? 'bg-gray-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    {chapter.completed ? (
                      <FiCheckCircle className="w-6 h-6 text-green-600" />
                    ) : chapter.locked ? (
                      <FiLock className="w-6 h-6 text-gray-400" />
                    ) : (
                      <FiBook className="w-6 h-6 text-blue-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {chapter.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{chapter.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiClock className="w-4 h-4" />
                      <span>{chapter.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Area Knowledge Section */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Area Knowledge</h2>
            <p className="text-sm text-gray-600">Dublin routes, landmarks and navigation</p>
          </div>
          <div className="space-y-4">
            {areaChapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`bg-white rounded-2xl shadow-lg p-6 transition-all ${
                chapter.locked
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:shadow-xl cursor-pointer transform hover:-translate-y-1'
              }`}
              onClick={() => {
                if (!chapter.locked) {
                  // Navigate to chapter content
                  if (chapter.id === 'southside-full') {
                    router.push('/dashboard/chapters/southside-full')
                  } else {
                    router.push(`/dashboard/chapters/${chapter.id}`)
                  }
                }
              }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                    chapter.completed
                      ? 'bg-green-100'
                      : chapter.locked
                      ? 'bg-gray-100'
                      : 'bg-blue-100'
                  }`}
                >
                  {chapter.completed ? (
                    <FiCheckCircle className="w-6 h-6 text-green-600" />
                  ) : chapter.locked ? (
                    <FiLock className="w-6 h-6 text-gray-400" />
                  ) : (
                    <FiBook className="w-6 h-6 text-blue-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-500">
                          Chapter {chapter.id}
                        </span>
                        {chapter.completed && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            Completed
                          </span>
                        )}
                        {chapter.locked && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                            Locked
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{chapter.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiClock className="w-4 h-4" />
                    <span>{chapter.duration}</span>
                  </div>
                </div>
              </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
