import { useState, useEffect } from 'react'
import { getCategoryStats } from '../api/eventy'
import type { CategoryStatsDto } from '../types/api'

export interface UseCategoryStatsResult {
  stats: CategoryStatsDto[]
  loading: boolean
  error: string | null
}

export function useCategoryStats(): UseCategoryStatsResult {
  const [stats, setStats] = useState<CategoryStatsDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCategoryStats()
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { stats, loading, error }
}
