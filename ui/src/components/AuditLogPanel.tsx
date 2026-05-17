import { useAuditLog } from '../hooks/useAuditLog'

interface Props {
  title?: string
  compact?: boolean
  intervalMs?: number
}

const SOURCE_COLORS: Record<string, string> = {
  interceptor: '#0a5b8a',
  decorator: '#7d28a8',
  'email-impl': '#0a5b1f',
  'specialized-impl': '#16691b',
  'sms-impl': '#a86c00',
  'locking-demo': '#a40000',
  async: '#5a3da0',
}

export default function AuditLogPanel({
  title = 'Server activity',
  compact = false,
  intervalMs = 2000,
}: Props) {
  const { entries, error } = useAuditLog(intervalMs)

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        background: '#fafafa',
        padding: 12,
        marginTop: compact ? 12 : 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, fontSize: compact ? 14 : 16 }}>{title}</h3>
        <span style={{ fontSize: 12, color: '#666' }}>polling every {intervalMs}ms</span>
      </div>
      {error && <div style={{ color: '#a40000', fontSize: 13, marginTop: 6 }}>{error}</div>}
      {entries.length === 0 ? (
        <p style={{ color: '#888', fontSize: 13, margin: '8px 0 0' }}>
          No activity yet. Trigger something below.
        </p>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '8px 0 0',
            maxHeight: compact ? 180 : 320,
            overflowY: 'auto',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 12,
          }}
        >
          {entries.map((e) => (
            <li
              key={e.seq}
              style={{
                padding: '4px 6px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                gap: 8,
                alignItems: 'baseline',
              }}
            >
              <span style={{ color: '#999', minWidth: 70 }}>
                {new Date(e.at).toLocaleTimeString()}
              </span>
              <span
                style={{
                  color: SOURCE_COLORS[e.source] ?? '#333',
                  fontWeight: 600,
                  minWidth: 110,
                }}
              >
                {e.source}
              </span>
              <span>{e.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
