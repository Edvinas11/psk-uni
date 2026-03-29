package lt.university.persistence;

import lt.university.entities.Department;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.util.Collections;
import java.util.List;

@ApplicationScoped
public class DepartmentsDAO {

    @Inject
    private EntityManager em;

    @Transactional
    public void persist(Department department) {
        em.persist(department);
    }

    public Department findOne(Integer id) {
        return em.find(Department.class, id);
    }

    public List<Department> findByIds(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }
        return em.createQuery("SELECT d FROM Department d WHERE d.id IN :ids", Department.class)
                .setParameter("ids", ids)
                .getResultList();
    }

    public List<Department> findAll() {
        return em.createNamedQuery("Department.findAll", Department.class).getResultList();
    }

    @Transactional
    public Department update(Department department) {
        return em.merge(department);
    }

    @Transactional
    public void delete(Integer id) {
        Department department = em.find(Department.class, id);
        if (department != null) {
            em.remove(department);
        }
    }
}
