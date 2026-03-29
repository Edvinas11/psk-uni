package lt.university.rest;

import lt.university.entities.Department;
import lt.university.mybatis.dao.DepartmentsMapper;
import lt.university.mybatis.model.DepartmentWithStudentsModel;
import lt.university.mybatis.model.StudentModel;
import lt.university.rest.contracts.DepartmentDto;
import lt.university.rest.contracts.DepartmentStatsDto;
import lt.university.rest.contracts.StudentDto;
import lt.university.service.DepartmentsService;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
@Path("/departments")
public class DepartmentsController {

    @Inject
    private DepartmentsService departmentsService;

    @Inject
    private DepartmentsMapper departmentsMapper;

    @GET
    @Path("/stats")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getStats() {
        List<DepartmentStatsDto> dtos = departmentsMapper.findAllWithStudents().stream()
                .map(this::toStatsDto)
                .collect(Collectors.toList());
        return Response.ok(dtos).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll() {
        List<DepartmentDto> dtos = departmentsService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return Response.ok(dtos).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(DepartmentDto body) {
        if (body.getName() == null || body.getName().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"Department name is required\"}")
                    .build();
        }
        Department created = departmentsService.create(body.getName());
        return Response.status(Response.Status.CREATED).entity(toDto(created)).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") Integer id, DepartmentDto body) {
        if (body.getName() == null || body.getName().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"Department name is required\"}")
                    .build();
        }
        Department updated = departmentsService.update(id, body.getName());
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(toDto(updated)).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("id") Integer id) {
        if (!departmentsService.delete(id)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }

    private DepartmentDto toDto(Department department) {
        DepartmentDto dto = new DepartmentDto();
        dto.setId(department.getId());
        dto.setName(department.getName());
        return dto;
    }

    private DepartmentStatsDto toStatsDto(DepartmentWithStudentsModel model) {
        DepartmentStatsDto dto = new DepartmentStatsDto();
        dto.setId(model.getId());
        dto.setName(model.getName());
        dto.setStudents(model.getStudents().stream()
                .map(this::toStudentDto)
                .collect(Collectors.toList()));
        return dto;
    }

    private StudentDto toStudentDto(StudentModel model) {
        StudentDto dto = new StudentDto();
        dto.setId(model.getId());
        dto.setFirstName(model.getFirstName());
        dto.setLastName(model.getLastName());
        dto.setEmail(model.getEmail());
        dto.setCourseId(model.getCourseId());
        return dto;
    }
}
