package lt.university.notification;

import lt.university.cdi.AuditLog;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Alternative;
import javax.inject.Inject;

/**
 * Swappable replacement for {@link EmailNotificationService}. Activated by listing
 * this class in {@code beans.xml} {@code <alternatives>} — a CDI alternative is
 * disabled by default and only takes effect when explicitly selected.
 */
@Alternative
@ApplicationScoped
public class SmsNotificationService implements NotificationService {

    @Inject
    private AuditLog auditLog;

    @Override
    public void send(Notification n) {
        auditLog.record("sms-impl", "SMS to " + n.getRecipient() + " body='" + n.getBody() + "'");
    }
}