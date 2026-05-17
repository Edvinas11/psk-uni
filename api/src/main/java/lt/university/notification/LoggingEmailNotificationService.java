package lt.university.notification;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Specializes;

/**
 * {@code @Specializes} replaces the parent bean at runtime — every injection
 * point declared as {@link EmailNotificationService} (or its supertypes) gets
 * this subclass instead. Same scope and qualifiers as the parent are required.
 */
@Specializes
@ApplicationScoped
public class LoggingEmailNotificationService extends EmailNotificationService {

    @Override
    public void send(Notification n) {
        auditLog.record("specialized-impl", "[specialized] preparing message for " + n.getRecipient());
        super.send(n);
    }
}