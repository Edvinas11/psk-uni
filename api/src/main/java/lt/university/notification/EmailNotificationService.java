package lt.university.notification;

import lt.university.cdi.AuditLog;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

/**
 * Default {@link NotificationService} implementation. Pretends to send email by
 * recording into {@link AuditLog} so the demo UI can visualise it.
 */
@ApplicationScoped
public class EmailNotificationService implements NotificationService {

    @Inject
    protected AuditLog auditLog;

    @Override
    public void send(Notification n) {
        auditLog.record("email-impl", "EMAIL to " + n.getRecipient() + " subject='" + n.getSubject() + "'");
    }
}