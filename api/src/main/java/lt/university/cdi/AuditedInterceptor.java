package lt.university.cdi;

import javax.annotation.Priority;
import javax.inject.Inject;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;

@Interceptor
@Audited
@Priority(Interceptor.Priority.APPLICATION + 10)
public class AuditedInterceptor {

    @Inject
    private AuditLog auditLog;

    @AroundInvoke
    public Object aroundInvoke(InvocationContext ctx) throws Exception {
        String method = ctx.getTarget().getClass().getSuperclass().getSimpleName()
                + "#" + ctx.getMethod().getName();
        long start = System.nanoTime();
        try {
            Object result = ctx.proceed();
            long ms = (System.nanoTime() - start) / 1_000_000;
            auditLog.record("interceptor", method + " ok in " + ms + "ms");
            return result;
        } catch (Exception e) {
            long ms = (System.nanoTime() - start) / 1_000_000;
            auditLog.record("interceptor", method + " threw " + e.getClass().getSimpleName() + " in " + ms + "ms");
            throw e;
        }
    }
}