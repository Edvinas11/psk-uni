import { useAsyncTask } from '../hooks/useAsyncTask'

export default function AsyncTaskRunner() {
  const { task, starting, error, start } = useAsyncTask(1000)

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        background: '#fafafa',
        padding: 12,
        marginTop: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>Async long-running computation</h3>
        <button className="btn btn-outline btn-sm" onClick={() => void start()} disabled={starting}>
          {starting ? 'Starting...' : 'Demo: Run long task'}
        </button>
      </div>
      <p style={{ fontSize: 13, color: '#666', marginTop: 6 }}>
        Submits a job to <code>ManagedExecutorService</code>. The worker uses{' '}
        <code>EntityManagerFactory.createEntityManager()</code> — it cannot reuse the request EM nor
        join the caller&apos;s JTA tx (both are thread-bound and gone by the time the worker runs).
      </p>
      {error && <div style={{ color: '#a40000', fontSize: 13 }}>{error}</div>}
      {task && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 13 }}>
            <strong>Task:</strong> <code>{task.taskId}</code> — <strong>{task.status}</strong>
          </div>
          <div
            style={{
              marginTop: 6,
              height: 10,
              background: '#eee',
              borderRadius: 5,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${task.progress}%`,
                height: '100%',
                background: task.status === 'FAILED' ? '#a40000' : '#16691b',
                transition: 'width 0.3s',
              }}
            />
          </div>
          {task.result && (
            <p style={{ fontSize: 13, marginTop: 6 }}>
              <strong>Result:</strong> {task.result}
            </p>
          )}
          {task.error && (
            <p style={{ fontSize: 13, marginTop: 6, color: '#a40000' }}>
              <strong>Error:</strong> {task.error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
