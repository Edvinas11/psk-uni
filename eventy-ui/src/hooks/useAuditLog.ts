import { useEffect, useRef, useState } from 'react'
import { getAuditLog } from '../api/eventy'
import type { AuditEntryDto } from '../types/api'

export function useAuditLog(intervalMs: number = 2000): {
  entries: AuditEntryDto[]
  error: string | null
} {
  const [entries, setEntries] = useState<AuditEntryDto[]>([])
  const [error, setError] = useState<string | null>(null)
  const sinceRef = useRef<number>(0)

  useEffect(() => {
    let cancelled = false

    async function poll() {
      try {
        const fresh = await getAuditLog(sinceRef.current)
        if (cancelled) return
        if (fresh.length > 0) {
          sinceRef.current = Math.max(sinceRef.current, ...fresh.map((e) => e.seq))
          setEntries((prev) => [...fresh, ...prev].slice(0, 100))
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message)
      }
    }

    void poll()
    const handle = window.setInterval(poll, intervalMs)
    return () => {
      cancelled = true
      window.clearInterval(handle)
    }
  }, [intervalMs])

  return { entries, error }
}
