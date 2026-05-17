package lt.university.cdi;

import javax.enterprise.context.ApplicationScoped;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.atomic.AtomicLong;

@ApplicationScoped
public class AuditLog {

    private static final int MAX_ENTRIES = 100;

    private final ConcurrentLinkedDeque<AuditEntry> entries = new ConcurrentLinkedDeque<>();
    private final AtomicLong seq = new AtomicLong();

    public void record(String source, String message) {
        entries.addFirst(new AuditEntry(seq.incrementAndGet(), Instant.now(), source, message));
        while (entries.size() > MAX_ENTRIES) {
            entries.pollLast();
        }
    }

    public List<AuditEntry> recent(long sinceSeq) {
        List<AuditEntry> out = new ArrayList<>();
        Iterator<AuditEntry> it = entries.iterator();
        while (it.hasNext()) {
            AuditEntry e = it.next();
            if (e.getSeq() > sinceSeq) {
                out.add(e);
            }
        }
        return out;
    }
}