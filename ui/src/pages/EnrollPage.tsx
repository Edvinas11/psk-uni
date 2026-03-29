import { useParams, Link } from 'react-router-dom'
import { useEnrollment } from '../hooks/useEnrollment'
import './EnrollPage.css'

export default function EnrollPage() {
  const { id } = useParams<{ id: string }>()
  const { course, formData, submitting, error, fieldErrors, handleChange, handleSubmit } =
    useEnrollment(id)

  return (
    <div className="enroll-page">
      <div className="back-link">
        <Link to={`/courses/${id}`}>← Back to Course</Link>
      </div>

      <div className="enroll-card">
        <div className="enroll-header">
          <h1>Enroll in Course</h1>
          {course && <p className="course-name-subtitle">{course.name}</p>}
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Jonas"
              className={fieldErrors.firstName ? 'input-error' : ''}
              disabled={submitting}
            />
            {fieldErrors.firstName && (
              <span className="field-error">{fieldErrors.firstName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Jonaitis"
              className={fieldErrors.lastName ? 'input-error' : ''}
              disabled={submitting}
            />
            {fieldErrors.lastName && (
              <span className="field-error">{fieldErrors.lastName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jonas@university.lt"
              className={fieldErrors.email ? 'input-error' : ''}
              disabled={submitting}
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          <div className="form-actions">
            <Link to={`/courses/${id}`} className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Enrolling...' : 'Enroll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
