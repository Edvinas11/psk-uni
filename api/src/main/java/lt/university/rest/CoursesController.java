package lt.university.rest;

import lt.university.entities.Course;
import lt.university.entities.Student;
import lt.university.mybatis.model.DepartmentModel;
import lt.university.mybatis.model.CourseModel;
import lt.university.mybatis.model.StudentModel;
import lt.university.rest.contracts.*;
import lt.university.scope.ScopeProbe;
import lt.university.service.CoursesService;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
@Path("/courses")
public class CoursesController {

    @Inject
    private CoursesService coursesService;

    @Inject
    private ScopeProbe scopeProbe;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll() {
        scopeProbe.logCreatedAt();
        List<CourseDto> dtos = coursesService.findAll().stream()
                .map(this::toSummaryDto)
                .collect(Collectors.toList());
        return Response.ok(dtos).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getById(@PathParam("id") Integer id) {
        CourseModel course = coursesService.findById(id);
        if (course == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(toDetailDto(course)).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(CreateCourseDto body) {
        if (body.getName() == null || body.getName().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"Course name is required\"}")
                    .build();
        }

        Course course = new Course();
        course.setName(body.getName());
        course.setDescription(body.getDescription());
        course.setStartDate(body.getStartDate());
        course.setRoom(body.getRoom());
        course.setMaxStudents(body.getMaxStudents());

        Course saved = coursesService.create(course, body.getDepartmentIds());

        return Response.status(Response.Status.CREATED)
                .entity(toSummaryDtoFromEntity(saved))
                .build();
    }

    @POST
    @Path("/{id}/enroll")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response enroll(@PathParam("id") Integer courseId, StudentDto body) {
        if (body.getFirstName() == null || body.getLastName() == null || body.getEmail() == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"firstName, lastName, and email are required\"}")
                    .build();
        }

        try {
            Student student = coursesService.enroll(
                    courseId,
                    body.getFirstName(),
                    body.getLastName(),
                    body.getEmail());
            return Response.status(Response.Status.CREATED).entity(toStudentDto(student)).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        } catch (IllegalStateException e) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") Integer id, CreateCourseDto body) {
        Course data = new Course();
        data.setName(body.getName());
        data.setDescription(body.getDescription());
        data.setStartDate(body.getStartDate());
        data.setRoom(body.getRoom());
        data.setMaxStudents(body.getMaxStudents());

        Course updated = coursesService.update(id, data, body.getDepartmentIds());
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(toSummaryDtoFromEntity(updated)).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("id") Integer id) {
        if (!coursesService.delete(id)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }

    private CourseDto toSummaryDtoFromEntity(Course course) {
        CourseDto dto = new CourseDto();
        dto.setId(course.getId());
        dto.setName(course.getName());
        dto.setDescription(course.getDescription());
        dto.setStartDate(course.getStartDate());
        dto.setRoom(course.getRoom());
        dto.setMaxStudents(course.getMaxStudents());
        dto.setStudentCount(course.getStudents().size());
        dto.setDepartments(course.getDepartments().stream()
                .map(d -> {
                    DepartmentDto dd = new DepartmentDto();
                    dd.setId(d.getId());
                    dd.setName(d.getName());
                    return dd;
                })
                .collect(Collectors.toList()));
        return dto;
    }

    private CourseDto toSummaryDto(CourseModel course) {
        CourseDto dto = new CourseDto();
        dto.setId(course.getId());
        dto.setName(course.getName());
        dto.setDescription(course.getDescription());
        dto.setStartDate(course.getStartDate());
        dto.setRoom(course.getRoom());
        dto.setMaxStudents(course.getMaxStudents());
        dto.setStudentCount(course.getStudents().size());
        dto.setDepartments(course.getDepartments().stream()
                .map(this::toDepartmentDto)
                .collect(Collectors.toList()));
        return dto;
    }

    private CourseDto toDetailDto(CourseModel course) {
        CourseDto dto = toSummaryDto(course);
        dto.setStudents(course.getStudents().stream()
                .map(this::toStudentDto)
                .collect(Collectors.toList()));
        return dto;
    }

    private DepartmentDto toDepartmentDto(DepartmentModel department) {
        DepartmentDto dto = new DepartmentDto();
        dto.setId(department.getId());
        dto.setName(department.getName());
        return dto;
    }

    private StudentDto toStudentDto(StudentModel student) {
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setEmail(student.getEmail());
        dto.setCourseId(student.getCourseId());
        return dto;
    }

    private StudentDto toStudentDto(Student student) {
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setEmail(student.getEmail());
        dto.setCourseId(student.getCourse().getId());
        return dto;
    }
}
