package com.learnspear.Controllers;

import com.learnspear.DTOs.EnrollmentResponseDTO;
import com.learnspear.Service.EnrollmentService;
import com.learnspear.entites.Enrollment;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students/enrollments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class EnrollmentController {

    @Autowired
    private final EnrollmentService enrollmentService;


    @PostMapping("/{studentId}/courses/{courseId}/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> enrollStudentInCourse(@PathVariable Long studentId, @PathVariable Long courseId){
        String message = enrollmentService.enrollStudent(studentId, courseId);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<EnrollmentResponseDTO>> getStudentEnrollments(@PathVariable Long studentId){
        return ResponseEntity.ok(enrollmentService.getEnrollmentsForStudent(studentId));
    }

    @DeleteMapping("/{studentId}/courses/{courseId}/unenroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> unenrollStudentFromCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        String message = enrollmentService.unenrollStudent(studentId, courseId);
        return ResponseEntity.ok(message);
    }

}
