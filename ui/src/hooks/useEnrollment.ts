import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCourse, enrollStudent } from '../api/university'
import type { CourseDto, EnrollStudentDto } from '../types/api'

type EnrollmentFields = keyof EnrollStudentDto
type FieldErrors = Partial<Record<EnrollmentFields, string>>

export interface UseEnrollmentResult {
  course: CourseDto | null
  formData: EnrollStudentDto
  submitting: boolean
  error: string | null
  fieldErrors: FieldErrors
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: FormEvent) => Promise<void>
}

function validate(data: EnrollStudentDto): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.firstName.trim()) errors.firstName = 'First name is required'
  if (!data.lastName.trim()) errors.lastName = 'Last name is required'
  if (!data.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address'
  }
  return errors
}

export function useEnrollment(courseId: string | undefined): UseEnrollmentResult {
  const navigate = useNavigate()
  const [course, setCourse] = useState<CourseDto | null>(null)
  const [formData, setFormData] = useState<EnrollStudentDto>({
    firstName: '',
    lastName: '',
    email: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    if (!courseId) return
    getCourse(courseId)
      .then(setCourse)
      .catch(() => {})
  }, [courseId])

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name as EnrollmentFields]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const errors = validate(formData)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    if (!courseId) return
    setSubmitting(true)
    try {
      await enrollStudent(courseId, formData)
      navigate(`/courses/${courseId}`, {
        state: { successMessage: 'You have been successfully enrolled!' },
      })
    } catch (err) {
      setError((err as Error).message)
      setSubmitting(false)
    }
  }

  return { course, formData, submitting, error, fieldErrors, handleChange, handleSubmit }
}
