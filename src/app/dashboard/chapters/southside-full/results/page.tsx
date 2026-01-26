'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiCheckCircle, FiX, FiAward, FiRotateCcw } from 'react-icons/fi'

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [questionCount, setQuestionCount] = useState<number | 'all'>('all')

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

      await loadResults()
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const loadResults = async () => {
    try {
      // Load progress
      const progressResponse = await fetch('/api/chapters/chapter_southside_full/progress')
      const progressData = await progressResponse.json()

      if (progressResponse.ok) {
        setProgress(progressData.progress)
        
        // Create answers map
        const answersMap: Record<string, any> = {}
        progressData.answers.forEach((a: any) => {
          answersMap[a.questionId] = a
        })
        setAnswers(answersMap)
      }

      // Get count from URL params
      const count = searchParams.get('count') || 'all'
      setQuestionCount(count as any)
      
      // Load questions with answers (same set that was used in quiz)
      const queryParams = new URLSearchParams({
        includeAnswers: 'true',
        random: 'true'
      })
      if (count !== 'all') {
        queryParams.set('count', count)
      }
      
      const questionsResponse = await fetch(`/api/chapters/chapter_southside_full/questions?${queryParams.toString()}`)
      const questionsData = await questionsResponse.json()

      if (questionsResponse.ok) {
        // Filter to only show questions that were answered in this session
        const answeredQuestionIds = Object.keys(answers)
        const sessionQuestions = questionsData.questions.filter((q: any) => 
          answeredQuestionIds.includes(q.id) || q.studentAnswer
        )
        setQuestions(sessionQuestions)
      }
    } catch (error) {
      console.error('Error loading results:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAccessAndLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const score = progress?.score || 0
  const isPassed = score >= 80 // 80% passing score
  const correctCount = progress?.correctAnswers || 0
  const totalQuestions = progress?.totalQuestions || questions.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/chapters/southside-full"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Chapter Results</h1>
              <p className="text-sm text-gray-600">Southside Full</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        {/* Score Card */}
        <div className={`bg-white rounded-2xl shadow-lg p-8 mb-6 text-center ${
          isPassed ? 'border-2 border-green-500' : 'border-2 border-orange-500'
        }`}>
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
            isPassed ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            {isPassed ? (
              <FiAward className="w-12 h-12 text-green-600" />
            ) : (
              <FiX className="w-12 h-12 text-orange-600" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {score}%
          </h2>
          
          <p className={`text-lg font-semibold mb-4 ${
            isPassed ? 'text-green-600' : 'text-orange-600'
          }`}>
            {isPassed ? 'Congratulations! You passed!' : 'Keep practicing!'}
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div>
              <span className="font-semibold text-gray-900">{correctCount}</span> correct
            </div>
            <div>
              <span className="font-semibold text-gray-900">{totalQuestions - correctCount}</span> incorrect
            </div>
            <div>
              <span className="font-semibold text-gray-900">{totalQuestions}</span> total
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Question Review</h3>
          
          <div className="space-y-6">
            {questions.map((question, index) => {
              const answer = answers[question.id]
              const isCorrect = answer?.isCorrect || false
              const selectedAnswer = answer?.selectedAnswer || question.studentAnswer?.selectedAnswer
              
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-xl border-2 ${
                    isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? (
                      <FiCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <FiX className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          Question {index + 1}
                        </span>
                        {isCorrect ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            Correct
                          </span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                            Incorrect
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 mb-3">{question.questionText}</p>
                      
                      <div className="space-y-2">
                        {question.options.map((option: any) => {
                          const isSelected = selectedAnswer === option.id
                          const isCorrectOption = question.correctAnswer === option.id
                          
                          return (
                            <div
                              key={option.id}
                              className={`p-3 rounded-lg ${
                                isCorrectOption
                                  ? 'bg-green-100 border-2 border-green-500'
                                  : isSelected && !isCorrect
                                  ? 'bg-red-100 border-2 border-red-500'
                                  : 'bg-gray-50 border-2 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-6 h-6 rounded flex items-center justify-center text-sm font-bold ${
                                  isCorrectOption
                                    ? 'bg-green-500 text-white'
                                    : isSelected && !isCorrect
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-300 text-gray-700'
                                }`}>
                                  {option.id}
                                </span>
                                <span className="text-sm">{option.text}</span>
                                {isCorrectOption && (
                                  <span className="ml-auto text-xs font-medium text-green-700">
                                    Correct Answer
                                  </span>
                                )}
                                {isSelected && !isCorrect && (
                                  <span className="ml-auto text-xs font-medium text-red-700">
                                    Your Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      
                      {question.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs font-semibold text-blue-900 mb-1">Explanation:</p>
                          <p className="text-xs text-blue-800">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/dashboard/chapters"
            className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700 text-center transition-colors"
          >
            Back to Chapters
          </Link>
          <Link
            href="/dashboard/chapters/southside-full/quiz"
            className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-center transition-colors flex items-center justify-center gap-2"
          >
            <FiRotateCcw className="w-5 h-5" />
            Retake Chapter
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function SouthsideFullResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
