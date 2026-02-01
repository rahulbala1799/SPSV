'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiLock, FiCheck, FiAward } from 'react-icons/fi'
import { MedalsDisplay, TrophyShowcase, LevelProgress } from '@/components/motivation'

interface Achievement {
  id: string
  code: string
  name: string
  description: string
  type: 'MEDAL' | 'TROPHY' | 'BADGE'
  tier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'
  icon: string
  earnedAt?: string
  isNew?: boolean
  pointsValue: number
}

interface AchievementsData {
  points: {
    total: number
    level: number
    levelTitle: string
    currentXP: number
    nextLevelXP: number
    progress: number
    currentStreak: number
    longestStreak: number
  }
  achievements: {
    all: Achievement[]
    medals: Achievement[]
    trophies: Achievement[]
    badges: Achievement[]
    locked: Achievement[]
    totalEarned: number
    totalAvailable: number
  }
}

export default function AchievementsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AchievementsData | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'medals' | 'trophies' | 'badges'>('all')

  useEffect(() => {
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

        // Fetch achievements
        const achievementsResponse = await fetch('/api/student/achievements')
        if (achievementsResponse.ok) {
          const achievementsData = await achievementsResponse.json()
          setData(achievementsData)
        } else {
          // Trigger backfill if needed
          await fetch('/api/student/achievements/backfill', { method: 'POST' })
          const achievementsResponse2 = await fetch('/api/student/achievements')
          if (achievementsResponse2.ok) {
            const achievementsData = await achievementsResponse2.json()
            setData(achievementsData)
          }
        }

        setLoading(false)
      } catch (error) {
        console.error('Error:', error)
        router.push('/login')
      }
    }

    checkAccessAndLoad()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading achievements...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const displayAchievements = activeTab === 'all' 
    ? data.achievements.all 
    : activeTab === 'medals'
    ? data.achievements.medals
    : activeTab === 'trophies'
    ? data.achievements.trophies
    : data.achievements.badges

  const earnedCodes = new Set(data.achievements.all.map(a => a.code))
  const lockedToShow = data.achievements.locked.filter(a => {
    if (activeTab === 'medals') return a.type === 'MEDAL'
    if (activeTab === 'trophies') return a.type === 'TROPHY'
    if (activeTab === 'badges') return a.type === 'BADGE'
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center gap-4 max-w-7xl mx-auto">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FiArrowLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Achievements</h1>
              <p className="text-xs text-gray-500">{data.achievements.totalEarned} of {data.achievements.totalAvailable} unlocked</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-7xl mx-auto pb-24">
        {/* Level Progress */}
        <div className="mb-6">
          <LevelProgress 
            totalPoints={data.points.total} 
            currentStreak={data.points.currentStreak}
          />
        </div>

        {/* Trophy Showcase */}
        {data.achievements.trophies.length > 0 && (
          <div className="mb-6">
            <TrophyShowcase 
              earnedTrophies={data.achievements.trophies.map(t => ({
                id: t.id,
                code: t.code,
                name: t.name,
                description: t.description,
                icon: t.icon,
                earnedAt: t.earnedAt || new Date().toISOString(),
                isNew: t.isNew,
                pointsValue: t.pointsValue
              }))}
              allTrophies={data.achievements.locked.filter(a => a.type === 'TROPHY').map(t => ({
                code: t.code,
                name: t.name,
                description: t.description,
                icon: t.icon
              }))}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All ({data.achievements.totalEarned})
            </button>
            <button
              onClick={() => setActiveTab('medals')}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === 'medals'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🏅 Medals ({data.achievements.medals.length})
            </button>
            <button
              onClick={() => setActiveTab('trophies')}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === 'trophies'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🏆 Trophies ({data.achievements.trophies.length})
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === 'badges'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🎯 Badges ({data.achievements.badges.length})
            </button>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Earned Achievements */}
          {displayAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1 relative"
            >
              {achievement.isNew && (
                <div className="absolute -top-1 -right-1 z-10">
                  <span className="flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] font-bold items-center justify-center">
                      !
                    </span>
                  </span>
                </div>
              )}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">{achievement.icon}</span>
                </div>
                <h4 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2">{achievement.name}</h4>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{achievement.description}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 font-semibold">
                  <FiCheck className="w-3 h-3" />
                  <span>Earned</span>
                </div>
              </div>
            </div>
          ))}

          {/* Locked Achievements */}
          {lockedToShow.map((achievement) => (
            <div
              key={achievement.code}
              className="bg-gray-50 rounded-2xl shadow-lg p-4 border border-gray-200 opacity-60 relative"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <FiLock className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center relative z-0">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-200 rounded-2xl flex items-center justify-center opacity-50">
                  <span className="text-4xl">{achievement.icon}</span>
                </div>
                <h4 className="font-bold text-sm text-gray-500 mb-1 line-clamp-2">{achievement.name}</h4>
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">{achievement.description}</p>
                <div className="text-xs text-gray-400 font-medium">Locked</div>
              </div>
            </div>
          ))}
        </div>

        {displayAchievements.length === 0 && lockedToShow.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAward className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No achievements in this category yet</p>
          </div>
        )}
      </main>
    </div>
  )
}
