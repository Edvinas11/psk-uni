package lt.university.mybatis.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DepartmentWithStudentsModel {

    private Integer id;
    private String name;
    private Integer courseCount;
    private List<StudentModel> students;
}
