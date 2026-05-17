package lt.university.rest.contracts;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OptimisticLockDemoResultDto {
    private String outcome;
    private Long staleVersion;
    private Long currentVersion;
    private String message;
}