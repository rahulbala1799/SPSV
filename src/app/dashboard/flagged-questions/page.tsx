'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { FaFlag } from 'react-icons/fa'

interface FlaggedQuestion {
  id: string
  questionId?: string
  questionBankId?: string
  flaggedFrom: string
  flaggedAt: string
  isActive: boolean
  question?: {
    id: string
    questionText: string
    chapterId: string
    chapter: {
      id: string
      title: string
    }
  }
  questionBank?: {
    id: string
    questionText: string
    category: string
  }
}

export default function FlaggedQuestionsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [flaggedQuestions, setFlaggedQuestions] = useState<FlaggedQuestion[]>([])
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    checkAccessAndLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

      await loadFlaggedQuestions()
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const loadFlaggedQuestions = async () => {
    try {
      const response = await fetch('/api/student/flagged-questions')
      const data = await response.json()

      if (response.ok) {
        setFlaggedQuestions(data.flaggedQuestions)
      } else {
        console.error('Failed to load flagged questions')
      }
    } catch (error) {
      console.error('Error loading flagged questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnflag = async (questionId: string, flagId: string) => {
    try {
      const response = await fetch('/api/questions/unflag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId })
      })

      if (response.ok) {
        // Remove from local state
        setFlaggedQuestions(prev => prev.filter(q => q.id !== flagId))
      } else {
        alert('Failed to unflag question')
      }
    } catch (error) {
      console.error('Error unflagging question:', error)
      alert('Failed to unflag question')
    }
  }

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'CHAPTER':
        return 'Chapter'
      case 'TIMED_TEST':
        return 'Timed Test'
      case 'UNTIMED_TEST':
        return 'Untimed Test'
      case 'ASSIGNED_TEST':
        return 'Assigned Test'
      default:
        return source
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'CHAPTER':
        return 'bg-blue-100 text-blue-800'
      case 'TIMED_TEST':
        return 'bg-green-100 text-green-800'
      case 'UNTIMED_TEST':
        return 'bg-purple-100 text-purple-800'
      case 'ASSIGNED_TEST':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredQuestions = filter === 'all'
    ? flaggedQuestions
    : flaggedQuestions.filter(q => q.flaggedFrom === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flagged questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4 max-w-7xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Flagged Questions</h1>
          <p className="text-gray-600 mt-1">Review questions you&apos;ve flagged for later study</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-7xl mx-auto">
        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({flaggedQuestions.length})
            </button>
            <button
              onClick={() => setFilter('CHAPTER')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'CHAPTER'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Chapters ({flaggedQuestions.filter(q => q.flaggedFrom === 'CHAPTER').length})
            </button>
            <button
              onClick={() => setFilter('TIMED_TEST')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'TIMED_TEST'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Timed Tests ({flaggedQuestions.filter(q => q.flaggedFrom === 'TIMED_TEST').length})
            </button>
            <button
              onClick={() => setFilter('UNTIMED_TEST')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'UNTIMED_TEST'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Untimed Tests ({flaggedQuestions.filter(q => q.flaggedFrom === 'UNTIMED_TEST').length})
            </button>
            <button
              onClick={() => setFilter('ASSIGNED_TEST')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'ASSIGNED_TEST'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Assigned Tests ({flaggedQuestions.filter(q => q.flaggedFrom === 'ASSIGNED_TEST').length})
            </button>
          </div>
        </div>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFlag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Flagged Questions</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? "You haven&apos;t flagged any questions yet."
                : `You haven&apos;t flagged any questions from ${getSourceLabel(filter).toLowerCase()}.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((flagged) => {
              const isChapterQuestion = !!flagged.question
              const questionText = isChapterQuestion
                ? flagged.question!.questionText
                : flagged.questionBank!.questionText

              return (
                <div
                  key={flagged.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${getSourceColor(flagged.flaggedFrom)}`}>
                          {getSourceLabel(flagged.flaggedFrom)}
                        </span>
                        {isChapterQuestion && flagged.question!.chapter && (
                          <span className="text-xs text-gray-600">
                            Chapter: {flagged.question!.chapter.title}
                          </span>
                        )}
                        {!isChapterQuestion && flagged.questionBank && (
                          <span className="text-xs text-gray-600">
                            {flagged.questionBank.category === 'INDUSTRY' ? 'Industry Knowledge' : 'Area Knowledge'}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900 leading-relaxed">{questionText}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Flagged {new Date(flagged.flaggedAt).toLocaleDateString()} at{' '}
                        {new Date(flagged.flaggedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {isChapterQuestion && flagged.question && (
                        <>
                          <Link
                            href={`/dashboard/chapters/${flagged.question.chapter.id.replace('chapter_', '')}`}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors text-center"
                          >
                            Go to Chapter
                          </Link>
                          <button
                            onClick={() => handleUnflag(flagged.question!.id, flagged.id)}
                            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors"
                          >
                            Unflag
                          </button>
                        </>
                      )}
                      {!isChapterQuestion && (
                        <div className="text-xs text-gray-500 text-center">
                          From Timed Test
                          <br />
                          (Can&apos;t unflag)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
