import { useEffect, useRef, useState } from 'react'
import { getAsyncTask, startAsyncTask } from '../api/eventy'
import type { AsyncTaskDto } from '../types/api'

interface UseAsyncTaskResult {
  task: AsyncTaskDto | null
  starting: boolean
  error: string | null
  start: () => Promise<void>
}

export function useAsyncTask(pollIntervalMs: number = 1000): UseAsyncTaskResult {
  const [task, setTask] = useState<AsyncTaskDto | null>(null)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pollHandle = useRef<number | null>(null)

  function clearPoll() {
    if (pollHandle.current != null) {
      window.clearInterval(pollHandle.current)
      pollHandle.current = null
    }
  }

  useEffect(() => clearPoll, [])

  async function start() {
    setStarting(true)
    setError(null)
    try {
      const initial = await startAsyncTask()
      setTask(initial)
      clearPoll()
      pollHandle.current = window.setInterval(async () => {
        try {
          const next = await getAsyncTask(initial.taskId)
          setTask(next)
          if (next.status === 'DONE' || next.status === 'FAILED') {
            clearPoll()
          }
        } catch (err) {
          setError((err as Error).message)
          clearPoll()
        }
      }, pollIntervalMs)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setStarting(false)
    }
  }

  return { task, starting, error, start }
}
