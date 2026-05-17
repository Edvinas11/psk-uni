package lt.university.async;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
public class TaskState {

    public enum Status {
        PENDING,
        RUNNING,
        DONE,
        FAILED
    }

    private final UUID id;
    private final Instant createdAt;
    private volatile Status status;
    private volatile int progress;
    private volatile String result;
    private volatile String error;
    private volatile Instant finishedAt;

    public TaskState(UUID id) {
        this.id = id;
        this.createdAt = Instant.now();
        this.status = Status.PENDING;
        this.progress = 0;
    }
}