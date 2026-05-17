import { useCategoryStats } from '../hooks/useCategoryStats'
import './CategoryStatsPage.css'

export default function CategoryStatsPage() {
  const { stats, loading, error } = useCategoryStats()

  if (loading) return <div className="status-msg">Loading category stats...</div>
  if (error) return <div className="status-msg error">Error: {error}</div>

  return (
    <div className="category-stats-page">
      <div className="page-header">
        <h1>Category Participant Counts</h1>
      </div>

      {stats.length === 0 ? (
        <div className="empty-state">
          <p>No categories found.</p>
        </div>
      ) : (
        <table className="stats-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Participants</th>
              <th>Participants</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td className="count-cell">{row.participants.length}</td>
                <td>
                  {row.participants.length === 0 ? (
                    <span className="no-participants">—</span>
                  ) : (
                    <ul className="participant-list">
                      {row.participants.slice(0, 3).map((p) => (
                        <li key={p.id}>
                          {p.firstName} {p.lastName}
                          <span className="participant-email"> ({p.email})</span>
                        </li>
                      ))}
                      {row.participants.length > 3 && (
                        <li className="participants-more">
                          +{row.participants.length - 3} more
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
