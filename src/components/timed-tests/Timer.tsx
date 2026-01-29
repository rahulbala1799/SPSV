'use client'

import { useEffect, useState } from 'react'

interface TimerProps {
  timeRemaining: number // in seconds
  onExpire: () => void
  onWarning?: (minutes: number) => void
  paused?: boolean // Whether timer is paused
}

export default function Timer({ timeRemaining, onExpire, onWarning, paused = false }: TimerProps) {
  const [time, setTime] = useState(timeRemaining)
  const [warningsShown, setWarningsShown] = useState<Set<number>>(new Set())

  useEffect(() => {
    setTime(timeRemaining)
  }, [timeRemaining])

  useEffect(() => {
    if (paused) {
      return // Don't run timer when paused
    }

    if (time <= 0) {
      onExpire()
      return
    }

    const interval = setInterval(() => {
      setTime(prev => {
        const newTime = prev - 1
        
        // Show warnings
        if (onWarning) {
          if (newTime === 30 * 60 && !warningsShown.has(30)) {
            onWarning(30)
            setWarningsShown(prev => new Set(prev).add(30))
          } else if (newTime === 10 * 60 && !warningsShown.has(10)) {
            onWarning(10)
            setWarningsShown(prev => new Set(prev).add(10))
          } else if (newTime === 5 * 60 && !warningsShown.has(5)) {
            onWarning(5)
            setWarningsShown(prev => new Set(prev).add(5))
          } else if (newTime === 60 && !warningsShown.has(1)) {
            onWarning(1)
            setWarningsShown(prev => new Set(prev).add(1))
          }
        }
        
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [time, onExpire, onWarning, warningsShown, paused])

  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  const totalMinutes = Math.floor(time / 60)

  let colorClass = 'text-green-600'
  if (totalMinutes < 5) colorClass = 'text-red-600 animate-pulse'
  else if (totalMinutes < 10) colorClass = 'text-red-600'
  else if (totalMinutes < 30) colorClass = 'text-yellow-600'

  return (
    <div className="flex items-center gap-2">
      <div className={`text-2xl font-mono font-bold ${colorClass}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      {paused && (
        <span className="text-sm text-gray-500 font-medium">(Paused)</span>
      )}
    </div>
  )
}
