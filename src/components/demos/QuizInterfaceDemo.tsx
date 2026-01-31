'use client'

import { useState } from 'react'
import { FiCheckCircle, FiXCircle, FiClock, FiBook, FiArrowRight, FiFlag } from 'react-icons/fi'

export function QuizInterfaceDemo() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answered, setAnswered] = useState<number[]>([])

  const demoQuestions = [
    {
      id: 1,
      questionText: 'What is the maximum fare a taxi driver can charge for a journey within Dublin city center during standard hours?',
      options: [
        { id: 'A', text: 'The fare shown on the taximeter' },
        { id: 'B', text: 'Any amount agreed with the passenger' },
        { id: 'C', text: 'A flat rate of €20' },
        { id: 'D', text: 'Double the meter rate after midnight' },
      ],
      correctAnswer: 'A',
      explanation: 'The fare must be the amount shown on the taximeter, which is regulated by the NTA. Taxi drivers cannot charge more than the metered fare unless there are specific circumstances (like tolls) agreed upon in advance.',
      category: 'Industry Knowledge',
    },
    {
      id: 2,
      questionText: 'Which landmark is located on O\'Connell Street in Dublin city center?',
      options: [
        { id: 'A', text: 'Trinity College' },
        { id: 'B', text: 'The Spire' },
        { id: 'C', text: 'Dublin Castle' },
        { id: 'D', text: 'St. Patrick\'s Cathedral' },
      ],
      correctAnswer: 'B',
      explanation: 'The Spire (officially titled the Monument of Light) is a large, stainless steel pin-like monument located on O\'Connell Street. It is one of Dublin\'s most recognizable landmarks.',
      category: 'Area Knowledge',
    },
    {
      id: 3,
      questionText: 'What should a taxi driver do if a passenger leaves an item in the vehicle?',
      options: [
        { id: 'A', text: 'Keep it and wait for the passenger to call' },
        { id: 'B', text: 'Report it to An Garda Síochána within 48 hours' },
        { id: 'C', text: 'Throw it away after 24 hours' },
        { id: 'D', text: 'Sell it if not claimed within a week' },
      ],
      correctAnswer: 'B',
      explanation: 'Under taxi regulations, drivers must report any lost property to An Garda Síochána (Irish police) within 48 hours. This is a legal requirement and ensures proper handling of lost items.',
      category: 'Industry Knowledge',
    },
  ]

  const question = demoQuestions[currentQuestion]
  const isCorrect = selectedAnswer === question.correctAnswer

  const handleAnswerSelect = (optionId: string) => {
    if (!showExplanation) {
      setSelectedAnswer(optionId)
      setShowExplanation(true)
      if (!answered.includes(currentQuestion)) {
        setAnswered([...answered, currentQuestion])
      }
    }
  }

  const handleNext = () => {
    if (currentQuestion < demoQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const getOptionStyle = (optionId: string) => {
    if (!showExplanation) {
      return selectedAnswer === optionId
        ? 'border-emerald-500 bg-emerald-50'
        : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50'
    }

    if (optionId === question.correctAnswer) {
      return 'border-green-500 bg-green-50'
    }

    if (selectedAnswer === optionId && !isCorrect) {
      return 'border-red-500 bg-red-50'
    }

    return 'border-gray-200 bg-gray-50'
  }

  const getOptionIcon = (optionId: string) => {
    if (!showExplanation) return null

    if (optionId === question.correctAnswer) {
      return <FiCheckCircle className="w-6 h-6 text-green-600" />
    }

    if (selectedAnswer === optionId && !isCorrect) {
      return <FiXCircle className="w-6 h-6 text-red-600" />
    }

    return null
  }

  return (
    <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-emerald-500/20">
      {/* Quiz Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FiBook className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{question.category}</h3>
              <p className="text-emerald-100 text-sm">Practice Quiz</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
            <FiClock className="w-5 h-5" />
            <span className="font-bold">12:45</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>
              Question {currentQuestion + 1} of {demoQuestions.length}
            </span>
            <span>{answered.length} answered</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / demoQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="p-8">
        {/* Question */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold flex-shrink-0">
              {currentQuestion + 1}
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-gray-900 leading-relaxed">{question.questionText}</h4>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                disabled={showExplanation}
                className={`w-full p-5 rounded-xl border-2 transition-all duration-300 text-left ${getOptionStyle(
                  option.id
                )} ${!showExplanation ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${
                      showExplanation && option.id === question.correctAnswer
                        ? 'bg-green-500 text-white'
                        : showExplanation && selectedAnswer === option.id && !isCorrect
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {option.id}
                  </div>
                  <span className="flex-1 text-lg text-gray-900">{option.text}</span>
                  {getOptionIcon(option.id)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div
            className={`p-6 rounded-2xl border-2 mb-6 ${
              isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {isCorrect ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <FiCheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-green-900">Correct! Well done! 🎉</h5>
                    <p className="text-green-700 text-sm">You got this one right</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                    <FiXCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-red-900">Not quite right</h5>
                    <p className="text-red-700 text-sm">
                      The correct answer is <strong>{question.correctAnswer}</strong>
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">💡 Explanation:</p>
              <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {!showExplanation ? (
            <button className="flex-1 px-6 py-4 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed">
              Select an answer to continue
            </button>
          ) : (
            <>
              <button className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <FiFlag className="w-5 h-5" />
                Flag for Review
              </button>
              {currentQuestion < demoQuestions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Next Question
                  <FiArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  Finish Quiz
                  <FiCheckCircle className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50 rounded-xl text-center">
            <div className="text-2xl font-bold text-emerald-700">
              {answered.filter((i) => demoQuestions[i] && selectedAnswer === demoQuestions[i].correctAnswer).length}
            </div>
            <div className="text-xs text-emerald-600">Correct</div>
          </div>
          <div className="p-4 bg-red-50 rounded-xl text-center">
            <div className="text-2xl font-bold text-red-700">
              {answered.filter((i) => demoQuestions[i] && selectedAnswer !== demoQuestions[i].correctAnswer).length}
            </div>
            <div className="text-xs text-red-600">Incorrect</div>
          </div>
          <div className="p-4 bg-gray-100 rounded-xl text-center">
            <div className="text-2xl font-bold text-gray-700">{demoQuestions.length - answered.length}</div>
            <div className="text-xs text-gray-600">Remaining</div>
          </div>
        </div>
      </div>
    </div>
  )
}
