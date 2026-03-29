import { useParams, Link } from 'react-router-dom'
import { useCourse } from '../hooks/useCourse'
import './CourseDetailPage.css'

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { course, loading, error, handleDelete } = useCourse(id)

  if (loading) return <div className="status-msg">Loading course...</div>
  if (error) return <div className="status-msg error">Error: {error}</div>
  if (!course) return <div className="status-msg">Course not found.</div>

  const spotsLeft =
    course.maxStudents != null ? course.maxStudents - course.studentCount : null

  return (
    <div className="course-detail-page">
      <div className="back-link">
        <Link to="/">← Back to Courses</Link>
      </div>

      <div className="course-detail-card">
        <div className="course-detail-header">
          <div>
            <h1 className="course-detail-title">{course.name}</h1>
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
          <div className="course-detail-actions">
            <Link to={`/courses/${id}/enroll`} className="btn btn-primary btn-lg">
              Enroll Now
            </Link>
            <Link to={`/courses/${id}/edit`} className="btn btn-outline btn-lg">
              Edit
            </Link>
            <button className="btn btn-danger btn-lg" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        <div className="course-detail-meta">
          {course.startDate && (
            <div className="meta-row">
              <span className="meta-label">Start Date</span>
              <span>
                {new Date(course.startDate).toLocaleDateString('lt-LT', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
          {course.room && (
            <div className="meta-row">
              <span className="meta-label">Room</span>
              <span>{course.room}</span>
            </div>
          )}
          <div className="meta-row">
            <span className="meta-label">Enrolled</span>
            <span>
              {course.studentCount}
              {course.maxStudents != null ? ` of ${course.maxStudents}` : ' students'}
              {spotsLeft !== null && (
                <span
                  className={`spots-badge ${spotsLeft <= 0 ? 'full' : spotsLeft <= 5 ? 'low' : 'ok'}`}
                >
                  {spotsLeft <= 0 ? 'Fully booked' : `${spotsLeft} spots left`}
                </span>
              )}
            </span>
          </div>
        </div>

        {course.description && (
          <div className="course-detail-description">
            <p>{course.description}</p>
          </div>
        )}
      </div>

      <div className="students-section">
        <h2>
          Enrolled Students
          <span className="student-count">{course.students.length}</span>
        </h2>

        {course.students.length === 0 ? (
          <div className="empty-students">
            <p>No students yet. Be the first to enroll!</p>
            <Link to={`/courses/${id}/enroll`} className="btn btn-primary">
              Enroll Now
            </Link>
          </div>
        ) : (
          <div className="students-table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {course.students.map((s, index) => (
                  <tr key={s.id}>
                    <td className="row-num">{index + 1}</td>
                    <td>{s.firstName}</td>
                    <td>{s.lastName}</td>
                    <td>{s.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
