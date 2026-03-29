package lt.university.service;

import lt.university.entities.Department;
import lt.university.persistence.DepartmentsDAO;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class DepartmentsService {

    @Inject
    private DepartmentsDAO departmentsDAO;

    @Transactional
    public List<Department> findAll() {
        return departmentsDAO.findAll();
    }

    @Transactional
    public Department create(String name) {
        Department department = new Department();
        department.setName(name);
        departmentsDAO.persist(department);
        return department;
    }

    @Transactional
    public Department update(Integer id, String name) {
        Department existing = departmentsDAO.findOne(id);
        if (existing == null) {
            return null;
        }
        existing.setName(name);
        departmentsDAO.update(existing);
        return existing;
    }

    @Transactional
    public boolean delete(Integer id) {
        Department existing = departmentsDAO.findOne(id);
        if (existing == null) {
            return false;
        }
        departmentsDAO.delete(id);
        return true;
    }
}
