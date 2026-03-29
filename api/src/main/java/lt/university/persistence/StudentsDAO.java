package lt.university.persistence;

import lt.university.entities.Student;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;

@ApplicationScoped
public class StudentsDAO {

    @Inject
    private EntityManager em;

    @Transactional
    public void persist(Student student) {
        em.persist(student);
    }

    public long countByCourseId(Integer courseId) {
        return em.createQuery(
                "SELECT COUNT(s) FROM Student s WHERE s.course.id = :courseId", Long.class)
                .setParameter("courseId", courseId)
                .getSingleResult();
    }
}
