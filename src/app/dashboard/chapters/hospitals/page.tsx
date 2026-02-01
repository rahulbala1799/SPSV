'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiPlay, FiCheckCircle, FiClock, FiBook, FiBarChart2 } from 'react-icons/fi'
import { QuestionSelectionModal } from '@/components/chapters/QuestionSelectionModal'

import { ChapterModeButton } from '@/components/chapters/ChapterModeButton'
export default function SouthsideFullChapterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [chapter, setChapter] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [questionCount, setQuestionCount] = useState<number | 'all'>('all')
  const [showStrategyModal, setShowStrategyModal] = useState(false)
  const [unattemptedCount, setUnattemptedCount] = useState(0)

  const checkAccessAndLoad = async () => {
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

      // Load chapter data
      await loadChapter()
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const loadChapter = async () => {
    try {
      const response = await fetch('/api/chapters/chapter_hospitals')
      const data = await response.json()

      if (response.ok) {
        setChapter(data.chapter)
        setProgress(data.studentProgress)
        
        // Get unattempted question count
        const analyticsResponse = await fetch('/api/analytics/chapter/chapter_hospitals')
        const analyticsData = await analyticsResponse.json()
        if (analyticsResponse.ok) {
          setUnattemptedCount(analyticsData.overview.questionsNotAttempted)
        }
      }
    } catch (error) {
      console.error('Error loading chapter:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAccessAndLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleQuestionCountClick = (count: number | 'all') => {
    setQuestionCount(count)
    setShowStrategyModal(true)
  }

  const handleStrategyConfirm = (strategy: 'mix' | 'new_only' | 'prioritize_new') => {
    const count = questionCount === 'all' ? 'all' : questionCount
    router.push(`/dashboard/chapters/hospitals/quiz?count=${count}&strategy=${strategy}`)
  }

  const handleStartChapter = () => {
    // Use current question count with mix strategy (default)
    const count = questionCount === 'all' ? 'all' : questionCount
    router.push(`/dashboard/chapters/hospitals/quiz?count=${count}&strategy=mix`)
  }

  const totalQuestions = chapter?.totalQuestions || 56
  const questionCountOptions: Array<{ value: number | 'all'; label: string }> = [
    { value: 5, label: '5 Questions' },
    { value: 10, label: '10 Questions' },
    { value: 15, label: '15 Questions' },
    { value: 20, label: '20 Questions' },
    { value: 30, label: '30 Questions' },
    { value: 50, label: '50 Questions' },
    { value: 56, label: '56 Questions' },
    { value: 'all' as const, label: `All ${totalQuestions} Questions` }
  ].filter((opt): opt is { value: number | 'all'; label: string } => {
    if (typeof opt.value === 'number') {
      return opt.value <= totalQuestions
    }
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const isCompleted = progress?.isCompleted || false
  const hasStarted = progress !== null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/chapters"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Chapter Details</h1>
              <p className="text-sm text-gray-600">Hospitals</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        {chapter && (
          <>
            {/* Chapter Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiBook className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{chapter.title}</h2>
                  <p className="text-gray-600 mb-4">{chapter.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      <span>{chapter.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiBook className="w-4 h-4" />
                      <span>{chapter.totalQuestions} questions</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              {progress && progress.totalQuestions > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Your Overall Progress</span>
                    {isCompleted && (
                      <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                        <FiCheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${progress.score || 0}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>
                      {progress.correctAnswers} of {progress.totalQuestions} questions answered correctly
                    </span>
                    <span className="font-semibold text-gray-900">{progress.score || 0}%</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Based on your latest answers to each question
                  </p>
                </div>
              )}
            </div>

            {/* Chapter Mode Button */}


            <ChapterModeButton chapterSlug="hospitals" />



            {/* Question Count Selector - Always shown */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                How many questions would you like to answer?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {questionCountOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleQuestionCountClick(option.value as number | 'all')}
                      className={`
                      py-3 px-4 rounded-xl font-semibold transition-all
                      ${
                        questionCount === option.value
                          ? 'bg-green-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Questions will be shown in random order
              </p>
              {isCompleted && (
                <p className="text-sm text-green-600 mt-2 font-medium">
                  ✓ You can practice this chapter again anytime
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleStartChapter}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                {isCompleted ? (
                  <>
                    <FiPlay className="w-6 h-6" />
                    <span>Practice Again</span>
                  </>
                ) : hasStarted ? (
                  <>
                    <FiPlay className="w-6 h-6" />
                    <span>Continue Practice</span>
                  </>
                ) : (
                  <>
                    <FiPlay className="w-6 h-6" />
                    <span>Start Practice</span>
                  </>
                )}
              </button>
              
              {hasStarted && (
                <Link
                  href="/dashboard/chapters/hospitals/analytics"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  <FiBarChart2 className="w-6 h-6" />
                  <span>View Analytics</span>
                </Link>
              )}
            </div>
          </>
        )}
      </main>

      {/* Question Selection Strategy Modal */}
      <QuestionSelectionModal
        isOpen={showStrategyModal}
        onClose={() => setShowStrategyModal(false)}
        selectedCount={questionCount}
        totalQuestions={chapter?.totalQuestions || 20}
        unattemptedCount={unattemptedCount}
        onConfirm={handleStrategyConfirm}
      />
    </div>
  )
}
