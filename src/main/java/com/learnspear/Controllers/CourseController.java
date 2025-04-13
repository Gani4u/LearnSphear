package com.learnspear.Controllers;

import com.learnspear.DTOs.CourseDTO;
import com.learnspear.Service.CourseService;
import com.learnspear.entites.Courses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/trainer/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CourseController {

    private final CourseService courseService;

    @PreAuthorize("hasRole('TRAINER')")
    @PostMapping("/create")
    public ResponseEntity<?> createCourse(@RequestBody CourseDTO courseDTO, Principal principal){
        Courses createdCourse = courseService.createCourse(courseDTO, principal);
        return ResponseEntity.ok("Course Created");
    }

    @PreAuthorize("hasRole('TRAINER')")
    @DeleteMapping("/delete/{courseId}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long courseId, Principal principal){
        courseService.deleteCourse(courseId, principal);
        return ResponseEntity.ok("Course deleted successfully");
    }
}
