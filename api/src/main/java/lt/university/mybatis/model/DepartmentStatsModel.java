package lt.university.mybatis.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepartmentStatsModel {

    private Integer id;
    private String name;
    private Long studentCount;
}
