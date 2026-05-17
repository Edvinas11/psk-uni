import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEvent, registerParticipant } from '../api/eventy'
import type { EventDto, RegisterParticipantDto } from '../types/api'

type RegistrationFields = keyof RegisterParticipantDto
type FieldErrors = Partial<Record<RegistrationFields, string>>

export interface UseRegistrationResult {
  event: EventDto | null
  formData: RegisterParticipantDto
  submitting: boolean
  error: string | null
  fieldErrors: FieldErrors
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: FormEvent) => Promise<void>
}

function validate(data: RegisterParticipantDto): FieldErrors {
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

export function useRegistration(eventId: string | undefined): UseRegistrationResult {
  const navigate = useNavigate()
  const [event, setEvent] = useState<EventDto | null>(null)
  const [formData, setFormData] = useState<RegisterParticipantDto>({
    firstName: '',
    lastName: '',
    email: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    if (!eventId) return
    getEvent(eventId)
      .then(setEvent)
      .catch(() => {})
  }, [eventId])

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name as RegistrationFields]) {
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

    if (!eventId) return
    setSubmitting(true)
    try {
      await registerParticipant(eventId, formData)
      navigate(`/events/${eventId}`, {
        state: { successMessage: 'You have been successfully registered!' },
      })
    } catch (err) {
      setError((err as Error).message)
      setSubmitting(false)
    }
  }

  return { event, formData, submitting, error, fieldErrors, handleChange, handleSubmit }
}
