import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEvent, getCategories, createEvent, updateEvent, createCategory } from '../api/eventy'
import type { CategoryDto, CreateEventDto, UpdateEventDto } from '../types/api'
import { EventConflictError } from '../types/api'

export interface EventFormData {
  name: string
  description: string
  eventDate: string
  location: string
  maxParticipants: string
  categoryIds: number[]
  version: number | null
}

type FieldErrors = Partial<Record<keyof EventFormData, string>>

const EMPTY_FORM: EventFormData = {
  name: '',
  description: '',
  eventDate: '',
  location: '',
  maxParticipants: '',
  categoryIds: [],
  version: null,
}

export interface ConflictInfo {
  currentVersion: number | null
}

export interface UseEventFormResult {
  formData: EventFormData
  categories: CategoryDto[]
  loading: boolean
  submitting: boolean
  error: string | null
  conflict: ConflictInfo | null
  fieldErrors: FieldErrors
  newCategoryName: string
  addingCategory: boolean
  buildPayload: () => UpdateEventDto
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleCategoryToggle: (categoryId: number) => void
  handleAddCategory: (e: FormEvent) => Promise<void>
  handleSubmit: (e: FormEvent) => Promise<void>
  setNewCategoryName: (value: string) => void
  setVersion: (version: number | null) => void
  refetch: () => Promise<void>
  clearConflict: () => void
}

function validate(formData: EventFormData): FieldErrors {
  const errors: FieldErrors = {}
  if (!formData.name.trim()) errors.name = 'Event name is required'
  if (formData.maxParticipants && Number(formData.maxParticipants) < 1) {
    errors.maxParticipants = 'Must be at least 1'
  }
  return errors
}

export function useEventForm(eventId?: string): UseEventFormResult {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [formData, setFormData] = useState<EventFormData>(EMPTY_FORM)
  const [loading, setLoading] = useState(!!eventId)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conflict, setConflict] = useState<ConflictInfo | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [newCategoryName, setNewCategoryName] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)

  async function loadFromServer() {
    if (!eventId) return
    setLoading(true)
    try {
      const [event, cats] = await Promise.all([getEvent(eventId), getCategories()])
      setFormData({
        name: event.name ?? '',
        description: event.description ?? '',
        eventDate: event.eventDate ?? '',
        location: event.location ?? '',
        maxParticipants: event.maxParticipants != null ? String(event.maxParticipants) : '',
        categoryIds: (event.categories ?? []).map((c) => c.id),
        version: event.version ?? null,
      })
      setCategories(cats)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (eventId) {
      void loadFromServer()
    } else {
      getCategories().then(setCategories).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name as keyof EventFormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleCategoryToggle(categoryId: number) {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }))
  }

  async function handleAddCategory(e: FormEvent) {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    setAddingCategory(true)
    try {
      const created = await createCategory({ name: newCategoryName.trim() })
      setCategories((prev) => [...prev, created])
      setNewCategoryName('')
    } catch (err) {
      alert('Failed to create category: ' + (err as Error).message)
    } finally {
      setAddingCategory(false)
    }
  }

  function buildPayload(): UpdateEventDto {
    return {
      name: formData.name,
      description: formData.description || null,
      maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : null,
      eventDate: formData.eventDate || null,
      location: formData.location || null,
      categoryIds: formData.categoryIds,
      version: formData.version,
    }
  }

  function setVersion(version: number | null) {
    setFormData((prev) => ({ ...prev, version }))
  }

  function clearConflict() {
    setConflict(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setConflict(null)

    const errors = validate(formData)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    const payload = buildPayload()

    setSubmitting(true)
    try {
      if (eventId) {
        const saved = await updateEvent(eventId, payload)
        setVersion(saved.version ?? null)
        navigate(`/events/${eventId}`)
      } else {
        const created = await createEvent(payload as CreateEventDto)
        navigate(`/events/${created.id}`)
      }
    } catch (err) {
      if (err instanceof EventConflictError) {
        setConflict({ currentVersion: err.currentVersion })
      } else {
        setError((err as Error).message)
      }
      setSubmitting(false)
    }
  }

  return {
    formData,
    categories,
    loading,
    submitting,
    error,
    conflict,
    fieldErrors,
    newCategoryName,
    addingCategory,
    buildPayload,
    handleChange,
    handleCategoryToggle,
    handleAddCategory,
    handleSubmit,
    setNewCategoryName,
    setVersion,
    refetch: loadFromServer,
    clearConflict,
  }
}
