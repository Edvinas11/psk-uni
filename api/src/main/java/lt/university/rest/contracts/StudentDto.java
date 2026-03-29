package lt.university.rest.contracts;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentDto {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private Integer courseId;
}
