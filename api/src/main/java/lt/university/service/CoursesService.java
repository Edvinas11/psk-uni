package lt.university.service;

import lt.university.entities.Course;
import lt.university.entities.Department;
import lt.university.entities.Student;
import lt.university.mybatis.dao.CoursesMapper;
import lt.university.mybatis.model.DepartmentModel;
import lt.university.mybatis.model.CourseModel;
import lt.university.mybatis.model.StudentModel;
import lt.university.persistence.DepartmentsDAO;
import lt.university.persistence.CoursesDAO;
import lt.university.persistence.StudentsDAO;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ApplicationScoped
public class CoursesService {

    @Inject
    private CoursesMapper coursesMapper;

    @Inject
    private CoursesDAO coursesDAO;

    @Inject
    private DepartmentsDAO departmentsDAO;

    @Inject
    private StudentsDAO studentsDAO;

    public List<CourseModel> findAll() {
        List<CourseModel> courses = coursesMapper.findAllCourses();
        if (courses.isEmpty()) {
            return courses;
        }

        List<Integer> courseIds = courses.stream()
                .map(CourseModel::getId)
                .collect(Collectors.toList());

        Map<Integer, List<StudentModel>> studentsByCourse = coursesMapper.findStudentsByCourseIds(courseIds)
                .stream().collect(Collectors.groupingBy(StudentModel::getCourseId));

        Map<Integer, List<DepartmentModel>> departmentsByCourse = coursesMapper.findDepartmentsByCourseIds(courseIds)
                .stream().collect(Collectors.groupingBy(DepartmentModel::getCourseId));

        for (CourseModel course : courses) {
            course.setStudents(studentsByCourse.getOrDefault(course.getId(), new ArrayList<>()));
            course.setDepartments(departmentsByCourse.getOrDefault(course.getId(), new ArrayList<>()));
        }

        return courses;
    }

    public CourseModel findById(Integer id) {
        return coursesMapper.findByIdWithRelations(id);
    }

    @Transactional
    public Course create(Course course, List<Integer> departmentIds) {
        if (departmentIds != null && !departmentIds.isEmpty()) {
            List<Department> departments = departmentsDAO.findByIds(departmentIds);
            course.getDepartments().addAll(departments);
        }
        coursesDAO.persist(course);
        initializeLazyCollections(course);
        return course;
    }

    @Transactional
    public Course update(Integer id, Course data, List<Integer> departmentIds) {
        Course existing = coursesDAO.findOne(id);
        if (existing == null) {
            return null;
        }

        existing.setName(data.getName());
        existing.setDescription(data.getDescription());
        existing.setStartDate(data.getStartDate());
        existing.setRoom(data.getRoom());
        existing.setMaxStudents(data.getMaxStudents());

        if (departmentIds != null) {
            existing.getDepartments().clear();
            existing.getDepartments().addAll(departmentsDAO.findByIds(departmentIds));
        }

        initializeLazyCollections(existing);
        return existing;
    }

    /** Force-load collections while the JPA session is still open (before REST mapping). */
    private void initializeLazyCollections(Course course) {
        course.getStudents().size();
        course.getDepartments().size();
    }

    @Transactional
    public boolean delete(Integer id) {
        Course existing = coursesDAO.findOne(id);
        if (existing == null) {
            return false;
        }
        coursesDAO.delete(id);
        return true;
    }

    @Transactional
    public Student enroll(Integer courseId, String firstName, String lastName, String email) {
        Course course = coursesDAO.findOne(courseId);
        if (course == null) {
            throw new IllegalArgumentException("Course with id " + courseId + " not found");
        }

        if (course.getMaxStudents() != null) {
            long currentCount = studentsDAO.countByCourseId(courseId);
            if (currentCount >= course.getMaxStudents()) {
                throw new IllegalStateException("Course is fully booked");
            }
        }

        Student student = new Student();
        student.setFirstName(firstName);
        student.setLastName(lastName);
        student.setEmail(email);
        student.setCourse(course);

        studentsDAO.persist(student);

        return student;
    }
}
