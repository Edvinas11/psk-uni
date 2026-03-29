import { useState, useEffect, useCallback } from 'react'
import { getCourses, deleteCourse } from '../api/university'
import type { CourseDto } from '../types/api'

export interface UseCoursesResult {
  courses: CourseDto[]
  loading: boolean
  error: string | null
  handleDelete: (id: number) => void
}

export function useCourses(): UseCoursesResult {
  const [courses, setCourses] = useState<CourseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCourses()
      .then((data) => {
        setCourses(data)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const handleDelete = useCallback(
    (id: number) => {
      if (!window.confirm('Delete this course?')) return
      deleteCourse(id)
        .then(() => setCourses((prev) => prev.filter((c) => c.id !== id)))
        .catch((err: Error) => alert('Failed to delete: ' + err.message))
    },
    [],
  )

  return { courses, loading, error, handleDelete }
}
