import { Link } from 'react-router-dom'
import { useEventForm } from '../hooks/useEventForm'
import './CreateEventPage.css'

export default function CreateEventPage() {
  const {
    formData,
    categories,
    submitting,
    error,
    fieldErrors,
    newCategoryName,
    addingCategory,
    handleChange,
    handleCategoryToggle,
    handleAddCategory,
    handleSubmit,
    setNewCategoryName,
  } = useEventForm()

  return (
    <div className="create-event-page">
      <div className="back-link">
        <Link to="/">← Back to Events</Link>
      </div>

      <div className="create-event-card">
        <div className="create-event-header">
          <h1>Create New Event</h1>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Event Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tech Conference 2026"
              className={fieldErrors.name ? 'input-error' : ''}
              disabled={submitting}
            />
            {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="A brief description of the event..."
              rows={3}
              disabled={submitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventDate">Date</label>
              <input
                id="eventDate"
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxParticipants">Max Participants</label>
              <input
                id="maxParticipants"
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                placeholder="100"
                min="1"
                className={fieldErrors.maxParticipants ? 'input-error' : ''}
                disabled={submitting}
              />
              {fieldErrors.maxParticipants && (
                <span className="field-error">{fieldErrors.maxParticipants}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Vilnius, Lithuania"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Categories</label>
            {categories.length === 0 ? (
              <p className="no-categories-hint">No categories yet. Add one below.</p>
            ) : (
              <div className="category-checkboxes">
                {categories.map((cat) => (
                  <label key={cat.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                      disabled={submitting}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            )}

            <div className="add-category-row">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name..."
                disabled={addingCategory}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCategory(e)
                }}
              />
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleAddCategory}
                disabled={addingCategory || !newCategoryName.trim()}
              >
                {addingCategory ? '...' : '+ Add'}
              </button>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
