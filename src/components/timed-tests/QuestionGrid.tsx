'use client'

interface QuestionGridProps {
  totalQuestions: number
  currentIndex: number
  answeredQuestions: Set<number>
  onQuestionClick: (index: number) => void
}

export default function QuestionGrid({
  totalQuestions,
  currentIndex,
  answeredQuestions,
  onQuestionClick
}: QuestionGridProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="mb-2 text-sm">
        Answered: {answeredQuestions.size} / {totalQuestions}
      </div>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const questionNum = i + 1
          const isAnswered = answeredQuestions.has(questionNum)
          const isCurrent = i === currentIndex

          let bgColor = 'bg-gray-200'
          if (isCurrent) bgColor = 'bg-blue-500 text-white'
          else if (isAnswered) bgColor = 'bg-green-500 text-white'

          return (
            <button
              key={i}
              onClick={() => onQuestionClick(i)}
              className={`w-10 h-10 rounded ${bgColor} hover:opacity-80`}
              title={`Question ${questionNum}`}
            >
              {isAnswered ? '✓' : questionNum}
            </button>
          )
        })}
      </div>
    </div>
  )
}
