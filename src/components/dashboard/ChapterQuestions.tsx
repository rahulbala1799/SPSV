'use client'

import { useState } from 'react'
import { QuestionAnswer } from '@/types'

interface Question {
  id: string
  question: string
  options: { id: string; label: string }[]
  correctAnswer: string
  explanation: string
}

interface ChapterQuestionsProps {
  chapterId: string
  questions: Question[]
  answeredQuestions: Map<string, QuestionAnswer>
}

export function ChapterQuestions({ chapterId, questions, answeredQuestions }: ChapterQuestionsProps) {
  const handleAnswer = async (questionId: string, selectedAnswer: string, correctAnswer: string) => {
    const isCorrect = selectedAnswer === correctAnswer

    try {
      await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId,
          questionId,
          selectedAnswer,
          isCorrect,
        }),
      })

      // Refresh page to show updated answer
      window.location.reload()
    } catch (error) {
      console.error('Failed to save answer:', error)
    }
  }

  return (
    <div className="space-y-6">
      {questions.map((question, index) => {
        const userAnswer = answeredQuestions.get(question.id)
        const isAnswered = !!userAnswer

        return (
          <div
            key={question.id}
            className={`border-2 rounded-lg p-6 ${
              isAnswered
                ? userAnswer.isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Question {index + 1}: {question.question}
            </h3>

            <div className="space-y-2 mb-4">
              {question.options.map((option) => {
                const isSelected = userAnswer?.selectedAnswer === option.id
                const isCorrect = option.id === question.correctAnswer

                return (
                  <button
                    key={option.id}
                    onClick={() => !isAnswered && handleAnswer(question.id, option.id, question.correctAnswer)}
                    disabled={isAnswered}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                      isAnswered
                        ? isCorrect
                          ? 'border-green-500 bg-green-100'
                          : isSelected
                          ? 'border-red-500 bg-red-100'
                          : 'border-gray-200 bg-gray-50'
                        : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
                    } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{option.id}.</span>
                      <span>{option.label}</span>
                      {isAnswered && isCorrect && (
                        <span className="ml-auto text-green-600 font-bold">✓</span>
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <span className="ml-auto text-red-600 font-bold">✗</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {isAnswered && question.explanation && (
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Explanation:</strong> {question.explanation}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
