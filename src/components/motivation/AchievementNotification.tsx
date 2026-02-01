'use client'

import { useState, useEffect } from 'react'
import { FiX, FiStar } from 'react-icons/fi'

interface Achievement {
  code: string
  name: string
  description: string
  type: 'MEDAL' | 'TROPHY' | 'BADGE'
  tier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'
  icon: string
  pointsValue: number
}

interface AchievementNotificationProps {
  achievement: Achievement
  onClose: () => void
  autoCloseDelay?: number
}

const tierGradients = {
  BRONZE: 'from-amber-600 to-amber-800',
  SILVER: 'from-slate-400 to-slate-600',
  GOLD: 'from-yellow-400 to-amber-500',
  PLATINUM: 'from-cyan-300 to-blue-500',
  DIAMOND: 'from-violet-400 to-fuchsia-500',
}

export function AchievementNotification({ achievement, onClose, autoCloseDelay = 5000 }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const showTimer = setTimeout(() => setIsVisible(true), 100)

    // Auto close
    const closeTimer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 300)
    }, autoCloseDelay)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(closeTimer)
    }
  }, [autoCloseDelay, onClose])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 300)
  }

  const getBgGradient = () => {
    if (achievement.type === 'TROPHY') return 'from-yellow-500 via-amber-500 to-orange-500'
    if (achievement.type === 'MEDAL' && achievement.tier) return tierGradients[achievement.tier]
    return 'from-emerald-500 to-cyan-500'
  }

  return (
    <div
      className={`fixed top-4 right-4 z-[100] max-w-sm w-full transform transition-all duration-500 ${
        isVisible && !isExiting
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      {/* Main card */}
      <div className={`bg-gradient-to-r ${getBgGradient()} rounded-2xl p-1 shadow-2xl`}>
        <div className="bg-white rounded-xl p-4 relative overflow-hidden">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-4 h-4 text-gray-500" />
          </button>

          {/* Confetti effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#9B59B6', '#3498DB'][i % 5],
                }}
              />
            ))}
          </div>

          <div className="flex items-start gap-4 relative z-10">
            {/* Achievement icon */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getBgGradient()} flex items-center justify-center shadow-lg animate-bounce`}>
              <span className="text-4xl">{achievement.icon}</span>
            </div>

            <div className="flex-1 min-w-0">
              {/* Achievement type label */}
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  achievement.type === 'TROPHY' 
                    ? 'text-amber-600' 
                    : achievement.type === 'MEDAL'
                    ? 'text-gray-600'
                    : 'text-emerald-600'
                }`}>
                  {achievement.type === 'MEDAL' && achievement.tier 
                    ? `${achievement.tier} MEDAL` 
                    : achievement.type}
                </span>
                <FiStar className="w-3 h-3 text-yellow-500" />
              </div>

              {/* Name */}
              <h4 className="text-lg font-bold text-gray-900 truncate">
                {achievement.name}
              </h4>

              {/* Description */}
              <p className="text-sm text-gray-600 mt-0.5">
                {achievement.description}
              </p>

              {/* Points earned */}
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full">
                  ⚡ +{achievement.pointsValue} XP
                </span>
              </div>
            </div>
          </div>

          {/* Achievement unlocked text */}
          <div className="mt-3 pt-3 border-t border-gray-100 text-center">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              🎉 Achievement Unlocked!
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stack of notifications
interface NotificationQueueProps {
  achievements: Achievement[]
  onDismiss: (code: string) => void
}

export function AchievementNotificationQueue({ achievements, onDismiss }: NotificationQueueProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleClose = () => {
    if (achievements[currentIndex]) {
      onDismiss(achievements[currentIndex].code)
      setCurrentIndex(prev => prev + 1)
    }
  }

  if (currentIndex >= achievements.length) return null

  return (
    <AchievementNotification
      achievement={achievements[currentIndex]}
      onClose={handleClose}
      autoCloseDelay={4000}
    />
  )
}
