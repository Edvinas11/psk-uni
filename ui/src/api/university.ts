import type {
  AsyncTaskDto,
  AuditEntryDto,
  CreateCourseDto,
  CourseDto,
  DepartmentDto,
  DepartmentPayload,
  DepartmentStatsDto,
  EnrollStudentDto,
  ForceSaveCourseDto,
  NotificationImplDto,
  OptimisticLockDemoResultDto,
  UpdateCourseDto,
} from '../types/api'
import { CourseConflictError } from '../types/api'

const BASE_URL = '/api'

interface RequestOpts extends RequestInit {
  rawError?: (response: Response) => Promise<Error | undefined>
}

async function request<T>(path: string, options: RequestOpts = {}): Promise<T> {
  const { rawError, ...init } = options
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      credentials: 'include',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...init.headers,
    },
    ...init,
  })

  if (!response.ok) {
    if (rawError) {
      const customised = await rawError(response.clone())
      if (customised) throw customised
    }
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
  return request<CourseDto>(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    rawError: async (resp) => {
      if (resp.status !== 409) return undefined
      try {
        const body = (await resp.json()) as { currentVersion: number | null }
        return new CourseConflictError(body.currentVersion ?? null)
      } catch {
        return new CourseConflictError(null)
      }
    },
  })
}

export function deleteCourse(id: number | string): Promise<null> {
  return request<null>(`/courses/${id}`, { method: 'DELETE' })
}

export function enrollStudent(courseId: number | string, data: EnrollStudentDto): Promise<void> {
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

export function updateDepartment(
  id: number | string,
  data: DepartmentPayload,
): Promise<DepartmentDto> {
  return request<DepartmentDto>(`/departments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteDepartment(id: number | string): Promise<null> {
  return request<null>(`/departments/${id}`, { method: 'DELETE' })
}

export function getDepartmentStats(): Promise<DepartmentStatsDto[]> {
  return request<DepartmentStatsDto[]>('/departments/stats')
}

export function triggerOptimisticLock(
  courseId: number | string,
): Promise<OptimisticLockDemoResultDto> {
  return request<OptimisticLockDemoResultDto>(`/demo/optimistic-lock/${courseId}`, {
    method: 'POST',
  })
}

export function forceSaveCourse(
  courseId: number | string,
  data: ForceSaveCourseDto,
): Promise<OptimisticLockDemoResultDto> {
  return request<OptimisticLockDemoResultDto>(`/demo/force-save/${courseId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function startAsyncTask(): Promise<AsyncTaskDto> {
  return request<AsyncTaskDto>('/async/compute', { method: 'POST' })
}

export function getAsyncTask(taskId: string): Promise<AsyncTaskDto> {
  return request<AsyncTaskDto>(`/async/compute/${taskId}`)
}

export function getNotificationImpl(): Promise<NotificationImplDto> {
  return request<NotificationImplDto>('/demo/notification-impl')
}

export function sendDemoNotification(): Promise<{ sent: boolean }> {
  return request<{ sent: boolean }>('/demo/notify', { method: 'POST' })
}

export function getAuditLog(since: number = 0): Promise<AuditEntryDto[]> {
  return request<AuditEntryDto[]>(`/demo/audit?since=${since}`)
}
