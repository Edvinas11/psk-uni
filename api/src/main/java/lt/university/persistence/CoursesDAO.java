package lt.university.persistence;

import lt.university.entities.Course;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;

@ApplicationScoped
public class CoursesDAO {

    @Inject
    private EntityManager em;

    @Transactional
    public void persist(Course course) {
        em.persist(course);
    }

    public Course findOne(Integer id) {
        return em.find(Course.class, id);
    }

    @Transactional
    public void delete(Integer id) {
        Course course = em.find(Course.class, id);
        if (course != null) {
            em.remove(course);
        }
    }
}
