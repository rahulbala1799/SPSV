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
  score?: number | null
  questionsAnswered?: number
  totalQuestions?: number
  hasStarted?: boolean
}

interface ChapterProgress {
  chapterId: string
  isCompleted: boolean
  score: number | null
  totalQuestions: number
  correctAnswers: number
  hasStarted: boolean
}

export default function ChaptersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [progressData, setProgressData] = useState<Map<string, ChapterProgress>>(new Map())

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

      // Load progress data
      await loadProgressData()

      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const loadProgressData = async () => {
    try {
      const response = await fetch('/api/student/progress')
      const data = await response.json()

      if (response.ok && data.chapterProgress) {
        const progressMap = new Map<string, ChapterProgress>()
        
        // Map chapter IDs to route IDs
        const chapterIdMap: Record<string, string> = {
          'chapter_industry_part1': 'industry-part1',
          'chapter_industry_part2': 'industry-part2',
          'chapter_industry_part3': 'industry-part3',
          'chapter_industry_5': 'industry-5',
          'chapter_industry_7': 'industry-7',
          'chapter_industry_8': 'industry-8',
          'chapter_southside_full': 'southside-full',
          'chapter_dublin_one_way_streets': 'dublin-one-way-streets',
          'chapter_southside_streets_2': 'southside-streets-2',
          'chapter_northside_routes': 'northside-routes',
          'chapter_churches_cemeteries': 'churches-cemeteries',
          'chapter_embassies': 'embassies',
          'chapter_tourist_attractions': 'tourist-attractions'
        }

        data.chapterProgress.forEach((cp: any) => {
          const routeId = chapterIdMap[cp.chapterId] || cp.chapterId
          progressMap.set(routeId, {
            chapterId: cp.chapterId,
            isCompleted: cp.isCompleted,
            score: cp.score,
            totalQuestions: cp.totalQuestions,
            correctAnswers: cp.correctAnswers,
            hasStarted: cp.hasStarted
          })
        })

        setProgressData(progressMap)
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  useEffect(() => {
    checkAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Helper function to enrich chapters with progress data
  const enrichWithProgress = (chapters: Chapter[]): Chapter[] => {
    return chapters.map(chapter => {
      const progress = progressData.get(chapter.id as string)
      return {
        ...chapter,
        completed: progress?.isCompleted || false,
        score: progress?.score,
        questionsAnswered: progress?.totalQuestions,
        totalQuestions: progress?.totalQuestions,
        hasStarted: progress?.hasStarted || false
      }
    })
  }

  const industryChaptersBase: Chapter[] = [
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
    {
      id: 'industry-5',
      title: 'Working as an SPSV Operator',
      description: 'SPSV vehicle licensing, equipment requirements, passenger regulations, and compliance',
      duration: '40 min',
      completed: false,
      locked: false
    },
    {
      id: 'industry-7',
      title: 'Taximeter Fares',
      description: 'National Maximum Taxi Fare, tariff rates, booking fees, and fare regulations',
      duration: '30 min',
      completed: false,
      locked: false
    },
    {
      id: 'industry-8',
      title: 'Delivering Customer Satisfaction',
      description: 'Customer service standards, fare regulations, complaint procedures, and passenger rights',
      duration: '45 min',
      completed: false,
      locked: false
    },
  ]

  const areaChaptersBase: Chapter[] = [
    {
      id: 'southside-full',
      title: 'Southside Full',
      description: 'Test your knowledge of roads, landmarks, and locations in Dublin\'s Southside area',
      duration: '30 min',
      completed: false,
      locked: false
    },
    {
      id: 'dublin-one-way-streets',
      title: 'Dublin One Way Streets',
      description: 'Test your knowledge of one-way street directions in Dublin city center',
      duration: '30 min',
      completed: false,
      locked: false
    },
    {
      id: 'southside-streets-2',
      title: 'Southside Streets 2',
      description: 'Test your knowledge of landmarks, locations, and one-way streets in Dublin\'s Southside area',
      duration: '45 min',
      completed: false,
      locked: false
    },
    {
      id: 'northside-routes',
      title: 'Northside Routes',
      description: 'Test your knowledge of routes, areas, landmarks, and locations in Dublin\'s Northside area',
      duration: '50 min',
      completed: false,
      locked: false
    },
    {
      id: 'churches-cemeteries',
      title: 'Churches and Cemeteries',
      description: 'Test your knowledge of churches, cemeteries, and religious sites in Dublin',
      duration: '30 min',
      completed: false,
      locked: false
    },
    {
      id: 'embassies',
      title: 'Embassies',
      description: 'Test your knowledge of embassy locations in Dublin',
      duration: '35 min',
      completed: false,
      locked: false
    },
    {
      id: 'tourist-attractions',
      title: 'Tourist Attractions & Landmarks',
      description: 'Test your knowledge of tourist attractions, landmarks, museums, and cultural sites in Dublin',
      duration: '40 min',
      completed: false,
      locked: false
    },
  ]

  const industryChapters = enrichWithProgress(industryChaptersBase)
  const areaChapters = enrichWithProgress(areaChaptersBase)

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
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {chapter.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{chapter.description}</p>
                      </div>
                      {chapter.completed && chapter.score !== null && (
                        <div className="ml-4">
                          <span className="text-2xl font-bold text-green-600">{chapter.score}%</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <FiClock className="w-4 h-4" />
                        <span>{chapter.duration}</span>
                      </div>
                      {chapter.hasStarted && chapter.questionsAnswered !== undefined && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <FiBook className="w-4 h-4" />
                          <span>{chapter.questionsAnswered} questions answered</span>
                        </div>
                      )}
                      {chapter.completed && (
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                          <FiCheckCircle className="w-4 h-4" />
                          <span>Completed</span>
                        </div>
                      )}
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
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
