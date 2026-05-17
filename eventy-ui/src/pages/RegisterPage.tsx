import { useParams, Link } from 'react-router-dom'
import { useRegistration } from '../hooks/useRegistration'
import './RegisterPage.css'

export default function RegisterPage() {
  const { id } = useParams<{ id: string }>()
  const { event, formData, submitting, error, fieldErrors, handleChange, handleSubmit } =
    useRegistration(id)

  return (
    <div className="register-page">
      <div className="back-link">
        <Link to={`/events/${id}`}>← Back to Event</Link>
      </div>

      <div className="register-card">
        <div className="register-header">
          <h1>Register for Event</h1>
          {event && <p className="event-name-subtitle">{event.name}</p>}
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
              placeholder="jonas@example.com"
              className={fieldErrors.email ? 'input-error' : ''}
              disabled={submitting}
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          <div className="form-actions">
            <Link to={`/events/${id}`} className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
