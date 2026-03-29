import { useState, useEffect } from 'react'
import { getDepartmentStats } from '../api/university'
import type { DepartmentStatsDto } from '../types/api'

export interface UseDepartmentStatsResult {
  stats: DepartmentStatsDto[]
  loading: boolean
  error: string | null
}

export function useDepartmentStats(): UseDepartmentStatsResult {
  const [stats, setStats] = useState<DepartmentStatsDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDepartmentStats()
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
