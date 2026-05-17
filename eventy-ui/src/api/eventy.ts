import {
  AsyncTaskDto,
  AuditEntryDto,
  CategoryDto,
  CategoryPayload,
  CategoryStatsDto,
  CreateEventDto,
  EventConflictError,
  EventDto,
  NotificationImplDto,
  OptimisticLockDemoResultDto,
  RegisterParticipantDto,
  UpdateEventDto,
} from '../types/api'

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

// ---- Events API ----

export function getEvents(): Promise<EventDto[]> {
  return request<EventDto[]>('/events')
}

export function getEvent(id: number | string): Promise<EventDto> {
  return request<EventDto>(`/events/${id}`)
}

export function createEvent(data: CreateEventDto): Promise<EventDto> {
  return request<EventDto>('/events', { method: 'POST', body: JSON.stringify(data) })
}

export function updateEvent(id: number | string, data: UpdateEventDto): Promise<EventDto> {
  return request<EventDto>(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    rawError: async (resp) => {
      if (resp.status !== 409) return undefined
      try {
        const body = (await resp.json()) as { currentVersion: number | null }
        return new EventConflictError(body.currentVersion ?? null)
      } catch {
        return new EventConflictError(null)
      }
    },
  })
}

export function deleteEvent(id: number | string): Promise<null> {
  return request<null>(`/events/${id}`, { method: 'DELETE' })
}

export function registerParticipant(
  eventId: number | string,
  data: RegisterParticipantDto,
): Promise<void> {
  return request<void>(`/events/${eventId}/register`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ---- Categories API ----

export function getCategories(): Promise<CategoryDto[]> {
  return request<CategoryDto[]>('/categories')
}

export function createCategory(data: CategoryPayload): Promise<CategoryDto> {
  return request<CategoryDto>('/categories', { method: 'POST', body: JSON.stringify(data) })
}

export function updateCategory(id: number | string, data: CategoryPayload): Promise<CategoryDto> {
  return request<CategoryDto>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteCategory(id: number | string): Promise<null> {
  return request<null>(`/categories/${id}`, { method: 'DELETE' })
}

export function getCategoryStats(): Promise<CategoryStatsDto[]> {
  return request<CategoryStatsDto[]>('/categories/stats')
}

// ---- Demo / lab APIs ----

export function triggerOptimisticLock(
  eventId: number | string,
): Promise<OptimisticLockDemoResultDto> {
  return request<OptimisticLockDemoResultDto>(`/demo/optimistic-lock/${eventId}`, {
    method: 'POST',
  })
}

export function forceSaveEvent(
  eventId: number | string,
  data: UpdateEventDto,
): Promise<OptimisticLockDemoResultDto> {
  return request<OptimisticLockDemoResultDto>(`/demo/force-save/${eventId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function startAsyncTask(): Promise<AsyncTaskDto> {
  return request<AsyncTaskDto>(`/async/compute`, { method: 'POST' })
}

export function getAsyncTask(taskId: string): Promise<AsyncTaskDto> {
  return request<AsyncTaskDto>(`/async/compute/${taskId}`)
}

export function getNotificationImpl(): Promise<NotificationImplDto> {
  return request<NotificationImplDto>(`/demo/notification-impl`)
}

export function sendDemoNotification(): Promise<{ sent: boolean }> {
  return request<{ sent: boolean }>(`/demo/notify`, { method: 'POST' })
}

export function getAuditLog(since: number = 0): Promise<AuditEntryDto[]> {
  return request<AuditEntryDto[]>(`/demo/audit?since=${since}`)
}
