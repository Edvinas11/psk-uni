package lt.university.rest.contracts;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class AsyncTaskDto {
    private String taskId;
    private String status;
    private int progress;
    private String result;
    private String error;
    private Instant createdAt;
    private Instant finishedAt;
}