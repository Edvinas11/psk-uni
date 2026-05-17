import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getCourse,
  getDepartments,
  createCourse,
  updateCourse,
  createDepartment,
} from '../api/university'
import type { DepartmentDto, CreateCourseDto, ForceSaveCourseDto } from '../types/api'
import { CourseConflictError } from '../types/api'

export interface CourseFormData {
  name: string
  description: string
  startDate: string
  room: string
  maxStudents: string
  departmentIds: number[]
  version: number | null
}

type FieldErrors = Partial<Record<keyof CourseFormData, string>>

const EMPTY_FORM: CourseFormData = {
  name: '',
  description: '',
  startDate: '',
  room: '',
  maxStudents: '',
  departmentIds: [],
  version: null,
}

export interface ConflictInfo {
  currentVersion: number | null
}

export interface UseCourseFormResult {
  formData: CourseFormData
  departments: DepartmentDto[]
  loading: boolean
  submitting: boolean
  error: string | null
  conflict: ConflictInfo | null
  fieldErrors: FieldErrors
  newDepartmentName: string
  addingDepartment: boolean
  buildForceSavePayload: () => ForceSaveCourseDto
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleDepartmentToggle: (departmentId: number) => void
  handleAddDepartment: (e: FormEvent) => Promise<void>
  handleSubmit: (e: FormEvent) => Promise<void>
  setNewDepartmentName: (value: string) => void
  setVersion: (version: number | null) => void
  refetch: () => Promise<void>
  clearConflict: () => void
}

function validate(formData: CourseFormData): FieldErrors {
  const errors: FieldErrors = {}
  if (!formData.name.trim()) errors.name = 'Course name is required'
  if (formData.maxStudents && Number(formData.maxStudents) < 1) {
    errors.maxStudents = 'Must be at least 1'
  }
  return errors
}

export function useCourseForm(courseId?: string): UseCourseFormResult {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState<DepartmentDto[]>([])
  const [formData, setFormData] = useState<CourseFormData>(EMPTY_FORM)
  const [loading, setLoading] = useState(!!courseId)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conflict, setConflict] = useState<ConflictInfo | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [newDepartmentName, setNewDepartmentName] = useState('')
  const [addingDepartment, setAddingDepartment] = useState(false)

  async function loadFromServer() {
    if (!courseId) return
    setLoading(true)
    try {
      const [course, deps] = await Promise.all([getCourse(courseId), getDepartments()])
      setFormData({
        name: course.name ?? '',
        description: course.description ?? '',
        startDate: course.startDate ?? '',
        room: course.room ?? '',
        maxStudents: course.maxStudents != null ? String(course.maxStudents) : '',
        departmentIds: (course.departments ?? []).map((d) => d.id),
        version: course.version ?? null,
      })
      setDepartments(deps)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (courseId) {
      void loadFromServer()
    } else {
      getDepartments()
        .then(setDepartments)
        .catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name as keyof CourseFormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleDepartmentToggle(departmentId: number) {
    setFormData((prev) => ({
      ...prev,
      departmentIds: prev.departmentIds.includes(departmentId)
        ? prev.departmentIds.filter((id) => id !== departmentId)
        : [...prev.departmentIds, departmentId],
    }))
  }

  async function handleAddDepartment(e: FormEvent) {
    e.preventDefault()
    if (!newDepartmentName.trim()) return
    setAddingDepartment(true)
    try {
      const created = await createDepartment({ name: newDepartmentName.trim() })
      setDepartments((prev) => [...prev, created])
      setNewDepartmentName('')
    } catch (err) {
      alert('Failed to create department: ' + (err as Error).message)
    } finally {
      setAddingDepartment(false)
    }
  }

  function buildForceSavePayload(): ForceSaveCourseDto {
    return {
      name: formData.name,
      description: formData.description || null,
      maxStudents: formData.maxStudents ? Number(formData.maxStudents) : null,
      startDate: formData.startDate || null,
      room: formData.room || null,
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

    const payload: CreateCourseDto = {
      name: formData.name,
      description: formData.description || null,
      maxStudents: formData.maxStudents ? Number(formData.maxStudents) : null,
      startDate: formData.startDate || null,
      room: formData.room || null,
      departmentIds: formData.departmentIds,
    }

    setSubmitting(true)
    try {
      if (courseId) {
        const saved = await updateCourse(courseId, payload)
        setVersion(saved.version ?? null)
        navigate(`/courses/${courseId}`)
      } else {
        const created = await createCourse(payload)
        navigate(`/courses/${created.id}`)
      }
    } catch (err) {
      if (err instanceof CourseConflictError) {
        setConflict({ currentVersion: err.currentVersion })
      } else {
        setError((err as Error).message)
      }
      setSubmitting(false)
    }
  }

  return {
    formData,
    departments,
    loading,
    submitting,
    error,
    conflict,
    fieldErrors,
    newDepartmentName,
    addingDepartment,
    buildForceSavePayload,
    handleChange,
    handleDepartmentToggle,
    handleAddDepartment,
    handleSubmit,
    setNewDepartmentName,
    setVersion,
    refetch: loadFromServer,
    clearConflict,
  }
}
