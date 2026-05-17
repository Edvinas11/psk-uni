package lt.university.async;

import lt.university.cdi.AuditLog;

import javax.annotation.Resource;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;
import java.util.UUID;

/**
 * Submits a long-running task to a {@link ManagedExecutorService}. The worker
 * runs on a container-managed thread, NOT on the request thread, so two
 * questions from the spec apply directly:
 *
 *   Q: Can the async component join the caller's transaction?
 *   A: NO. JTA transactions are thread-bound. By the time the worker runs the
 *      caller's @Transactional method has already returned and the JTA tx is
 *      committed/closed. There is nothing to join. If the worker needs to
 *      write, it must start its own transaction (UserTransaction, or a
 *      @Transactional helper bean reached through CDI).
 *
 *   Q: Can the async component use a @RequestScoped EntityManager?
 *   A: NO. The request scope ends with the HTTP request. The
 *      {@code @PersistenceContext} EM produced by EntityManagerProducer is
 *      transaction-scoped and tied to the request thread. Touching it from
 *      the worker yields ContextNotActiveException or undefined behaviour.
 *      Use {@code EntityManagerFactory.createEntityManager()} (application
 *      managed) and close it in {@code finally}.
 */
@ApplicationScoped
public class LongComputationService {

    @Resource
    private ManagedExecutorService executor;

    @PersistenceUnit(unitName = "UniversityPU")
    private EntityManagerFactory emf;

    @Inject
    private TaskRegistry registry;

    @Inject
    private AuditLog auditLog;

    public TaskState start() {
        TaskState state = registry.create();
        UUID id = state.getId();
        auditLog.record("async", "task " + id + " queued");
        executor.submit(() -> compute(id));
        return state;
    }

    private void compute(UUID id) {
        registry.markRunning(id);
        EntityManager em = emf.createEntityManager();
        try {
            for (int i = 1; i <= 10; i++) {
                Thread.sleep(500);
                registry.setProgress(id, i * 10);
            }
            Long participants = em.createQuery("SELECT COUNT(p) FROM Student p", Long.class)
                    .getSingleResult();
            Long events = em.createQuery("SELECT COUNT(e) FROM Course e", Long.class)
                    .getSingleResult();
            String result = "Aggregate snapshot: events=" + events + ", participants=" + participants;
            registry.complete(id, result);
            auditLog.record("async", "task " + id + " done");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            registry.fail(id, "interrupted");
            auditLog.record("async", "task " + id + " interrupted");
        } catch (Exception e) {
            registry.fail(id, e.getClass().getSimpleName() + ": " + e.getMessage());
            auditLog.record("async", "task " + id + " failed: " + e.getMessage());
        } finally {
            em.close();
        }
    }
}