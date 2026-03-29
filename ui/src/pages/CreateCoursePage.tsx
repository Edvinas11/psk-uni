import { Link } from 'react-router-dom'
import { useCourseForm } from '../hooks/useCourseForm'
import './CreateCoursePage.css'

export default function CreateCoursePage() {
  const {
    formData,
    departments,
    submitting,
    error,
    fieldErrors,
    newDepartmentName,
    addingDepartment,
    handleChange,
    handleDepartmentToggle,
    handleAddDepartment,
    handleSubmit,
    setNewDepartmentName,
  } = useCourseForm()

  return (
    <div className="create-course-page">
      <div className="back-link">
        <Link to="/">← Back to Courses</Link>
      </div>

      <div className="create-course-card">
        <div className="create-course-header">
          <h1>Create New Course</h1>
        </div>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Course Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Introduction to Computer Science"
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
              placeholder="A brief description of the course..."
              rows={3}
              disabled={submitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxStudents">Max Students</label>
              <input
                id="maxStudents"
                type="number"
                name="maxStudents"
                value={formData.maxStudents}
                onChange={handleChange}
                placeholder="30"
                min="1"
                className={fieldErrors.maxStudents ? 'input-error' : ''}
                disabled={submitting}
              />
              {fieldErrors.maxStudents && (
                <span className="field-error">{fieldErrors.maxStudents}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="room">Room</label>
            <input
              id="room"
              type="text"
              name="room"
              value={formData.room}
              onChange={handleChange}
              placeholder="Room 101, Building A"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Departments</label>
            {departments.length === 0 ? (
              <p className="no-departments-hint">No departments yet. Add one below.</p>
            ) : (
              <div className="department-checkboxes">
                {departments.map((dep) => (
                  <label key={dep.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.departmentIds.includes(dep.id)}
                      onChange={() => handleDepartmentToggle(dep.id)}
                      disabled={submitting}
                    />
                    {dep.name}
                  </label>
                ))}
              </div>
            )}

            <div className="add-department-row">
              <input
                type="text"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                placeholder="New department name..."
                disabled={addingDepartment}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddDepartment(e)
                }}
              />
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleAddDepartment}
                disabled={addingDepartment || !newDepartmentName.trim()}
              >
                {addingDepartment ? '...' : '+ Add'}
              </button>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
