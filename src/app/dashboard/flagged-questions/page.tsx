'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiFlag, FiCheckCircle, FiBookOpen, FiX } from 'react-icons/fi'

interface FlaggedQuestion {
  id: string
  questionId: string | null
  questionBankId: string | null
  flaggedFrom: 'CHAPTER' | 'TIMED_TEST' | 'UNTIMED_TEST' | 'ASSIGNED_TEST'
  flaggedAt: string
  question?: {
    id: string
    questionText: string
    questionNumber: number
    options: any
    correctAnswer: string
    explanation?: string
    chapterId: string
    category: string
    chapter: {
      id: string
      title: string
    }
  }
  questionBank?: {
    id: string
    questionText: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
    correctAnswer: string
    explanation?: string
    category: 'INDUSTRY' | 'AREA_KNOWLEDGE'
  }
}

interface GroupedQuestions {
  [chapterTitle: string]: {
    chapterId?: string
    questions: FlaggedQuestion[]
  }
}

export default function FlaggedQuestionsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<FlaggedQuestion[]>([])
  const [groupedQuestions, setGroupedQuestions] = useState<GroupedQuestions>({})
  const [unflagging, setUnflagging] = useState<string | null>(null)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  useEffect(() => {
    checkAccessAndLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function checkAccessAndLoad() {
    try {
      // Check auth
      const authResponse = await fetch('/api/auth/me')
      const authData = await authResponse.json()

      if (!authResponse.ok || !authData.user || authData.user.role !== 'STUDENT') {
        router.push('/login')
        return
      }

      // Load flagged questions
      await loadFlaggedQuestions()
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  async function loadFlaggedQuestions() {
    try {
      const response = await fetch('/api/student/flagged-questions')
      const data = await response.json()

      if (response.ok) {
        setQuestions(data.flaggedQuestions || [])
        groupQuestionsByChapter(data.flaggedQuestions || [])
      }
    } catch (error) {
      console.error('Error loading flagged questions:', error)
    } finally {
      setLoading(false)
    }
  }

  function groupQuestionsByChapter(questions: FlaggedQuestion[]) {
    const grouped: GroupedQuestions = {}

    questions.forEach(q => {
      let chapterTitle = ''
      let chapterId: string | undefined

      if (q.question?.chapter) {
        chapterTitle = q.question.chapter.title
        chapterId = q.question.chapter.id
      } else if (q.questionBank) {
        // Group QuestionBank questions by category
        chapterTitle = q.questionBank.category === 'INDUSTRY' 
          ? 'Industry Knowledge (Timed Tests)'
          : 'Area Knowledge (Timed Tests)'
      }

      if (!grouped[chapterTitle]) {
        grouped[chapterTitle] = {
          chapterId,
          questions: []
        }
      }

      grouped[chapterTitle].questions.push(q)
    })

    setGroupedQuestions(grouped)
  }

  async function handleUnflag(flagId: string, questionId: string) {
    if (unflagging) return

    setUnflagging(flagId)
    try {
      const response = await fetch('/api/questions/unflag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId })
      })

      if (response.ok) {
        // Remove from local state
        const updated = questions.filter(q => q.id !== flagId)
        setQuestions(updated)
        groupQuestionsByChapter(updated)
      }
    } catch (error) {
      console.error('Error unflagging:', error)
    } finally {
      setUnflagging(null)
    }
  }

  function getOptions(q: FlaggedQuestion) {
    if (q.question) {
      return Array.isArray(q.question.options) 
        ? q.question.options 
        : []
    } else if (q.questionBank) {
      return [
        { id: 'A', text: q.questionBank.optionA },
        { id: 'B', text: q.questionBank.optionB },
        { id: 'C', text: q.questionBank.optionC },
        { id: 'D', text: q.questionBank.optionD },
      ]
    }
    return []
  }

  function getCorrectAnswer(q: FlaggedQuestion) {
    return q.question?.correctAnswer || q.questionBank?.correctAnswer || ''
  }

  function getExplanation(q: FlaggedQuestion) {
    return q.question?.explanation || q.questionBank?.explanation
  }

  function getFlagSourceLabel(flaggedFrom: string) {
    const labels: Record<string, string> = {
      CHAPTER: 'Chapter',
      TIMED_TEST: 'Timed Test',
      UNTIMED_TEST: 'Untimed Test',
      ASSIGNED_TEST: 'Assigned Test'
    }
    return labels[flaggedFrom] || flaggedFrom
  }

  function getChapterSlug(chapterId: string): string {
    // Map chapter IDs to their URL slugs
    const slugMap: Record<string, string> = {
      'chapter_northside_routes': 'northside-routes',
      'chapter_southside_full': 'southside-full',
      'chapter_southside_streets_2': 'southside-streets-2',
      'chapter_dublin_one_way_streets': 'dublin-one-way-streets',
      'chapter_hospitals': 'hospitals',
      'chapter_churches_cemeteries': 'churches-cemeteries',
      'chapter_embassies': 'embassies',
      'chapter_tourist_attractions': 'tourist-attractions',
      'chapter_industry_part1': 'industry-part1',
      'chapter_industry_part2': 'industry-part2',
      'chapter_industry_part3': 'industry-part3',
      'chapter_industry_5': 'industry-5',
      'chapter_industry_7': 'industry-7',
      'chapter_industry_8': 'industry-8',
    }
    return slugMap[chapterId] || chapterId
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flagged questions...</p>
        </div>
      </div>
    )
  }

  const chapterKeys = Object.keys(groupedQuestions).sort()
  const totalQuestions = questions.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium mb-3 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Flagged Questions</h1>
              <p className="text-gray-600 text-sm mt-1">
                {totalQuestions} question{totalQuestions !== 1 ? 's' : ''} flagged for review
              </p>
            </div>
            <FiFlag className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        {totalQuestions === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FiFlag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Flagged Questions</h2>
            <p className="text-gray-600 mb-6">
              You haven&apos;t flagged any questions yet. Flag questions while studying to review them later.
            </p>
            <Link
              href="/dashboard/chapters"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              <FiBookOpen className="w-5 h-5" />
              Start Learning
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {chapterKeys.map(chapterTitle => {
              const group = groupedQuestions[chapterTitle]
              const chapterQuestionCount = group.questions.length

              return (
                <div key={chapterTitle} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Chapter Header */}
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-4">
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                      <FiBookOpen className="w-5 h-5" />
                      {chapterTitle}
                    </h2>
                    <p className="text-red-50 text-sm mt-1">
                      {chapterQuestionCount} question{chapterQuestionCount !== 1 ? 's' : ''} flagged
                    </p>
                  </div>

                  {/* Questions List */}
                  <div className="divide-y divide-gray-200">
                    {group.questions.map((q, index) => {
                      const options = getOptions(q)
                      const correctAnswer = getCorrectAnswer(q)
                      const explanation = getExplanation(q)
                      const isExpanded = expandedQuestion === q.id
                      const canUnflag = q.questionId !== null // Can only unflag chapter/untimed/assigned test questions
                      const isFromTest = q.flaggedFrom !== 'CHAPTER'

                      return (
                        <div key={q.id} className="p-4">
                          {/* Question Header */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                  Q{index + 1}
                                </span>
                                {isFromTest && (
                                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                                    <FiFlag className="w-3 h-3" />
                                    From {getFlagSourceLabel(q.flaggedFrom)}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-900 font-medium leading-relaxed">
                                {q.question?.questionText || q.questionBank?.questionText}
                              </p>
                            </div>
                            {canUnflag && (
                              <button
                                onClick={() => handleUnflag(q.id, q.questionId!)}
                                disabled={unflagging === q.id}
                                className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Unflag question"
                              >
                                <FiX className="w-5 h-5" />
                              </button>
                            )}
                          </div>

                          {/* Options */}
                          <div className="space-y-2 mb-3">
                            {options.map((option: any) => {
                              const isCorrect = option.id === correctAnswer
                              
                              return (
                                <div
                                  key={option.id}
                                  className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                                    isCorrect
                                      ? 'border-green-500 bg-green-50'
                                      : 'border-gray-200 bg-gray-50'
                                  }`}
                                >
                                  <div className="flex-shrink-0 mt-0.5">
                                    {isCorrect ? (
                                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                        <FiCheckCircle className="w-3 h-3 text-white" />
                                      </div>
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <span className="font-semibold text-gray-700 mr-2">{option.id}.</span>
                                    <span className={isCorrect ? 'text-green-900 font-medium' : 'text-gray-700'}>
                                      {option.text}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          {/* Explanation */}
                          {explanation && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                              <p className="text-sm font-semibold text-blue-900 mb-1">💡 Explanation:</p>
                              <p className="text-sm text-blue-800">{explanation}</p>
                            </div>
                          )}

                          {/* Actions */}
                          {q.question && group.chapterId && (
                            <Link
                              href={`/dashboard/chapters/${getChapterSlug(group.chapterId)}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                            >
                              <FiBookOpen className="w-4 h-4" />
                              Go to Chapter
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Help Text */}
        {totalQuestions > 0 && (
          <div className="mt-6 bg-white rounded-lg p-4 text-center text-sm text-gray-600">
            <p>💡 Tip: Review these questions regularly to reinforce your learning.</p>
            <p className="mt-1">Click &quot;Practice in Chapter&quot; to attempt the question as an MCQ.</p>
          </div>
        )}
      </main>
    </div>
  )
}
