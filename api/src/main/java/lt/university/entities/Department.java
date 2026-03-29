package lt.university.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "DEPARTMENT")
@NamedQueries({
        @NamedQuery(name = "Department.findAll", query = "SELECT d FROM Department d")
})
@Getter
@Setter
public class Department implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "NAME", nullable = false, unique = true, length = 100)
    private String name;

    @ManyToMany(mappedBy = "departments", fetch = FetchType.LAZY)
    @Column(name = "COURSES")
    private List<Course> courses = new ArrayList<>();

    public Department() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Department department = (Department) o;
        return Objects.equals(id, department.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
