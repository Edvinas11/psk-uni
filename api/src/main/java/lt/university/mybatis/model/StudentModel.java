package lt.university.mybatis.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentModel {

    private Integer id;
    private String firstName;
    private String lastName;
    private String email;

    private Integer courseId;
}
