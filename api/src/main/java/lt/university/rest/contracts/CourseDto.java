package lt.university.rest.contracts;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class CourseDto {
    private Integer id;
    private String name;
    private String description;
    private LocalDate startDate;
    private String room;
    private Integer maxStudents;
    private Integer studentCount;
    private List<DepartmentDto> departments;
    private List<StudentDto> students;
}
