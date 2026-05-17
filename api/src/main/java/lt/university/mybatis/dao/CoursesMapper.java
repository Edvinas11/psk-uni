package lt.university.mybatis.dao;

import lt.university.mybatis.model.DepartmentModel;
import lt.university.mybatis.model.CourseModel;
import lt.university.mybatis.model.StudentModel;
import org.apache.ibatis.annotations.*;
import org.mybatis.cdi.Mapper;

import java.util.List;

@Mapper
public interface CoursesMapper {

        @Select("SELECT ID, FIRST_NAME, LAST_NAME, EMAIL, COURSE_ID " +
                        "FROM STUDENT WHERE COURSE_ID = #{courseId}")
        List<StudentModel> findStudentsByCourseId(Integer courseId);

        @Select("SELECT d.ID, d.NAME " +
                        "FROM DEPARTMENT d " +
                        "JOIN COURSE_DEPARTMENT cd ON cd.DEPARTMENT_ID = d.ID " +
                        "WHERE cd.COURSE_ID = #{courseId}")
        List<DepartmentModel> findDepartmentsByCourseId(Integer courseId);

        @Select("SELECT ID, NAME, DESCRIPTION, START_DATE, ROOM, MAX_STUDENTS, VERSION " +
                        "FROM COURSE WHERE ID = #{id}")
        @Results({
                        @Result(property = "id", column = "ID", id = true),
                        @Result(property = "name", column = "NAME"),
                        @Result(property = "description", column = "DESCRIPTION"),
                        @Result(property = "startDate", column = "START_DATE"),
                        @Result(property = "room", column = "ROOM"),
                        @Result(property = "maxStudents", column = "MAX_STUDENTS"),
                        @Result(property = "version", column = "VERSION"),
                        @Result(property = "students", column = "ID", many = @Many(select = "lt.university.mybatis.dao.CoursesMapper.findStudentsByCourseId")),
                        @Result(property = "departments", column = "ID", many = @Many(select = "lt.university.mybatis.dao.CoursesMapper.findDepartmentsByCourseId"))
        })
        CourseModel findByIdWithRelations(Integer id);

        @Select("SELECT ID, NAME, DESCRIPTION, START_DATE, ROOM, MAX_STUDENTS FROM COURSE")
        @Results({
                        @Result(property = "id", column = "ID", id = true),
                        @Result(property = "name", column = "NAME"),
                        @Result(property = "description", column = "DESCRIPTION"),
                        @Result(property = "startDate", column = "START_DATE"),
                        @Result(property = "room", column = "ROOM"),
                        @Result(property = "maxStudents", column = "MAX_STUDENTS")
        })
        List<CourseModel> findAllCourses();

        @Select("<script>" +
                        "SELECT ID, FIRST_NAME, LAST_NAME, EMAIL, COURSE_ID FROM STUDENT " +
                        "WHERE COURSE_ID IN " +
                        "<foreach item='id' collection='courseIds' open='(' separator=',' close=')'>#{id}</foreach>" +
                        "</script>")
        List<StudentModel> findStudentsByCourseIds(@Param("courseIds") List<Integer> courseIds);

        @Select("<script>" +
                        "SELECT d.ID, d.NAME, cd.COURSE_ID " +
                        "FROM DEPARTMENT d " +
                        "JOIN COURSE_DEPARTMENT cd ON cd.DEPARTMENT_ID = d.ID " +
                        "WHERE cd.COURSE_ID IN " +
                        "<foreach item='id' collection='courseIds' open='(' separator=',' close=')'>#{id}</foreach>" +
                        "</script>")
        @Results({
                        @Result(property = "id", column = "ID"),
                        @Result(property = "name", column = "NAME"),
                        @Result(property = "courseId", column = "COURSE_ID")
        })
        List<DepartmentModel> findDepartmentsByCourseIds(@Param("courseIds") List<Integer> courseIds);

        @Insert("INSERT INTO COURSE (NAME, DESCRIPTION, START_DATE, ROOM, MAX_STUDENTS) " +
                        "VALUES (#{name}, #{description}, #{startDate}, #{room}, #{maxStudents})")
        @Options(useGeneratedKeys = true, keyProperty = "id")
        void insertCourse(CourseModel course);

        @Update("UPDATE COURSE SET NAME = #{name}, DESCRIPTION = #{description}, " +
                        "START_DATE = #{startDate}, ROOM = #{room}, " +
                        "MAX_STUDENTS = #{maxStudents} WHERE ID = #{id}")
        void updateCourse(CourseModel course);

        @Delete("DELETE FROM COURSE WHERE ID = #{id}")
        void deleteCourse(Integer id);
}
