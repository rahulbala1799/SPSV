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

interface ChapterFromAPI {
  chapterId: string
  chapterTitle: string
  chapterNumber: number
  description: string
  totalQuestionsInChapter: number
  isCompleted: boolean
  score: number | null
  correctAnswers: number
  totalQuestions: number
  hasStarted: boolean
}

export default function ChaptersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [industryChapters, setIndustryChapters] = useState<Chapter[]>([])
  const [areaChapters, setAreaChapters] = useState<Chapter[]>([])

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

      // Load chapters from API
      await loadChapters()

      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const loadChapters = async () => {
    try {
      const response = await fetch('/api/student/progress')
      const data = await response.json()

      if (response.ok && data.chapterProgress) {
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
          'chapter_tourist_attractions': 'tourist-attractions',
          'chapter_hospitals': 'hospitals',
          'chapter_schools_libraries_universities': 'schools-libraries-universities',
          'chapter_dublin_roads_navigation': 'dublin-roads-navigation'
        }

        // Convert API chapters to display format and separate by category
        const industry: Chapter[] = []
        const area: Chapter[] = []

        // Industry Knowledge chapter IDs
        const industryIds = [
          'chapter_industry_part1',
          'chapter_industry_part2',
          'chapter_industry_part3',
          'chapter_industry_5',
          'chapter_industry_7',
          'chapter_industry_8'
        ]

        data.chapterProgress.forEach((cp: ChapterFromAPI) => {
          const routeId = chapterIdMap[cp.chapterId] || cp.chapterId.replace('chapter_', '').replace(/_/g, '-')
          const chapter: Chapter = {
            id: routeId,
            title: cp.chapterTitle,
            description: cp.description,
            duration: `${cp.totalQuestionsInChapter} questions`,
            completed: cp.isCompleted,
            locked: false,
            score: cp.score,
            questionsAnswered: cp.totalQuestions,
            totalQuestions: cp.totalQuestionsInChapter,
            hasStarted: cp.hasStarted
          }

          // Separate by category based on chapter ID
          if (industryIds.includes(cp.chapterId)) {
            industry.push(chapter)
          } else {
            area.push(chapter)
          }
        })

        // Sort by chapter number
        industry.sort((a, b) => {
          const aNum = data.chapterProgress.find((cp: ChapterFromAPI) => 
            chapterIdMap[cp.chapterId] === a.id
          )?.chapterNumber || 0
          const bNum = data.chapterProgress.find((cp: ChapterFromAPI) => 
            chapterIdMap[cp.chapterId] === b.id
          )?.chapterNumber || 0
          return aNum - bNum
        })

        area.sort((a, b) => {
          const aNum = data.chapterProgress.find((cp: ChapterFromAPI) => 
            chapterIdMap[cp.chapterId] === a.id
          )?.chapterNumber || 0
          const bNum = data.chapterProgress.find((cp: ChapterFromAPI) => 
            chapterIdMap[cp.chapterId] === b.id
          )?.chapterNumber || 0
          return aNum - bNum
        })

        setIndustryChapters(industry)
        setAreaChapters(area)
      }
    } catch (error) {
      console.error('Error loading chapters:', error)
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
