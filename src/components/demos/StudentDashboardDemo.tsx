'use client'

import { useState } from 'react'
import { FiBook, FiClock, FiTrendingUp, FiTarget, FiCheckCircle, FiAward, FiZap } from 'react-icons/fi'

export function StudentDashboardDemo() {
  const [selectedChapter, setSelectedChapter] = useState(0)

  const demoChapters = [
    {
      title: 'Industry Knowledge Part 1',
      progress: 100,
      questionsAnswered: 45,
      accuracy: 92,
      timeSpent: '2h 15m',
      status: 'completed',
      icon: '📋',
    },
    {
      title: 'Industry Knowledge Part 2',
      progress: 75,
      questionsAnswered: 32,
      accuracy: 88,
      timeSpent: '1h 45m',
      status: 'in-progress',
      icon: '📖',
    },
    {
      title: 'Dublin Routes & Navigation',
      progress: 45,
      questionsAnswered: 18,
      accuracy: 85,
      timeSpent: '58m',
      status: 'in-progress',
      icon: '🗺️',
    },
    {
      title: 'Dublin One-Way Streets',
      progress: 0,
      questionsAnswered: 0,
      accuracy: 0,
      timeSpent: '0m',
      status: 'not-started',
      icon: '🚦',
    },
  ]

  const stats = {
    totalProgress: 65,
    studyTime: '4h 58m',
    questionsAnswered: 95,
    averageAccuracy: 88,
    streak: 7,
  }

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl overflow-hidden border-4 border-emerald-500/20">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
            MS
          </div>
          <div>
            <h3 className="text-2xl font-bold">Welcome back, Michael!</h3>
            <p className="text-emerald-100">Let&apos;s continue your learning journey</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <FiTarget className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalProgress}%</div>
            <div className="text-xs text-emerald-100">Overall Progress</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <FiClock className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.studyTime}</div>
            <div className="text-xs text-emerald-100">Study Time</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <FiCheckCircle className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.questionsAnswered}</div>
            <div className="text-xs text-emerald-100">Questions Done</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <FiTrendingUp className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.averageAccuracy}%</div>
            <div className="text-xs text-emerald-100">Accuracy</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <FiZap className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.streak} Days</div>
            <div className="text-xs text-emerald-100">Streak 🔥</div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-8">
        <div className="mb-6">
          <h4 className="text-2xl font-bold text-gray-900 mb-2">Your Learning Path</h4>
          <p className="text-gray-600">Track your progress across all chapters</p>
        </div>

        <div className="space-y-4">
          {demoChapters.map((chapter, index) => (
            <div
              key={index}
              onClick={() => setSelectedChapter(index)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                selectedChapter === index
                  ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-cyan-50 shadow-lg scale-[1.02]'
                  : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="text-4xl">{chapter.icon}</div>

                {/* Chapter Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5 className="text-lg font-bold text-gray-900">{chapter.title}</h5>
                    {chapter.status === 'completed' && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <FiCheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                    {chapter.status === 'in-progress' && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        In Progress
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span className="font-bold">{chapter.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                        style={{ width: `${chapter.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiCheckCircle className="w-4 h-4" />
                      <span>{chapter.questionsAnswered} questions</span>
                    </div>
                    {chapter.accuracy > 0 && (
                      <div className="flex items-center gap-1">
                        <FiTarget className="w-4 h-4" />
                        <span>{chapter.accuracy}% accuracy</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      <span>{chapter.timeSpent}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    chapter.status === 'completed'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : chapter.status === 'in-progress'
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {chapter.status === 'completed'
                    ? 'Review'
                    : chapter.status === 'in-progress'
                    ? 'Continue'
                    : 'Start'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white">
          <div className="flex items-center gap-4">
            <FiAward className="w-12 h-12" />
            <div className="flex-1">
              <h5 className="text-xl font-bold mb-1">You&apos;re on fire! 🔥</h5>
              <p className="text-amber-100">
                7-day learning streak! Keep it up to unlock the &quot;Dedicated Learner&quot; badge
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
