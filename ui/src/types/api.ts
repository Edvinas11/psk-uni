export interface DepartmentDto {
  id: number
  name: string
}

export interface StudentDto {
  id: number
  firstName: string
  lastName: string
  email: string
  courseId: number
}

export interface CourseDto {
  id: number
  name: string
  description: string | null
  startDate: string | null
  room: string | null
  maxStudents: number | null
  version: number | null
  studentCount: number
  departments: DepartmentDto[]
  students: StudentDto[]
}

export interface CreateCourseDto {
  name: string
  description: string | null
  startDate: string | null
  room: string | null
  maxStudents: number | null
  departmentIds: number[]
}

export type UpdateCourseDto = CreateCourseDto

/** POST /api/demo/force-save/{id} body */
export interface ForceSaveCourseDto {
  name: string
  description: string | null
  startDate: string | null
  room: string | null
  maxStudents: number | null
}

export interface EnrollStudentDto {
  firstName: string
  lastName: string
  email: string
}

export interface DepartmentPayload {
  name: string
}

export interface DepartmentStatsDto {
  id: number
  name: string
  courseCount: number
  students: StudentDto[]
}

export interface AsyncTaskDto {
  taskId: string
  status: 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED'
  progress: number
  result: string | null
  error: string | null
  createdAt: string
  finishedAt: string | null
}

export interface AuditEntryDto {
  seq: number
  at: string
  source: string
  message: string
}

export interface OptimisticLockDemoResultDto {
  outcome: string
  staleVersion: number | null
  currentVersion: number | null
  message: string
}

export interface NotificationImplDto {
  className: string
  simpleName: string
}

export class CourseConflictError extends Error {
  currentVersion: number | null
  constructor(currentVersion: number | null) {
    super('Stale course version')
    this.name = 'CourseConflictError'
    this.currentVersion = currentVersion
  }
}
