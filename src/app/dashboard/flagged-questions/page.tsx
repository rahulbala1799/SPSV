'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiFlag, FiCheckCircle, FiBookOpen, FiX, FiChevronDown, FiChevronRight, FiMaximize2 } from 'react-icons/fi'

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
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})

  useEffect(() => {
    checkAccessAndLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function checkAccessAndLoad() {
    try {
      const authResponse = await fetch('/api/auth/me')
      const authData = await authResponse.json()

      if (!authResponse.ok || !authData.user || authData.user.role !== 'STUDENT') {
        router.push('/login')
        return
      }

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
        const grouped = groupQuestionsByChapter(data.flaggedQuestions || [])
        setGroupedQuestions(grouped)
        
        // Expand first chapter by default on mobile
        const firstChapter = Object.keys(grouped)[0]
        if (firstChapter) {
          setExpandedChapters(new Set([firstChapter]))
        }
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

    return grouped
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
        const updated = questions.filter(q => q.id !== flagId)
        setQuestions(updated)
        setGroupedQuestions(groupQuestionsByChapter(updated))
      }
    } catch (error) {
      console.error('Error unflagging:', error)
    } finally {
      setUnflagging(null)
    }
  }

  function toggleChapter(chapterTitle: string) {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterTitle)) {
      newExpanded.delete(chapterTitle)
    } else {
      newExpanded.add(chapterTitle)
    }
    setExpandedChapters(newExpanded)
  }

  function toggleQuestion(questionId: string) {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
      // Clear selected answer when collapsing
      setSelectedAnswers(prev => {
        const { [questionId]: _, ...rest } = prev
        return rest
      })
    } else {
      newExpanded.add(questionId)
    }
    setExpandedQuestions(newExpanded)
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

  function getCorrectAnswerText(q: FlaggedQuestion) {
    const correctAnswer = getCorrectAnswer(q)
    const options = getOptions(q)
    const correctOption = options.find((opt: any) => opt.id === correctAnswer)
    return correctOption?.text || ''
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
      'chapter_schools_libraries_universities': 'schools-libraries-universities',
      'chapter_dublin_roads_navigation': 'dublin-roads-navigation',
      'chapter_routes': 'routes',
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
            <span>Back</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Flagged Questions</h1>
              <p className="text-gray-600 text-sm mt-1">
                {totalQuestions} question{totalQuestions !== 1 ? 's' : ''} saved
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <FiFlag className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        {totalQuestions === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFlag className="w-10 h-10 text-red-400" />
            </div>
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
          <div className="space-y-4">
            {chapterKeys.map(chapterTitle => {
              const group = groupedQuestions[chapterTitle]
              const chapterQuestionCount = group.questions.length
              const isChapterExpanded = expandedChapters.has(chapterTitle)

              return (
                <div key={chapterTitle} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {/* Chapter Header - Collapsible */}
                  <button
                    onClick={() => toggleChapter(chapterTitle)}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 px-4 py-4 flex items-center justify-between hover:from-red-600 hover:to-orange-600 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {isChapterExpanded ? (
                        <FiChevronDown className="w-5 h-5 text-white flex-shrink-0" />
                      ) : (
                        <FiChevronRight className="w-5 h-5 text-white flex-shrink-0" />
                      )}
                      <div className="text-left">
                        <h2 className="text-white font-bold text-base md:text-lg">{chapterTitle}</h2>
                        <p className="text-red-50 text-xs md:text-sm mt-0.5">
                          {chapterQuestionCount} question{chapterQuestionCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {group.chapterId && (
                      <Link
                        href={`/dashboard/chapters/${getChapterSlug(group.chapterId)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 bg-white text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <FiBookOpen className="w-4 h-4 inline mr-1" />
                        Go
                      </Link>
                    )}
                  </button>

                  {/* Questions List - Collapsible */}
                  {isChapterExpanded && (
                    <div className="divide-y divide-gray-100">
                      {group.questions.map((q, index) => {
                        const questionKey = q.id
                        const isExpanded = expandedQuestions.has(questionKey)
                        const options = getOptions(q)
                        const correctAnswer = getCorrectAnswer(q)
                        const correctAnswerText = getCorrectAnswerText(q)
                        const explanation = getExplanation(q)
                        const canUnflag = q.questionId !== null
                        const isFromTest = q.flaggedFrom !== 'CHAPTER'
                        const selectedAnswer = selectedAnswers[questionKey]

                        return (
                          <div key={q.id} className="p-4 hover:bg-gray-50 transition-colors">
                            {/* Collapsed View: Question + Correct Answer */}
                            <div className="space-y-3">
                              {/* Question Header */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-2">
                                    <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                      Q{index + 1}
                                    </span>
                                    {isFromTest && (
                                      <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                        {getFlagSourceLabel(q.flaggedFrom)}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-900 font-medium text-sm leading-relaxed">
                                    {q.question?.questionText || q.questionBank?.questionText}
                                  </p>
                                </div>
                                {canUnflag && !isExpanded && (
                                  <button
                                    onClick={() => handleUnflag(q.id, q.questionId!)}
                                    disabled={unflagging === q.id}
                                    className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Unflag"
                                  >
                                    <FiX className="w-4 h-4" />
                                  </button>
                                )}
                              </div>

                              {/* Correct Answer - Always Visible */}
                              {!isExpanded && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <div className="flex items-start gap-2">
                                    <FiCheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-green-900 mb-1">Correct Answer:</p>
                                      <p className="text-sm text-green-800">
                                        <span className="font-bold">{correctAnswer}.</span> {correctAnswerText}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Practice Button */}
                              {!isExpanded && (
                                <button
                                  onClick={() => toggleQuestion(questionKey)}
                                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                                >
                                  <FiMaximize2 className="w-4 h-4" />
                                  Practice this Question
                                </button>
                              )}

                              {/* Expanded View: Full MCQ */}
                              {isExpanded && (
                                <div className="space-y-3 pt-2 border-t border-gray-200">
                                  {/* All Options */}
                                  <div className="space-y-2">
                                    {options.map((option: any) => {
                                      const isCorrect = option.id === correctAnswer
                                      const isSelected = selectedAnswer === option.id
                                      
                                      return (
                                        <button
                                          key={option.id}
                                          onClick={() => setSelectedAnswers(prev => ({ ...prev, [questionKey]: option.id }))}
                                          className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                                            isSelected && isCorrect
                                              ? 'border-green-500 bg-green-50'
                                              : isSelected && !isCorrect
                                              ? 'border-red-500 bg-red-50'
                                              : isCorrect && selectedAnswer
                                              ? 'border-green-500 bg-green-50'
                                              : 'border-gray-200 hover:border-gray-300 bg-white'
                                          }`}
                                        >
                                          <div className="flex-shrink-0 mt-0.5">
                                            {isCorrect && selectedAnswer ? (
                                              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                                <FiCheckCircle className="w-3 h-3 text-white" />
                                              </div>
                                            ) : isSelected ? (
                                              <div className="w-5 h-5 rounded-full border-2 border-red-500 bg-red-500"></div>
                                            ) : (
                                              <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <span className="font-bold text-gray-700 mr-2">{option.id}.</span>
                                            <span className={
                                              isCorrect && selectedAnswer
                                                ? 'text-green-900 font-medium'
                                                : isSelected && !isCorrect
                                                ? 'text-red-900'
                                                : 'text-gray-700'
                                            }>
                                              {option.text}
                                            </span>
                                          </div>
                                        </button>
                                      )
                                    })}
                                  </div>

                                  {/* Explanation */}
                                  {explanation && selectedAnswer && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                      <p className="text-xs font-semibold text-blue-900 mb-1">💡 Explanation:</p>
                                      <p className="text-sm text-blue-800">{explanation}</p>
                                    </div>
                                  )}

                                  {/* Action Buttons */}
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => toggleQuestion(questionKey)}
                                      className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
                                    >
                                      Collapse
                                    </button>
                                    {canUnflag && (
                                      <button
                                        onClick={() => handleUnflag(q.id, q.questionId!)}
                                        disabled={unflagging === q.id}
                                        className="px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                                      >
                                        <FiX className="w-4 h-4" />
                                        Unflag
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Help Text */}
        {totalQuestions > 0 && (
          <div className="mt-6 bg-white rounded-lg p-4 text-center text-sm text-gray-600">
            <p>💡 Tap chapter headers to expand/collapse</p>
            <p className="mt-1">Tap &quot;Practice this Question&quot; to test yourself</p>
          </div>
        )}
      </main>
    </div>
  )
}
