'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function AnswerReviewPage() {
  const params = useParams()
  const [results, setResults] = useState<any>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filter, setFilter] = useState<'ALL' | 'CORRECT' | 'INCORRECT'>('ALL')

  useEffect(() => {
    fetchResults()
  }, [])

  async function fetchResults() {
    try {
      const res = await fetch(`/api/tests/sessions/${params.id}/results`)
      const data = await res.json()
      setResults(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (!results) return <div className="container mx-auto px-4 py-8">Loading...</div>

  const filteredQuestions = results.questions.filter((q: any) => {
    if (filter === 'CORRECT') return q.isCorrect
    if (filter === 'INCORRECT') return !q.isCorrect
    return true
  })

  const currentQuestion = filteredQuestions[currentIndex]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Answer Review</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setFilter('ALL'); setCurrentIndex(0) }}
            className={`px-4 py-2 rounded ${filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All ({results.questions.length})
          </button>
          <button
            onClick={() => { setFilter('CORRECT'); setCurrentIndex(0) }}
            className={`px-4 py-2 rounded ${filter === 'CORRECT' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Correct ({results.questions.filter((q: any) => q.isCorrect).length})
          </button>
          <button
            onClick={() => { setFilter('INCORRECT'); setCurrentIndex(0) }}
            className={`px-4 py-2 rounded ${filter === 'INCORRECT' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            Incorrect ({results.questions.filter((q: any) => !q.isCorrect).length})
          </button>
        </div>

        {/* Question Display */}
        {currentQuestion && (
          <div className="border rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="font-semibold">
                  Question {currentQuestion.orderNumber} of {results.questions.length}
                </span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  currentQuestion.category === 'INDUSTRY' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {currentQuestion.category}
                </span>
              </div>
              <div className={`px-3 py-1 rounded ${
                currentQuestion.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {currentQuestion.isCorrect ? '✓ Correct' : '✗ Incorrect'}
              </div>
            </div>

            <p className="text-lg mb-4">{currentQuestion.questionText}</p>

            <div className="space-y-2 mb-4">
              {['A', 'B', 'C', 'D'].map(option => {
                const isSelected = currentQuestion.selectedAnswer === option
                const isCorrect = currentQuestion.correctAnswer === option
                const bgColor = isCorrect
                  ? 'bg-green-100 border-green-500'
                  : isSelected && !isCorrect
                  ? 'bg-red-100 border-red-500'
                  : 'bg-gray-50'

                return (
                  <div
                    key={option}
                    className={`border-2 rounded p-3 ${bgColor}`}
                  >
                    <div className="flex items-center">
                      <span className="font-semibold mr-2">{option}.</span>
                      <span>{currentQuestion.options[option]}</span>
                      {isCorrect && <span className="ml-auto text-green-600">✓ Correct</span>}
                      {isSelected && !isCorrect && <span className="ml-auto text-red-600">Your Answer</span>}
                    </div>
                  </div>
                )
              })}
            </div>

            {currentQuestion.explanation && (
              <div className="mt-4 p-4 bg-blue-50 rounded">
                <strong>Explanation:</strong> {currentQuestion.explanation}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-600">
              Time spent: {Math.floor(currentQuestion.timeSpent / 60)}:
              {String(currentQuestion.timeSpent % 60).padStart(2, '0')}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            {currentIndex + 1} / {filteredQuestions.length}
          </span>
          <button
            onClick={() => setCurrentIndex(Math.min(filteredQuestions.length - 1, currentIndex + 1))}
            disabled={currentIndex === filteredQuestions.length - 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
