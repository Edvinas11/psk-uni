import { useEffect, useState } from 'react'
import { getNotificationImpl, sendDemoNotification } from '../api/university'
import type { NotificationImplDto } from '../types/api'
import AuditLogPanel from '../components/AuditLogPanel'

export default function DemoPage() {
  const [impl, setImpl] = useState<NotificationImplDto | null>(null)
  const [implError, setImplError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<string | null>(null)

  async function refresh() {
    try {
      setImpl(await getNotificationImpl())
      setImplError(null)
    } catch (err) {
      setImplError((err as Error).message)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function handleSend() {
    setSending(true)
    setSendStatus(null)
    try {
      await sendDemoNotification()
      setSendStatus('Notification fired. Watch the audit log for the decorator + interceptor entries.')
    } catch (err) {
      setSendStatus('Failed: ' + (err as Error).message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '16px 24px' }}>
      <h1>CDI glass-box demo</h1>
      <p style={{ color: '#444' }}>
        One <code>NotificationService</code> chain demonstrates four extension points.
        Toggle them by editing <code>api/src/main/resources/META-INF/beans.xml</code> and redeploying.
      </p>

      <section
        style={{
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 12,
          marginTop: 16,
          background: '#fafafa',
        }}
      >
        <h2 style={{ margin: '0 0 6px', fontSize: 18 }}>Active NotificationService implementation</h2>
        {implError && <div style={{ color: '#a40000' }}>{implError}</div>}
        {impl ? (
          <div>
            <code style={{ fontSize: 14 }}>{impl.className}</code>
            <p style={{ fontSize: 13, color: '#555', marginTop: 6 }}>
              With the default <code>beans.xml</code>, the active class is{' '}
              <code>LoggingEmailNotificationService</code> (from <code>@Specializes</code>). Uncomment the{' '}
              <code>&lt;alternatives&gt;</code> block to swap in <code>SmsNotificationService</code>.
            </p>
          </div>
        ) : (
          <p style={{ color: '#888' }}>Loading...</p>
        )}
        <button className="btn btn-outline btn-sm" onClick={() => void refresh()}>
          Refresh
        </button>
      </section>

      <section
        style={{
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 12,
          marginTop: 16,
          background: '#fafafa',
        }}
      >
        <h2 style={{ margin: '0 0 6px', fontSize: 18 }}>Trigger notification chain</h2>
        <p style={{ fontSize: 13, color: '#555' }}>
          Calling <code>POST /api/demo/notify</code> goes through the decorator
          (<code>AuditingNotificationDecorator</code>) and the active impl. The interceptor
          (<code>@Audited</code>) on <code>CoursesService</code> only fires for service methods —
          enroll a student on a course detail page to see it.
        </p>
        <button className="btn btn-primary btn-sm" onClick={() => void handleSend()} disabled={sending}>
          {sending ? 'Sending...' : 'Send sample notification'}
        </button>
        {sendStatus && <p style={{ fontSize: 13, marginTop: 6 }}>{sendStatus}</p>}
      </section>

      <AuditLogPanel title="Live audit log" />

      <section
        style={{
          marginTop: 24,
          padding: 12,
          border: '1px dashed #ccc',
          borderRadius: 8,
          background: '#fff',
          fontSize: 13,
          color: '#444',
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: 15 }}>What each entry source maps to</h3>
        <ul style={{ paddingLeft: 18, lineHeight: 1.6 }}>
          <li>
            <strong>interceptor</strong> — <code>@Audited AuditedInterceptor</code> wrapping
            <code> CoursesService</code> calls; enabled in <code>beans.xml</code> &lt;interceptors&gt;.
          </li>
          <li>
            <strong>decorator</strong> — <code>AuditingNotificationDecorator</code>; enabled in
            <code> beans.xml</code> &lt;decorators&gt;.
          </li>
          <li>
            <strong>email-impl</strong> / <strong>specialized-impl</strong> — base
            <code> EmailNotificationService</code> and the <code>@Specializes</code> subclass
            <code> LoggingEmailNotificationService</code>.
          </li>
          <li>
            <strong>sms-impl</strong> — only appears when the <code>@Alternative</code> is enabled
            in <code>beans.xml</code> &lt;alternatives&gt;.
          </li>
          <li>
            <strong>locking-demo</strong> — bookkeeping from the optimistic-locking demo on courses.
          </li>
          <li>
            <strong>async</strong> — long-running task lifecycle markers.
          </li>
        </ul>
      </section>
    </div>
  )
}
