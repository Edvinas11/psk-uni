package lt.university.persistence;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@ApplicationScoped
public class EntityManagerProducer {

    @PersistenceContext(unitName = "UniversityPU")
    private EntityManager em;

    @Produces
    public EntityManager createEntityManager() {
        return em;
    }

    public void closeEntityManager(@Disposes EntityManager em) {
    }
}
