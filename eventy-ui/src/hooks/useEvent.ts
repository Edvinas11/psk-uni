import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEvent, deleteEvent } from '../api/eventy'
import type { EventDto } from '../types/api'

export interface UseEventResult {
  event: EventDto | null
  loading: boolean
  error: string | null
  handleDelete: () => void
}

export function useEvent(id: string | undefined): UseEventResult {
  const navigate = useNavigate()
  const [event, setEvent] = useState<EventDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getEvent(id)
      .then((data) => {
        setEvent(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  function handleDelete() {
    if (!window.confirm('Delete this event? This cannot be undone.')) return
    if (!id) return
    deleteEvent(id)
      .then(() => navigate('/'))
      .catch((err: Error) => alert('Failed to delete: ' + err.message))
  }

  return { event, loading, error, handleDelete }
}
