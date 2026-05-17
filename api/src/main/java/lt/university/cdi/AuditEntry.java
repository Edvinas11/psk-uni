package lt.university.cdi;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@Getter
@AllArgsConstructor
public class AuditEntry {
    private final long seq;
    private final Instant at;
    private final String source;
    private final String message;
}