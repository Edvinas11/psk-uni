package lt.university.locking;

import lt.university.cdi.AuditLog;
import lt.university.entities.Course;
import lt.university.rest.contracts.OptimisticLockDemoResultDto;

import javax.annotation.Resource;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.OptimisticLockException;
import javax.persistence.PersistenceUnit;
import javax.transaction.UserTransaction;
import java.time.LocalDate;

/**
 * Demonstrates {@link OptimisticLockException} and the proper way to recover
 * from one. The class deliberately does NOT use the container-managed
 * {@code @PersistenceContext} EntityManager — see comments below.
 *
 * Key facts surfaced by this service:
 *
 *   1. When the JPA provider detects a stale {@code @Version}, it throws
 *      OptimisticLockException. In a JTA environment that marks the current
 *      transaction rollback-only and ends it.
 *
 *   2. The transaction-scoped @PersistenceContext EM is detached/cleared on
 *      rollback. Any further work on it throws
 *      TransactionRequiredException or behaves nondeterministically.
 *
 *   3. To save the entity AFTER the OLE you need (a) a fresh
 *      {@link EntityManager} obtained from {@link EntityManagerFactory} and
 *      (b) a brand new JTA transaction. The application-managed EM must be
 *      closed in {@code finally}.
 */
@ApplicationScoped
public class LockingDemoService {

    @PersistenceUnit(unitName = "UniversityPU")
    private EntityManagerFactory emf;

    @Resource
    private UserTransaction utx;

    @Inject
    private AuditLog auditLog;

    /**
     * Reproduces the classic "lost update" race server-side so the demo button
     * can trigger a real OLE in one click:
     *   1) Read the course, capture its version V.
     *   2) Bump the row out-of-band (native UPDATE) so DB is now at V+1.
     *   3) Try to JPA-merge with the original V → OptimisticLockException.
     */
    public OptimisticLockDemoResultDto triggerConflict(Integer courseId) {
        OptimisticLockDemoResultDto result = new OptimisticLockDemoResultDto();
        EntityManager em = emf.createEntityManager();
        Long staleVersion = null;
        try {
            // Step 1: load to capture the current version
            utx.begin();
            em.joinTransaction();
            Course snapshot = em.find(Course.class, courseId);
            if (snapshot == null) {
                utx.rollback();
                result.setOutcome("NOT_FOUND");
                result.setMessage("Course " + courseId + " does not exist");
                return result;
            }
            staleVersion = snapshot.getVersion();
            utx.commit();
            em.clear();

            // Step 2: bump the row out-of-band so the captured version is now stale
            utx.begin();
            em.joinTransaction();
            em.createNativeQuery("UPDATE COURSE SET VERSION = VERSION + 1 WHERE ID = ?1")
                    .setParameter(1, courseId)
                    .executeUpdate();
            utx.commit();
            em.clear();

            // Step 3: attempt to merge with the original (now stale) version
            utx.begin();
            em.joinTransaction();
            Course detached = new Course();
            detached.setId(courseId);
            detached.setName(snapshot.getName());
            detached.setDescription(snapshot.getDescription());
            detached.setStartDate(snapshot.getStartDate());
            detached.setRoom(snapshot.getRoom());
            detached.setMaxStudents(snapshot.getMaxStudents());
            detached.setVersion(staleVersion); // stale on purpose
            em.merge(detached);
            em.flush();           // forces the version-checked UPDATE
            utx.commit();

            // Should not reach here — JPA must have thrown
            result.setOutcome("UNEXPECTED_SUCCESS");
            result.setStaleVersion(staleVersion);
            result.setMessage("Expected OptimisticLockException but the merge succeeded");
            return result;
        } catch (Exception e) {
            safeRollback();
            OptimisticLockException ole = unwrapOle(e);
            if (ole != null) {
                Long currentVersion = readCurrentVersion(courseId);
                result.setOutcome("OPTIMISTIC_LOCK");
                result.setStaleVersion(staleVersion);
                result.setCurrentVersion(currentVersion);
                result.setMessage("OptimisticLockException thrown: stale version "
                        + staleVersion + ", current version " + currentVersion);
                auditLog.record("locking-demo", "OLE for course " + courseId
                        + " (stale=" + staleVersion + ", current=" + currentVersion + ")");
                return result;
            }
            result.setOutcome("ERROR");
            result.setMessage(e.getClass().getSimpleName() + ": " + e.getMessage());
            return result;
        } finally {
            em.close();
        }
    }

    /**
     * Force-save recovery: take the user's intended payload, drop the stale
     * version (we accept overwrite), and persist on a fresh EM + new JTA tx.
     * This is the "what you do after catching OLE" answer.
     */
    public Long forceSave(Integer courseId,
                          String name,
                          String description,
                          LocalDate startDate,
                          String room,
                          Integer maxStudents) {
        EntityManager fresh = emf.createEntityManager();
        try {
            utx.begin();
            fresh.joinTransaction();
            Course reloaded = fresh.find(Course.class, courseId);
            if (reloaded == null) {
                utx.rollback();
                return null;
            }
            reloaded.setName(name);
            reloaded.setDescription(description);
            reloaded.setStartDate(startDate);
            reloaded.setRoom(room);
            reloaded.setMaxStudents(maxStudents);
            // No version comparison — we deliberately overwrite. Hibernate
            // will increment the version on flush.
            utx.commit();
            auditLog.record("locking-demo", "force-saved course " + courseId
                    + " new version " + reloaded.getVersion());
            return reloaded.getVersion();
        } catch (Exception e) {
            safeRollback();
            throw new RuntimeException("Force save failed: " + e.getMessage(), e);
        } finally {
            // Application-managed EM MUST be closed — otherwise it leaks.
            fresh.close();
        }
    }

    private Long readCurrentVersion(Integer courseId) {
        EntityManager em = emf.createEntityManager();
        try {
            Course course = em.find(Course.class, courseId);
            return course == null ? null : course.getVersion();
        } finally {
            em.close();
        }
    }

    private void safeRollback() {
        try {
            utx.rollback();
        } catch (Exception ignore) {
            // best-effort
        }
    }

    private OptimisticLockException unwrapOle(Throwable t) {
        Throwable cur = t;
        while (cur != null) {
            if (cur instanceof OptimisticLockException) {
                return (OptimisticLockException) cur;
            }
            cur = cur.getCause();
        }
        return null;
    }
}
