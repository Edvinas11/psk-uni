import { useParams, Link } from 'react-router-dom'
import { useEvent } from '../hooks/useEvent'
import AsyncTaskRunner from '../components/AsyncTaskRunner'
import AuditLogPanel from '../components/AuditLogPanel'
import './EventDetailPage.css'

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { event, loading, error, handleDelete } = useEvent(id)

  if (loading) return <div className="status-msg">Loading event...</div>
  if (error) return <div className="status-msg error">Error: {error}</div>
  if (!event) return <div className="status-msg">Event not found.</div>

  const spotsLeft =
    event.maxParticipants != null ? event.maxParticipants - event.participantCount : null

  return (
    <div className="event-detail-page">
      <div className="back-link">
        <Link to="/">← Back to Events</Link>
      </div>

      <div className="event-detail-card">
        <div className="event-detail-header">
          <div>
            <h1 className="event-detail-title">{event.name}</h1>
            {event.categories.length > 0 && (
              <div className="event-categories">
                {event.categories.map((cat) => (
                  <span key={cat.id} className="category-badge">
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="event-detail-actions">
            <Link to={`/events/${id}/register`} className="btn btn-primary btn-lg">
              Register Now
            </Link>
            <Link to={`/events/${id}/edit`} className="btn btn-outline btn-lg">
              Edit
            </Link>
            <button className="btn btn-danger btn-lg" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        <div className="event-detail-meta">
          {event.eventDate && (
            <div className="meta-row">
              <span className="meta-label">Date</span>
              <span>
                {new Date(event.eventDate).toLocaleDateString('lt-LT', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
          {event.location && (
            <div className="meta-row">
              <span className="meta-label">Location</span>
              <span>{event.location}</span>
            </div>
          )}
          <div className="meta-row">
            <span className="meta-label">Registered</span>
            <span>
              {event.participantCount}
              {event.maxParticipants != null ? ` of ${event.maxParticipants}` : ' participants'}
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

        {event.description && (
          <div className="event-detail-description">
            <p>{event.description}</p>
          </div>
        )}
      </div>

      <div className="participants-section">
        <h2>
          Registered Participants
          <span className="participant-count">{event.participants.length}</span>
        </h2>

        {event.participants.length === 0 ? (
          <div className="empty-participants">
            <p>No participants yet. Be the first to register!</p>
            <Link to={`/events/${id}/register`} className="btn btn-primary">
              Register Now
            </Link>
          </div>
        ) : (
          <div className="participants-table-wrapper">
            <table className="participants-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {event.participants.map((p, index) => (
                  <tr key={p.id}>
                    <td className="row-num">{index + 1}</td>
                    <td>{p.firstName}</td>
                    <td>{p.lastName}</td>
                    <td>{p.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AsyncTaskRunner />
      <AuditLogPanel title="Server activity (audit log)" compact />
    </div>
  )
}
