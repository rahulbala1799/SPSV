'use client'

import { useState, useEffect } from 'react'
import { 
  FiCheckCircle, 
  FiTrendingUp, 
  FiTarget, 
  FiClock, 
  FiBook, 
  FiAward,
  FiBarChart2,
  FiPlay,
  FiStar,
  FiFlag,
  FiRefreshCw,
  FiBookmark,
  FiUsers,
  FiMessageCircle
} from 'react-icons/fi'

// Mini Progress Ring Component
export function MiniProgressRing({ progress, size = 60, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 300)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-800">{animatedProgress}%</span>
      </div>
    </div>
  )
}

// Floating Stats Card
export function FloatingStatsCard() {
  const [stats, setStats] = useState({ questions: 0, accuracy: 0, streak: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        questions: Math.min(prev.questions + 3, 127),
        accuracy: Math.min(prev.accuracy + 2, 89),
        streak: Math.min(prev.streak + 1, 7)
      }))
    }, 100)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-gray-100 animate-float">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
          <FiBarChart2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Today&apos;s Stats</p>
          <p className="font-bold text-gray-900">Performance</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Questions</span>
          <span className="font-bold text-emerald-600">{stats.questions}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Accuracy</span>
          <span className="font-bold text-cyan-600">{stats.accuracy}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Streak</span>
          <span className="font-bold text-orange-500">{stats.streak} 🔥</span>
        </div>
      </div>
    </div>
  )
}

// Mini Quiz Preview
export function MiniQuizPreview() {
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const sequence = async () => {
      await new Promise(r => setTimeout(r, 1500))
      setSelected(1)
      await new Promise(r => setTimeout(r, 800))
      setShowResult(true)
      await new Promise(r => setTimeout(r, 2000))
      setSelected(null)
      setShowResult(false)
    }
    sequence()
    const interval = setInterval(sequence, 5000)
    return () => clearInterval(interval)
  }, [])

  const options = ['The Spire', 'Trinity College', 'Dublin Castle']
  const correctIndex = 0

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-gray-100 animate-float-delayed w-72">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
          <FiBook className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-gray-800 text-sm">Area Knowledge</span>
      </div>
      <p className="text-xs text-gray-700 mb-3 leading-relaxed">What landmark is located on O&apos;Connell Street?</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <div
            key={i}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
              selected === i
                ? showResult
                  ? i === correctIndex
                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500'
                    : 'bg-red-100 text-red-700 border-2 border-red-500'
                  : 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                : 'bg-gray-100 text-gray-700 border-2 border-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{opt}</span>
              {showResult && selected === i && i === correctIndex && (
                <FiCheckCircle className="w-4 h-4 text-emerald-500" />
              )}
            </div>
          </div>
        ))}
      </div>
      {showResult && (
        <div className="mt-3 p-2 bg-emerald-50 rounded-lg animate-fade-in">
          <p className="text-xs text-emerald-700">
            <span className="font-bold">✓ Correct!</span> The Spire is Dublin&apos;s iconic landmark.
          </p>
        </div>
      )}
    </div>
  )
}

// Chapter Progress Preview
export function ChapterProgressPreview() {
  const chapters = [
    { name: 'Industry Knowledge', progress: 100, icon: '📋' },
    { name: 'Dublin Routes', progress: 75, icon: '🗺️' },
    { name: 'One-Way Streets', progress: 45, icon: '🚦' },
    { name: 'Landmarks', progress: 20, icon: '🏛️' },
  ]

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-gray-100 animate-float w-80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <FiTrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-800 text-sm">Learning Path</span>
        </div>
        <span className="text-xs text-emerald-600 font-bold">65%</span>
      </div>
      <div className="space-y-3">
        {chapters.map((ch, i) => (
          <div key={i} className="group">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-2">
                <span>{ch.icon}</span>
                <span className="text-gray-700 font-medium">{ch.name}</span>
              </div>
              <span className="text-gray-500">{ch.progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-700"
                style={{ width: `${ch.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Flagged Questions Preview - NEW!
export function FlaggedQuestionsPreview() {
  const [flagCount, setFlagCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setFlagCount(prev => (prev < 5 ? prev + 1 : 5))
    }, 500)
    return () => clearInterval(timer)
  }, [])

  const flaggedQuestions = [
    { topic: 'Dublin Routes', difficulty: 'Hard' },
    { topic: 'One-Way Streets', difficulty: 'Medium' },
    { topic: 'Fare Calculation', difficulty: 'Hard' },
  ]

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-gray-100 animate-float w-72">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <FiFlag className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-800 text-sm">Flagged for Review</span>
        </div>
        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">{flagCount}</span>
      </div>
      <div className="space-y-2">
        {flaggedQuestions.map((q, i) => (
          <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-700">{q.topic}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${q.difficulty === 'Hard' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
              {q.difficulty}
            </span>
          </div>
        ))}
      </div>
      <button className="w-full mt-3 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-semibold rounded-lg">
        Review Flagged Questions
      </button>
    </div>
  )
}

// Practice Session Preview - NEW!
export function PracticeSessionPreview() {
  const [currentQ, setCurrentQ] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQ(prev => (prev < 25 ? prev + 1 : 1))
    }, 800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-gray-100 animate-float-delayed w-72">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <FiRefreshCw className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-800 text-sm">Practice Mode</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Question {currentQ} of 25</span>
          <span>{Math.round((currentQ / 25) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${(currentQ / 25) * 100}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium ${
              i < currentQ - 1
                ? i % 4 === 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                : i === currentQ - 1
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  )
}

// Spaced Repetition Preview - NEW!
export function SpacedRepetitionPreview() {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-5 text-white animate-float">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <FiRefreshCw className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-indigo-200">Smart Review</p>
          <p className="font-bold">Spaced Repetition</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-indigo-200">Due Today</span>
          <span className="font-bold">12 questions</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-indigo-200">Tomorrow</span>
          <span className="font-bold">8 questions</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-indigo-200">This Week</span>
          <span className="font-bold">34 questions</span>
        </div>
      </div>
    </div>
  )
}

// Classroom + App Combined Preview - NEW!
export function ClassroomAppPreview() {
  const [activeTab, setActiveTab] = useState<'class' | 'app'>('class')

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab(prev => prev === 'class' ? 'app' : 'class')
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-gray-100 animate-float w-80">
      <div className="flex gap-2 mb-4">
        <button
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'class' 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <FiUsers className="w-4 h-4 inline mr-1" />
          Classroom
        </button>
        <button
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'app' 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <FiBook className="w-4 h-4 inline mr-1" />
          App Practice
        </button>
      </div>
      {activeTab === 'class' ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
            <span className="text-2xl">👨‍🏫</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">Expert Instructors</p>
              <p className="text-xs text-gray-500">In-person guidance</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
            <span className="text-2xl">🗣️</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">Ask Questions</p>
              <p className="text-xs text-gray-500">Get instant answers</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-2xl">📱</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">Practice Anytime</p>
              <p className="text-xs text-gray-500">24/7 access on any device</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-2xl">📊</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">Track Progress</p>
              <p className="text-xs text-gray-500">See where you stand</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Achievement Badge Preview
export function AchievementPreview() {
  const [showBadge, setShowBadge] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowBadge(true)
      setTimeout(() => setShowBadge(false), 3000)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-2xl p-4 text-white transition-all duration-500 ${showBadge ? 'scale-110 animate-pulse' : ''} animate-float-delayed`}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <FiAward className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-amber-100">Achievement Unlocked!</p>
          <p className="font-bold">7-Day Streak 🔥</p>
        </div>
      </div>
    </div>
  )
}

// Timer Preview
export function TimerPreview() {
  const [time, setTime] = useState(2940) // 49 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => (prev > 0 ? prev - 1 : 2940))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const mins = Math.floor(time / 60)
  const secs = time % 60

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-gray-100 animate-float">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
          <FiClock className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Mock Test Timer</p>
          <p className="text-xl font-bold font-mono text-gray-900">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </p>
        </div>
      </div>
      <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all"
          style={{ width: `${(time / 2940) * 100}%` }}
        />
      </div>
    </div>
  )
}

// Score Card Preview
export function ScoreCardPreview() {
  return (
    <div className="bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-2xl shadow-2xl p-5 text-white animate-float-delayed">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-emerald-100">Test Complete!</p>
          <p className="text-3xl font-bold">92%</p>
        </div>
        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <FiStar className="w-7 h-7 text-yellow-300" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/10 rounded-lg p-2">
          <p className="text-lg font-bold">23/25</p>
          <p className="text-xs text-emerald-100">Correct</p>
        </div>
        <div className="bg-white/10 rounded-lg p-2">
          <p className="text-lg font-bold">18:32</p>
          <p className="text-xs text-emerald-100">Time</p>
        </div>
        <div className="bg-white/10 rounded-lg p-2">
          <p className="text-lg font-bold">A+</p>
          <p className="text-xs text-emerald-100">Grade</p>
        </div>
      </div>
    </div>
  )
}

// Main Feature Showcase Grid
export function FeatureShowcaseGrid() {
  return (
    <div className="relative w-full max-w-6xl mx-auto py-12">
      {/* Left Column */}
      <div className="absolute left-0 top-1/4 hidden lg:block">
        <FlaggedQuestionsPreview />
      </div>
      <div className="absolute left-12 bottom-0 hidden lg:block">
        <AchievementPreview />
      </div>

      {/* Center - Main App Preview */}
      <div className="flex justify-center mb-8 lg:mb-0">
        <div className="relative">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-3 shadow-2xl">
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-[2rem] overflow-hidden w-72 md:w-80">
              {/* Mock Phone Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    MS
                  </div>
                  <div>
                    <p className="font-bold text-sm">Michael&apos;s Dashboard</p>
                    <p className="text-xs text-emerald-100">SPSV Mastery</p>
                  </div>
                </div>
              </div>
              {/* Mock Content */}
              <div className="p-4 space-y-4">
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-800">Overall Progress</span>
                    <MiniProgressRing progress={65} size={50} strokeWidth={5} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-emerald-50 rounded-lg p-2">
                      <p className="text-lg font-bold text-emerald-600">12/18</p>
                      <p className="text-xs text-gray-500">Chapters</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-lg font-bold text-blue-600">89%</p>
                      <p className="text-xs text-gray-500">Accuracy</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2">
                      <p className="text-lg font-bold text-red-600">5</p>
                      <p className="text-xs text-gray-500">Flagged</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-3">
                  <p className="text-xs font-bold text-gray-800 mb-2">Continue Learning</p>
                  <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg p-3">
                    <span className="text-2xl">🗺️</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">Dublin Routes</p>
                      <div className="h-1.5 bg-gray-200 rounded-full mt-1">
                        <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
                      </div>
                    </div>
                    <FiPlay className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 rounded-[3rem] blur-2xl -z-10" />
        </div>
      </div>

      {/* Right Column */}
      <div className="absolute right-0 top-1/4 hidden lg:block">
        <PracticeSessionPreview />
      </div>
      <div className="absolute right-8 bottom-8 hidden lg:block">
        <TimerPreview />
      </div>

      {/* Mobile: Show cards in a grid */}
      <div className="grid grid-cols-2 gap-4 mt-8 lg:hidden px-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="scale-90 origin-center">
            <FlaggedQuestionsPreview />
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <div className="scale-90 origin-center">
            <TimerPreview />
          </div>
        </div>
      </div>
    </div>
  )
}
