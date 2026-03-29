package lt.university.scope;

import javax.annotation.PostConstruct;
import javax.enterprise.context.RequestScoped;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.logging.Logger;

@RequestScoped
public class ScopeProbe implements Serializable {

    private static final Logger LOG = Logger.getLogger(ScopeProbe.class.getName());

    private LocalDateTime createdAt;

    @PostConstruct
    void init() {
        createdAt = LocalDateTime.now();
    }

    public void logCreatedAt() {
        LOG.info("ScopeProbe created at: " + createdAt);
    }
}
