package lt.university.async;

import lt.university.rest.contracts.AsyncTaskDto;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.UUID;

@ApplicationScoped
@Path("/async/compute")
public class AsyncController {

    @Inject
    private LongComputationService service;

    @Inject
    private TaskRegistry registry;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response start() {
        TaskState state = service.start();
        return Response.accepted(toDto(state)).build();
    }

    @GET
    @Path("/{taskId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("taskId") String taskId) {
        TaskState state;
        try {
            state = registry.get(UUID.fromString(taskId));
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        if (state == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(toDto(state)).build();
    }

    private AsyncTaskDto toDto(TaskState state) {
        AsyncTaskDto dto = new AsyncTaskDto();
        dto.setTaskId(state.getId().toString());
        dto.setStatus(state.getStatus().name());
        dto.setProgress(state.getProgress());
        dto.setResult(state.getResult());
        dto.setError(state.getError());
        dto.setCreatedAt(state.getCreatedAt());
        dto.setFinishedAt(state.getFinishedAt());
        return dto;
    }
}