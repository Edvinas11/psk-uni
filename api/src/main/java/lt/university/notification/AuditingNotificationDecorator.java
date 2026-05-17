package lt.university.notification;

import lt.university.cdi.AuditLog;

import javax.annotation.Priority;
import javax.decorator.Decorator;
import javax.decorator.Delegate;
import javax.enterprise.inject.Any;
import javax.inject.Inject;
import javax.interceptor.Interceptor;

/**
 * Decorator that wraps every {@link NotificationService} call with audit
 * bookkeeping. Enabled in {@code beans.xml} {@code <decorators>}.
 *
 * Required ingredients for a CDI decorator:
 *   1) {@code @Decorator} on the class
 *   2) implements the decorated interface
 *   3) {@code @Inject @Delegate @Any} field of the same interface
 *   4) listed in {@code beans.xml}.
 */
@Decorator
@Priority(Interceptor.Priority.APPLICATION)
public class AuditingNotificationDecorator implements NotificationService {

    @Inject
    @Any
    @Delegate
    private NotificationService delegate;

    @Inject
    private AuditLog auditLog;

    @Override
    public void send(Notification n) {
        auditLog.record("decorator", "before send -> " + n.getRecipient());
        delegate.send(n);
        auditLog.record("decorator", "after send -> " + n.getRecipient());
    }
}