'use client'

interface DashboardStatsProps {
  stats: {
    totalChapters: number
    completedChapters: number
    totalQuestions: number
    correctAnswers: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const completionPercentage = stats.totalChapters > 0
    ? Math.round((stats.completedChapters / stats.totalChapters) * 100)
    : 0

  const accuracyPercentage = stats.totalQuestions > 0
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Chapters Completed</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.completedChapters} / {stats.totalChapters}
            </p>
          </div>
          <div className="text-3xl">📚</div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{completionPercentage}% Complete</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Questions Answered</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalQuestions}</p>
          </div>
          <div className="text-3xl">❓</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Correct Answers</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.correctAnswers}
            </p>
          </div>
          <div className="text-3xl">✅</div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${accuracyPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{accuracyPercentage}% Accuracy</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Progress</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{completionPercentage}%</p>
          </div>
          <div className="text-3xl">📊</div>
        </div>
      </div>
    </div>
  )
}
