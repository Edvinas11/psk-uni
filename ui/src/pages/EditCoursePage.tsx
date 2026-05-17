import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCourseForm } from '../hooks/useCourseForm'
import { triggerOptimisticLock, forceSaveCourse } from '../api/university'
import './CreateCoursePage.css'

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>()
  const {
    formData,
    departments,
    loading,
    submitting,
    error,
    conflict,
    fieldErrors,
    newDepartmentName,
    addingDepartment,
    buildForceSavePayload,
    handleChange,
    handleDepartmentToggle,
    handleAddDepartment,
    handleSubmit,
    setNewDepartmentName,
    setVersion,
    refetch,
    clearConflict,
  } = useCourseForm(id)

  const [demoBusy, setDemoBusy] = useState(false)
  const [demoMessage, setDemoMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  async function handleTriggerOLE() {
    if (!id) return
    setDemoBusy(true)
    setDemoMessage(null)
    try {
      const result = await triggerOptimisticLock(id)
      if (result.outcome === 'OPTIMISTIC_LOCK') {
        setDemoMessage({
          kind: 'err',
          text: `OptimisticLockException thrown. Stale version was ${result.staleVersion}, DB current version ${result.currentVersion}. The JTA tx was rolled back; recovery requires a fresh EM + new tx.`,
        })
      } else {
        setDemoMessage({ kind: 'err', text: result.message ?? `Outcome: ${result.outcome}` })
      }
      await refetch()
    } catch (err) {
      setDemoMessage({ kind: 'err', text: (err as Error).message })
    } finally {
      setDemoBusy(false)
    }
  }

  async function handleForceSave() {
    if (!id) return
    setDemoBusy(true)
    setDemoMessage(null)
    try {
      const result = await forceSaveCourse(id, buildForceSavePayload())
      setDemoMessage({
        kind: 'ok',
        text: `Force-saved on a fresh EntityManager + new JTA transaction. New version: ${result.currentVersion}.`,
      })
      setVersion(result.currentVersion ?? null)
      clearConflict()
    } catch (err) {
      setDemoMessage({ kind: 'err', text: (err as Error).message })
    } finally {
      setDemoBusy(false)
    }
  }

  if (loading) return <div className="status-msg">Loading course...</div>

  return (
    <div className="create-course-page">
      <div className="back-link">
        <Link to={`/courses/${id}`}>← Back to Course</Link>
      </div>

      <div className="create-course-card">
        <div className="create-course-header">
          <h1>Edit Course</h1>
          {formData.version != null && (
            <span style={{ color: '#888', fontSize: 13 }}>
              Form version: <code>{formData.version}</code>
            </span>
          )}
        </div>

        {error && <div className="form-error-banner">{error}</div>}
        {conflict && (
          <div
            className="form-error-banner"
            style={{ background: '#ffe6e6', color: '#a40000', borderColor: '#a40000' }}
          >
            <strong>409 Conflict:</strong> the course was changed by someone else (server version{' '}
            <code>{conflict.currentVersion ?? '?'}</code>, your form had{' '}
            <code>{formData.version ?? '?'}</code>). Click <em>Force Save</em> to overwrite using a
            fresh EM + new JTA transaction, or reload the page to keep their changes.
          </div>
        )}
        {demoMessage && (
          <div
            className="form-error-banner"
            style={{
              background: demoMessage.kind === 'ok' ? '#e6f8ec' : '#fff3e6',
              color: demoMessage.kind === 'ok' ? '#0a5b1f' : '#8b3a00',
              borderColor: demoMessage.kind === 'ok' ? '#0a5b1f' : '#8b3a00',
            }}
          >
            {demoMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Course Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
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
              rows={3}
              disabled={submitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Date</label>
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
                placeholder="100"
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
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Departments</label>
            {departments.length === 0 ? (
              <p className="no-departments-hint">No departments yet. Add one below.</p>
            ) : (
              <div className="department-checkboxes">
                {departments.map((cat) => (
                  <label key={cat.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.departmentIds.includes(cat.id)}
                      onChange={() => handleDepartmentToggle(cat.id)}
                      disabled={submitting}
                    />
                    {cat.name}
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

          <div className="form-actions" style={{ gap: 8, flexWrap: 'wrap' }}>
            <Link to={`/courses/${id}`} className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleTriggerOLE}
              disabled={demoBusy}
              title="Server-side simulates a concurrent update so JPA throws OptimisticLockException"
            >
              {demoBusy ? '...' : 'Demo: trigger OLE'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleForceSave}
              disabled={demoBusy}
              title="Recovery: fresh EM + new JTA tx, ignores stale version"
            >
              {demoBusy ? '...' : 'Force Save (recovery)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
