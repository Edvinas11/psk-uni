package lt.university.async;

import javax.enterprise.context.ApplicationScoped;
import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class TaskRegistry {

    private final ConcurrentHashMap<UUID, TaskState> tasks = new ConcurrentHashMap<>();

    public TaskState create() {
        UUID id = UUID.randomUUID();
        TaskState state = new TaskState(id);
        tasks.put(id, state);
        return state;
    }

    public TaskState get(UUID id) {
        return tasks.get(id);
    }

    public void markRunning(UUID id) {
        TaskState s = tasks.get(id);
        if (s != null) {
            s.setStatus(TaskState.Status.RUNNING);
        }
    }

    public void setProgress(UUID id, int progress) {
        TaskState s = tasks.get(id);
        if (s != null) {
            s.setProgress(progress);
        }
    }

    public void complete(UUID id, String result) {
        TaskState s = tasks.get(id);
        if (s != null) {
            s.setStatus(TaskState.Status.DONE);
            s.setProgress(100);
            s.setResult(result);
            s.setFinishedAt(Instant.now());
        }
    }

    public void fail(UUID id, String error) {
        TaskState s = tasks.get(id);
        if (s != null) {
            s.setStatus(TaskState.Status.FAILED);
            s.setError(error);
            s.setFinishedAt(Instant.now());
        }
    }
}