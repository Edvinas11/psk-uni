import type {
  DepartmentDto,
  DepartmentPayload,
  DepartmentStatsDto,
  CreateCourseDto,
  CourseDto,
  EnrollStudentDto,
  UpdateCourseDto,
} from '../types/api'

const BASE_URL = '/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      credentials: 'include',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`
    try {
      const errorBody = (await response.json()) as { error?: string }
      errorMessage = errorBody.error ?? errorMessage
    } catch {
      // response body is not JSON
    }
    throw new Error(errorMessage)
  }

  if (response.status === 204) return null as T

  return response.json() as Promise<T>
}

export function getCourses(): Promise<CourseDto[]> {
  return request<CourseDto[]>('/courses')
}

export function getCourse(id: number | string): Promise<CourseDto> {
  return request<CourseDto>(`/courses/${id}`)
}

export function createCourse(data: CreateCourseDto): Promise<CourseDto> {
  return request<CourseDto>('/courses', { method: 'POST', body: JSON.stringify(data) })
}

export function updateCourse(id: number | string, data: UpdateCourseDto): Promise<CourseDto> {
  return request<CourseDto>(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteCourse(id: number | string): Promise<null> {
  return request<null>(`/courses/${id}`, { method: 'DELETE' })
}

export function enrollStudent(
  courseId: number | string,
  data: EnrollStudentDto,
): Promise<void> {
  return request<void>(`/courses/${courseId}/enroll`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getDepartments(): Promise<DepartmentDto[]> {
  return request<DepartmentDto[]>('/departments')
}

export function createDepartment(data: DepartmentPayload): Promise<DepartmentDto> {
  return request<DepartmentDto>('/departments', { method: 'POST', body: JSON.stringify(data) })
}

export function updateDepartment(id: number | string, data: DepartmentPayload): Promise<DepartmentDto> {
  return request<DepartmentDto>(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteDepartment(id: number | string): Promise<null> {
  return request<null>(`/departments/${id}`, { method: 'DELETE' })
}

export function getDepartmentStats(): Promise<DepartmentStatsDto[]> {
  return request<DepartmentStatsDto[]>('/departments/stats')
}
