/**
 * Script to generate route files for the 3 new chapters
 */

import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const chapters = [
  {
    id: 'chapter_transport_infrastructure',
    slug: 'transport-infrastructure',
    title: 'Transport & Infrastructure',
    totalQuestions: 30
  },
  {
    id: 'chapter_industrial_estates_business_parks',
    slug: 'industrial-estates-business-parks',
    title: 'Industrial Estates & Business Parks',
    totalQuestions: 15
  },
  {
    id: 'chapter_stadiums_sport_grounds_clubs',
    slug: 'stadiums-sport-grounds-clubs',
    title: 'Stadiums, Sport Grounds and Clubs',
    totalQuestions: 64
  }
]

const basePath = resolve(process.cwd(), 'src/app/dashboard/chapters')

// Quiz page template
const quizPageTemplate = (chapter: typeof chapters[0]) => `'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { MCQQuestion } from '@/components/chapters/MCQQuestion'

const CHAPTER_ID = '${chapter.id}'
const CHAPTER_PATH = '${chapter.slug}'

interface Question {
  id: string
  questionText: string
  questionNumber: number
  options: Array<{ id: string; text: string }>
  correctAnswer?: string
  explanation?: string
  points: number
  studentAnswer?: {
    selectedAnswer: string
    isCorrect: boolean
  }
}

function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState<any>(null)
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

      await loadQuestions()
      await loadProgress()
    } catch (error) {
      console.error('Error:', error)
      router.push('/login')
    }
  }

  const loadQuestions = async () => {
    try {
      const count = searchParams.get('count') || 'all'
      const strategy = searchParams.get('strategy') || 'mix'
      setQuestionCount(count as any)
      
      const queryParams = new URLSearchParams({
        includeAnswers: 'false',
        random: 'true',
        strategy: strategy
      })
      if (count !== 'all') {
        queryParams.set('count', count)
      }
      
      const response = await fetch(\`/api/chapters/\${CHAPTER_ID}/questions?\${queryParams.toString()}\`)
      const data = await response.json()

      if (response.ok) {
        setQuestions(data.questions)
        setAnsweredQuestions({})
        setSelectedAnswers({})
      }
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAccessAndLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadProgress = async () => {
    try {
      const response = await fetch(\`/api/chapters/\${CHAPTER_ID}/progress\`)
      const data = await response.json()

      if (response.ok && data.progress) {
        setProgress(data.progress)
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    if (answeredQuestions[questionId]) return
    
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId
    })
  }

  const handleSubmitAnswer = async (questionId: string) => {
    const selectedAnswer = selectedAnswers[questionId]
    if (!selectedAnswer || submitting) return

    setSubmitting(true)
    try {
      const response = await fetch(
        \`/api/chapters/\${CHAPTER_ID}/questions/\${questionId}/answer\`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedAnswer })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setAnsweredQuestions({
          ...answeredQuestions,
          [questionId]: true
        })

        setQuestions(questions.map(q => {
          if (q.id === questionId) {
            return {
              ...q,
              correctAnswer: data.correctAnswer,
              explanation: data.explanation,
              studentAnswer: {
                selectedAnswer: selectedAnswer,
                isCorrect: data.isCorrect
              }
            }
          }
          return q
        }))

        if (data.chapterProgress) {
          setProgress({
            ...progress,
            correctAnswers: data.chapterProgress.correctAnswers,
            totalQuestions: data.chapterProgress.totalQuestions,
            score: data.chapterProgress.score
          })
        }

        setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
          }
        }, 2000)
      } else {
        alert(data.error || 'Failed to submit answer')
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Failed to submit answer. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCompleteChapter = async () => {
    const count = questionCount === 'all' ? 'all' : questionCount.toString()
    router.push(\`/dashboard/chapters/\${CHAPTER_PATH}/results?count=\${count}\`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const allAnswered = questions.every(q => answeredQuestions[q.id])
  const answeredCount = Object.keys(answeredQuestions).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={\`/dashboard/chapters/\${CHAPTER_PATH}\`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex-1 mx-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  {answeredCount} / {questions.length} answered
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{
                    width: \`\${((currentQuestionIndex + 1) / questions.length) * 100}%\`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-4xl mx-auto pb-20">
        {currentQuestion && (
          <MCQQuestion
            question={currentQuestion}
            selectedAnswer={selectedAnswers[currentQuestion.id] || null}
            isAnswered={answeredQuestions[currentQuestion.id] || false}
            isCorrect={currentQuestion.studentAnswer?.isCorrect || null}
            onSelectAnswer={(answerId) => handleSelectAnswer(currentQuestion.id, answerId)}
            onSubmitAnswer={() => handleSubmitAnswer(currentQuestion.id)}
            submitting={submitting}
            showFlagOption={true}
          />
        )}

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-gray-700 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === questions.length - 1}
            className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-gray-700 transition-colors"
          >
            Next
          </button>
        </div>

        {allAnswered && (
          <button
            onClick={handleCompleteChapter}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            <FiCheckCircle className="w-6 h-6" />
            <span>Complete Chapter</span>
          </button>
        )}
      </main>
    </div>
  )
}

export default function ${chapter.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  )
}
`

// Results page template
const resultsPageTemplate = (chapter: typeof chapters[0]) => `'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiCheckCircle, FiX, FiAward, FiRotateCcw } from 'react-icons/fi'
import { BottomNav } from '@/components/dashboard/BottomNav'

const CHAPTER_ID = '${chapter.id}'
const CHAPTER_PATH = '${chapter.slug}'
const CHAPTER_TITLE = '${chapter.title}'

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
      const progressResponse = await fetch(\`/api/chapters/\${CHAPTER_ID}/progress\`)
      const progressData = await progressResponse.json()

      if (progressResponse.ok) {
        setProgress(progressData.progress)
        
        const answersMap: Record<string, any> = {}
        progressData.answers.forEach((a: any) => {
          answersMap[a.questionId] = a
        })
        setAnswers(answersMap)
      }

      const count = searchParams.get('count') || 'all'
      setQuestionCount(count as any)
      
      const queryParams = new URLSearchParams({
        includeAnswers: 'true',
        random: 'true'
      })
      if (count !== 'all') {
        queryParams.set('count', count)
      }
      
      const questionsResponse = await fetch(\`/api/chapters/\${CHAPTER_ID}/questions?\${queryParams.toString()}\`)
      const questionsData = await questionsResponse.json()

      if (questionsResponse.ok) {
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
  const isPassed = score >= 80
  const correctCount = progress?.correctAnswers || 0
  const totalQuestions = progress?.totalQuestions || questions.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={\`/dashboard/chapters/\${CHAPTER_PATH}\`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Chapter Results</h1>
              <p className="text-sm text-gray-600">{CHAPTER_TITLE}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-4xl mx-auto pb-24">
        <div className={\`bg-white rounded-2xl shadow-lg p-8 mb-6 text-center \${
          isPassed ? 'border-2 border-green-500' : 'border-2 border-orange-500'
        }\`}>
          <div className={\`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 \${
            isPassed ? 'bg-green-100' : 'bg-orange-100'
          }\`}>
            {isPassed ? (
              <FiAward className="w-12 h-12 text-green-600" />
            ) : (
              <FiX className="w-12 h-12 text-orange-600" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {score}%
          </h2>
          
          <p className={\`text-lg font-semibold mb-4 \${
            isPassed ? 'text-green-600' : 'text-orange-600'
          }\`}>
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
                  className={\`p-4 rounded-xl border-2 \${
                    isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }\`}
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
                              className={\`p-3 rounded-lg \${
                                isCorrectOption
                                  ? 'bg-green-100 border-2 border-green-500'
                                  : isSelected && !isCorrect
                                  ? 'bg-red-100 border-2 border-red-500'
                                  : 'bg-gray-50 border-2 border-gray-200'
                              }\`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={\`w-6 h-6 rounded flex items-center justify-center text-sm font-bold \${
                                  isCorrectOption
                                    ? 'bg-green-500 text-white'
                                    : isSelected && !isCorrect
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-300 text-gray-700'
                                }\`}>
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

        <div className="flex gap-4">
          <Link
            href="/dashboard/chapters"
            className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700 text-center transition-colors"
          >
            Back to Chapters
          </Link>
          <Link
            href={\`/dashboard/chapters/\${CHAPTER_PATH}/quiz\`}
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

export default function ${chapter.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}ResultsPage() {
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
`

// Analytics page template
const analyticsPageTemplate = (chapter: typeof chapters[0]) => `'use client'

import { ChapterAnalytics } from '@/components/chapters/ChapterAnalytics'

export default function ${chapter.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}AnalyticsPage() {
  return (
    <ChapterAnalytics
      chapterId="${chapter.id}"
      chapterSlug="${chapter.slug}"
      chapterTitle="${chapter.title}"
    />
  )
}
`

// Chapter mode page template
const chapterModePageTemplate = (chapter: typeof chapters[0]) => `'use client'

import { ChapterModePage } from '@/components/chapters/ChapterModePage'

export default function ${chapter.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}ChapterModePage() {
  return (
    <ChapterModePage
      chapterId="${chapter.id}"
      chapterSlug="${chapter.slug}"
      chapterTitle="${chapter.title}"
    />
  )
}
`

// Generate all files
chapters.forEach(chapter => {
  const chapterPath = resolve(basePath, chapter.slug)
  
  // Create directories
  mkdirSync(resolve(chapterPath, 'quiz'), { recursive: true })
  mkdirSync(resolve(chapterPath, 'results'), { recursive: true })
  mkdirSync(resolve(chapterPath, 'analytics'), { recursive: true })
  mkdirSync(resolve(chapterPath, 'chapter-mode'), { recursive: true })
  
  // Write files
  writeFileSync(resolve(chapterPath, 'quiz/page.tsx'), quizPageTemplate(chapter))
  writeFileSync(resolve(chapterPath, 'results/page.tsx'), resultsPageTemplate(chapter))
  writeFileSync(resolve(chapterPath, 'analytics/page.tsx'), analyticsPageTemplate(chapter))
  writeFileSync(resolve(chapterPath, 'chapter-mode/page.tsx'), chapterModePageTemplate(chapter))
  
  console.log(`✅ Generated route files for ${chapter.title}`)
})

console.log('\n🎉 All route files generated successfully!')
