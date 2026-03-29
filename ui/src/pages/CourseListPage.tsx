import { Link } from 'react-router-dom'
import { useCourses } from '../hooks/useCourses'
import type { CourseDto } from '../types/api'
import './CourseListPage.css'

export default function CourseListPage() {
  const { courses, loading, error, handleDelete } = useCourses()

  if (loading) return <div className="status-msg">Loading courses...</div>
  if (error) return <div className="status-msg error">Error: {error}</div>

  return (
    <div className="course-list-page">
      <div className="page-header">
        <h1>Available Courses</h1>
        <Link to="/courses/create" className="btn btn-primary">
          + Create Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <p>No courses yet.</p>
          <Link to="/courses/create">Create the first one!</Link>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

interface CourseCardProps {
  course: CourseDto
  onDelete: (id: number) => void
}

function CourseCard({ course, onDelete }: CourseCardProps) {
  return (
    <div className="course-card">
      <div className="course-card-header">
        <h2 className="course-title">
          <Link to={`/courses/${course.id}`}>{course.name}</Link>
        </h2>
        {course.departments.length > 0 && (
          <div className="course-departments">
            {course.departments.map((dep) => (
              <span key={dep.id} className="department-badge">
                {dep.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="course-card-body">
        {course.description && (
          <p className="course-description">{course.description}</p>
        )}
        <div className="course-meta">
          {course.startDate && (
            <span className="meta-item">
              {new Date(course.startDate).toLocaleDateString('lt-LT')}
            </span>
          )}
          {course.room && (
            <span className="meta-item">{course.room}</span>
          )}
          <span className="meta-item">
            {course.studentCount}
            {course.maxStudents != null ? ` / ${course.maxStudents}` : ''} enrolled
          </span>
        </div>
      </div>

      <div className="course-card-footer">
        <Link to={`/courses/${course.id}`} className="btn btn-outline">
          View Details
        </Link>
        <Link to={`/courses/${course.id}/enroll`} className="btn btn-primary">
          Enroll
        </Link>
        <Link to={`/courses/${course.id}/edit`} className="btn btn-outline">
          Edit
        </Link>
        <button className="btn btn-danger" onClick={() => onDelete(course.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}
