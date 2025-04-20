package com.learnspear.Controllers;

import com.learnspear.DTOs.CourseDTO;
import com.learnspear.Service.CourseService;
import com.learnspear.entites.Courses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/trainer/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CourseController {

    private final CourseService courseService;

    @PreAuthorize("hasRole('TRAINER')")
    @PostMapping("/create")
    public ResponseEntity<?> createCourse(@ModelAttribute CourseDTO courseDTO, Principal principal){
        Courses createdCourse = courseService.createCourse(courseDTO, principal);
        return ResponseEntity.ok("Course Created");
    }

    @PreAuthorize("hasRole('TRAINER')")
    @DeleteMapping("/delete/{courseId}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long courseId, Principal principal){
        courseService.deleteCourse(courseId, principal);
        return ResponseEntity.ok("Course deleted successfully");
    }

    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/list")
    public ResponseEntity<?> getCourses(Principal principal){
        List<CourseDTO> courses = courseService.getCoursesByTrainer(principal);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/allCourses")
    public ResponseEntity<?> getAllCourses() {
        List<CourseDTO> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }
}
