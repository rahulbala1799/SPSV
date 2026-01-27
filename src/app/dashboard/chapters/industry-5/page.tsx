'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiPlay, FiCheckCircle, FiClock, FiBook, FiBarChart2 } from 'react-icons/fi'
import { QuestionSelectionModal } from '@/components/chapters/QuestionSelectionModal'

const CHAPTER_ID = 'chapter_industry_5'
const CHAPTER_PATH = 'industry-5'

export default function IndustryChapter5Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [chapter, setChapter] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [totalQuestions, setTotalQuestions] = useState(42)
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

      await loadChapter()
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const loadChapter = async () => {
    try {
      const response = await fetch(`/api/chapters/${CHAPTER_ID}`)
      const data = await response.json()

      if (response.ok) {
        setChapter(data.chapter)
        setTotalQuestions(data.totalQuestions)
        setProgress(data.studentProgress)
        
        const analyticsResponse = await fetch(`/api/analytics/chapter/${CHAPTER_ID}`)
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
    router.push(`/dashboard/chapters/${CHAPTER_PATH}/quiz?count=${count}&strategy=${strategy}`)
  }

  const handleStartChapter = () => {
    const count = questionCount === 'all' ? 'all' : questionCount
    router.push(`/dashboard/chapters/${CHAPTER_PATH}/quiz?count=${count}&strategy=mix`)
  }

  const questionCountOptions: Array<{ value: number | 'all'; label: string }> = [
    { value: 5, label: '5 Questions' },
    { value: 10, label: '10 Questions' },
    { value: 15, label: '15 Questions' },
    { value: 20, label: '20 Questions' },
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

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="text-center py-12">
          <p className="text-gray-600">Chapter not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 pt-6 pb-20">
        <Link
          href="/dashboard/chapters"
          className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Chapters</span>
        </Link>
        <h1 className="text-3xl font-bold mb-2">{chapter.title}</h1>
        <p className="text-white/90">{chapter.description}</p>
      </div>

      {/* Content Card */}
      <div className="px-4 -mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <FiBook className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
              <p className="text-sm text-gray-600">Questions</p>
            </div>
            <div className="text-center">
              <FiClock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-gray-900">{chapter.duration || 25}</p>
              <p className="text-sm text-gray-600">Minutes</p>
            </div>
            <div className="text-center">
              <FiCheckCircle className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
              <p className="text-2xl font-bold text-gray-900">{progress?.score || 0}%</p>
              <p className="text-sm text-gray-600">Score</p>
            </div>
          </div>

          {/* Question Count Selector - Always Visible */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Number of Questions</h3>
            <div className="grid grid-cols-2 gap-2">
              {questionCountOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setQuestionCount(option.value)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    questionCount === option.value
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          {!progress || progress.correctAnswers === 0 ? (
            <button
              onClick={() => handleQuestionCountClick(questionCount)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <FiPlay className="w-5 h-5" />
              Start Practice
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => handleQuestionCountClick(questionCount)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <FiPlay className="w-5 h-5" />
                Start New Practice
              </button>
              <button
                onClick={() => router.push(`/dashboard/chapters/${CHAPTER_PATH}/analytics`)}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <FiBarChart2 className="w-5 h-5" />
                View Analytics
              </button>
            </div>
          )}

          {/* Progress Info */}
          {progress && progress.correctAnswers > 0 && (
            <div className="mt-6 p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Progress:</span> {progress.correctAnswers} out of {totalQuestions} questions attempted correctly
              </p>
              {unattemptedCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {unattemptedCount} questions not yet attempted
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Question Selection Strategy Modal */}
      {showStrategyModal && (
        <QuestionSelectionModal
          isOpen={showStrategyModal}
          onClose={() => setShowStrategyModal(false)}
          onConfirm={handleStrategyConfirm}
          totalQuestions={totalQuestions}
          unattemptedCount={unattemptedCount}
          selectedCount={questionCount === 'all' ? totalQuestions : questionCount}
        />
      )}
    </div>
  )
}
