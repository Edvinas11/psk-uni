import { useDepartmentStats } from '../hooks/useDepartmentStats'
import './DepartmentStatsPage.css'

export default function DepartmentStatsPage() {
  const { stats, loading, error } = useDepartmentStats()

  if (loading) return <div className="status-msg">Loading department stats...</div>
  if (error) return <div className="status-msg error">Error: {error}</div>

  return (
    <div className="department-stats-page">
      <div className="page-header">
        <h1>Department Student Counts</h1>
      </div>

      {stats.length === 0 ? (
        <div className="empty-state">
          <p>No departments found.</p>
        </div>
      ) : (
        <table className="stats-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Total Courses</th>
              <th>Total Students</th>
              <th>Students</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td className="count-cell">{row.courseCount}</td>
                <td className="count-cell">{row.students.length}</td>
                <td>
                  {row.students.length === 0 ? (
                    <span className="no-students">—</span>
                  ) : (
                    <ul className="student-list">
                      {row.students.slice(0, 3).map((s) => (
                        <li key={s.id}>
                          {s.firstName} {s.lastName}
                          <span className="student-email"> ({s.email})</span>
                        </li>
                      ))}
                      {row.students.length > 3 && (
                        <li className="students-more">
                          +{row.students.length - 3} more
                        </li>
                      )}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
