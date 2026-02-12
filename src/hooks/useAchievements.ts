'use client'

import { useState, useEffect, useCallback } from 'react'

const CACHE_TTL_MS = 60 * 1000 // 1 minute

let cache: { data: any; ts: number } | null = null

async function fetchAchievements(): Promise<any> {
  const res = await fetch('/api/student/achievements')
  if (res.ok) {
    return res.json()
  }
  // If no achievements yet, try backfill then refetch
  if (res.status === 404 || res.status === 500) {
    const backfill = await fetch('/api/student/achievements/backfill', { method: 'POST' })
    if (backfill.ok) {
      const retry = await fetch('/api/student/achievements')
      if (retry.ok) return retry.json()
    }
  }
  return null
}

export function useAchievements() {
  const [data, setData] = useState<any>(cache?.data ?? null)
  const [loading, setLoading] = useState(!cache || Date.now() - cache.ts > CACHE_TTL_MS)

  const mutate = useCallback(async () => {
    const json = await fetchAchievements()
    if (json) {
      cache = { data: json, ts: Date.now() }
      setData(json)
    }
    setLoading(false)
    return json
  }, [])

  useEffect(() => {
    if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
      setData(cache.data)
      setLoading(false)
      return
    }
    mutate()
  }, [mutate])

  return { data, loading, mutate }
}
