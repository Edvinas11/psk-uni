package lt.university.mybatis.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CourseModel {

    private Integer id;
    private String name;
    private String description;
    private LocalDate startDate;
    private String room;
    private Integer maxStudents;
    private Long version;

    private List<StudentModel> students = new ArrayList<>();

    private List<DepartmentModel> departments = new ArrayList<>();
}
