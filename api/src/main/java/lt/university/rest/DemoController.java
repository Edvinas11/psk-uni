package lt.university.rest;

import lt.university.cdi.AuditEntry;
import lt.university.cdi.AuditLog;
import lt.university.locking.LockingDemoService;
import lt.university.notification.Notification;
import lt.university.notification.NotificationService;
import lt.university.rest.contracts.AuditEntryDto;
import lt.university.rest.contracts.OptimisticLockDemoResultDto;
import lt.university.rest.contracts.UpdateCourseDto;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
@Path("/demo")
public class DemoController {

    @Inject
    private LockingDemoService lockingDemo;

    @Inject
    private NotificationService notificationService;

    @Inject
    private AuditLog auditLog;

    /**
     * POST /api/demo/optimistic-lock/{id}
     * Triggers a real OptimisticLockException server-side so the UI can show
     * the failure path in one click.
     */
    @POST
    @Path("/optimistic-lock/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response triggerOptimisticLock(@PathParam("id") Integer id) {
        OptimisticLockDemoResultDto result = lockingDemo.triggerConflict(id);
        if ("NOT_FOUND".equals(result.getOutcome())) {
            return Response.status(Response.Status.NOT_FOUND).entity(result).build();
        }
        return Response.ok(result).build();
    }

    /**
     * POST /api/demo/force-save/{id}
     * Recovery path: open a fresh EM and a new JTA transaction, reload the
     * course, apply the user's changes, commit. Demonstrates the answer to
     * the "how do you save the entity after OLE?" spec question.
     */
    @POST
    @Path("/force-save/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response forceSave(@PathParam("id") Integer id, UpdateCourseDto body) {
        Long newVersion = lockingDemo.forceSave(
                id,
                body.getName(),
                body.getDescription(),
                body.getStartDate(),
                body.getRoom(),
                body.getMaxStudents());
        if (newVersion == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        OptimisticLockDemoResultDto result = new OptimisticLockDemoResultDto();
        result.setOutcome("FORCED_SAVE");
        result.setCurrentVersion(newVersion);
        result.setMessage("Saved on a fresh EM + new JTA transaction. New version: " + newVersion);
        return Response.ok(result).build();
    }

    /**
     * GET /api/demo/notification-impl
     * Returns the runtime class of the active NotificationService bean so the
     * UI can show whether the @Specializes subclass or the @Alternative is
     * currently selected.
     */
    @GET
    @Path("/notification-impl")
    @Produces(MediaType.APPLICATION_JSON)
    public Response notificationImpl() {
        Class<?> cls = notificationService.getClass();
        // CDI client proxy class names look like X$Proxy$_$$_WeldClientProxy.
        // Walk up to the first non-proxy superclass for a clean answer.
        while (cls.getSimpleName().contains("$")) {
            cls = cls.getSuperclass();
        }
        String json = "{\"className\":\"" + cls.getName() + "\","
                + "\"simpleName\":\"" + cls.getSimpleName() + "\"}";
        return Response.ok(json).type(MediaType.APPLICATION_JSON).build();
    }

    /**
     * POST /api/demo/notify
     * Fires the notification chain once with sample data so the audit log
     * fills up without needing a real participant registration.
     */
    @POST
    @Path("/notify")
    @Produces(MediaType.APPLICATION_JSON)
    public Response triggerNotification() {
        notificationService.send(new Notification(
                "demo@example.com",
                "Demo notification",
                "Triggered manually from /api/demo/notify"));
        return Response.ok("{\"sent\":true}").type(MediaType.APPLICATION_JSON).build();
    }

    @GET
    @Path("/audit")
    @Produces(MediaType.APPLICATION_JSON)
    public Response audit(@QueryParam("since") @DefaultValue("0") long since) {
        List<AuditEntry> entries = auditLog.recent(since);
        List<AuditEntryDto> dtos = entries.stream().map(e -> {
            AuditEntryDto dto = new AuditEntryDto();
            dto.setSeq(e.getSeq());
            dto.setAt(e.getAt());
            dto.setSource(e.getSource());
            dto.setMessage(e.getMessage());
            return dto;
        }).collect(Collectors.toList());
        return Response.ok(dtos).build();
    }
}