package lt.university.mybatis.dao;

import lt.university.mybatis.model.DepartmentWithStudentsModel;
import org.apache.ibatis.annotations.ResultMap;
import org.apache.ibatis.annotations.Select;
import org.mybatis.cdi.Mapper;

import java.util.List;

@Mapper
public interface DepartmentsMapper {

        @Select("SELECT " +
                        "d.ID AS departmentId, " +
                        "d.NAME AS departmentName, " +
                        "s.ID AS studentId, " +
                        "s.FIRST_NAME AS firstName, " +
                        "s.LAST_NAME AS lastName, " +
                        "s.EMAIL AS email, " +
                        "s.COURSE_ID AS courseId " +
                        "FROM DEPARTMENT d " +
                        "LEFT JOIN COURSE_DEPARTMENT cd ON d.ID = cd.DEPARTMENT_ID " +
                        "LEFT JOIN STUDENT s ON cd.COURSE_ID = s.COURSE_ID " +
                        "ORDER BY d.ID")
        @ResultMap("departmentWithStudentsResultMap")
        List<DepartmentWithStudentsModel> findAllWithStudents();
}
