import { Link } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import type { EventDto } from '../types/api'
import './EventListPage.css'

export default function EventListPage() {
  const { events, loading, error, handleDelete } = useEvents()

  if (loading) return <div className="status-msg">Loading events...</div>
  if (error) return <div className="status-msg error">Error: {error}</div>

  return (
    <div className="event-list-page">
      <div className="page-header">
        <h1>Upcoming Events</h1>
        <Link to="/events/create" className="btn btn-primary">
          + Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>No events yet.</p>
          <Link to="/events/create">Create the first one!</Link>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

interface EventCardProps {
  event: EventDto
  onDelete: (id: number) => void
}

function EventCard({ event, onDelete }: EventCardProps) {
  return (
    <div className="event-card">
      <div className="event-card-header">
        <h2 className="event-title">
          <Link to={`/events/${event.id}`}>{event.name}</Link>
        </h2>
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

      <div className="event-card-body">
        {event.description && (
          <p className="event-description">{event.description}</p>
        )}
        <div className="event-meta">
          {event.eventDate && (
            <span className="meta-item">
              📅 {new Date(event.eventDate).toLocaleDateString('lt-LT')}
            </span>
          )}
          {event.location && (
            <span className="meta-item">📍 {event.location}</span>
          )}
          <span className="meta-item">
            👥 {event.participantCount}
            {event.maxParticipants != null ? ` / ${event.maxParticipants}` : ''} registered
          </span>
        </div>
      </div>

      <div className="event-card-footer">
        <Link to={`/events/${event.id}`} className="btn btn-outline">
          View Details
        </Link>
        <Link to={`/events/${event.id}/register`} className="btn btn-primary">
          Register
        </Link>
        <Link to={`/events/${event.id}/edit`} className="btn btn-outline">
          Edit
        </Link>
        <button className="btn btn-danger" onClick={() => onDelete(event.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}
