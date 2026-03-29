import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCourse, deleteCourse } from '../api/university'
import type { CourseDto } from '../types/api'

export interface UseCourseResult {
  course: CourseDto | null
  loading: boolean
  error: string | null
  handleDelete: () => void
}

export function useCourse(id: string | undefined): UseCourseResult {
  const navigate = useNavigate()
  const [course, setCourse] = useState<CourseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getCourse(id)
      .then((data) => {
        setCourse(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  function handleDelete() {
    if (!window.confirm('Delete this course? This cannot be undone.')) return
    if (!id) return
    deleteCourse(id)
      .then(() => navigate('/'))
      .catch((err: Error) => alert('Failed to delete: ' + err.message))
  }

  return { course, loading, error, handleDelete }
}
