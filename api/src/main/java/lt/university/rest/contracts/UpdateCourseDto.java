package lt.university.rest.contracts;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateCourseDto {
    private String name;
    private String description;
    private LocalDate startDate;
    private String room;
    private Integer maxStudents;
}
