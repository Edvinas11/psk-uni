/**
 * API contract types — derived from the Java DTO classes in api/src/main/java/lt/eventy/rest/contracts/
 */

/** Mirrors CategoryDto.java */
export interface CategoryDto {
  id: number
  name: string
}

/** Mirrors ParticipantDto.java */
export interface ParticipantDto {
  id: number
  firstName: string
  lastName: string
  email: string
  eventId: number
}

/**
 * Mirrors EventDto.java.
 * participants is only populated on the detail endpoint (GET /events/:id).
 * version is a Long server-side; carried through PUT for optimistic locking.
 */
export interface EventDto {
  id: number
  name: string
  description: string | null
  eventDate: string | null
  location: string | null
  maxParticipants: number | null
  version: number | null
  participantCount: number
  categories: CategoryDto[]
  participants: ParticipantDto[]
}

/** Mirrors CreateEventDto.java — used for POST /events */
export interface CreateEventDto {
  name: string
  description: string | null
  eventDate: string | null
  location: string | null
  maxParticipants: number | null
  categoryIds: number[]
}

/** Mirrors UpdateEventDto.java — used for PUT /events/:id and force-save */
export interface UpdateEventDto extends CreateEventDto {
  version: number | null
}

/** POST /events/:id/register body */
export interface RegisterParticipantDto {
  firstName: string
  lastName: string
  email: string
}

/** POST /categories and PUT /categories/:id body */
export interface CategoryPayload {
  name: string
}

/** Mirrors CategoryStatsDto.java — returned by GET /categories/stats */
export interface CategoryStatsDto {
  id: number
  name: string
  participants: ParticipantDto[]
}

/** Mirrors AsyncTaskDto.java */
export interface AsyncTaskDto {
  taskId: string
  status: 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED'
  progress: number
  result: string | null
  error: string | null
  createdAt: string
  finishedAt: string | null
}

/** Mirrors AuditEntryDto.java */
export interface AuditEntryDto {
  seq: number
  at: string
  source: string
  message: string
}

/** Mirrors OptimisticLockDemoResultDto.java */
export interface OptimisticLockDemoResultDto {
  outcome: string
  staleVersion: number | null
  currentVersion: number | null
  message: string
}

/** /api/demo/notification-impl response */
export interface NotificationImplDto {
  className: string
  simpleName: string
}

/** Thrown by updateEvent on HTTP 409 (stale version). */
export class EventConflictError extends Error {
  currentVersion: number | null
  constructor(currentVersion: number | null) {
    super('Stale event version')
    this.name = 'EventConflictError'
    this.currentVersion = currentVersion
  }
}
