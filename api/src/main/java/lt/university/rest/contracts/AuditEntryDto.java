package lt.university.rest.contracts;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class AuditEntryDto {
    private long seq;
    private Instant at;
    private String source;
    private String message;
}