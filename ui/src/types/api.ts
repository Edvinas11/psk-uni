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
