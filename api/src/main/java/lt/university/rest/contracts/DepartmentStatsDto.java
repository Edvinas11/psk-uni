package lt.university.rest.contracts;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DepartmentStatsDto {
    private Integer id;
    private String name;
    private Integer courseCount;
    private List<StudentDto> students;
}
