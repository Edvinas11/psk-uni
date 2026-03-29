package lt.university.rest.contracts;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class CreateCourseDto {
    private String name;
    private String description;
    private LocalDate startDate;
    private String room;
    private Integer maxStudents;
    private List<Integer> departmentIds;
}
