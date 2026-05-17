import { useState, useEffect, useCallback } from 'react'
import { getEvents, deleteEvent } from '../api/eventy'
import type { EventDto } from '../types/api'

export interface UseEventsResult {
  events: EventDto[]
  loading: boolean
  error: string | null
  handleDelete: (id: number) => void
}

export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<EventDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getEvents()
      .then((data) => {
        setEvents(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const handleDelete = useCallback(
    (id: number) => {
      if (!window.confirm('Delete this event?')) return
      deleteEvent(id)
        .then(() => setEvents((prev) => prev.filter((e) => e.id !== id)))
        .catch((err: Error) => alert('Failed to delete: ' + err.message))
    },
    [],
  )

  return { events, loading, error, handleDelete }
}
