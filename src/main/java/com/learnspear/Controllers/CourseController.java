package com.learnspear.Controllers;

import com.learnspear.DTOs.CourseDTO;
import com.learnspear.Service.CourseService;
import com.learnspear.entites.Courses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/trainer/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    private final CourseService courseService;

    @PostMapping("/create")
    public ResponseEntity<?> createCourse(@RequestBody CourseDTO courseDTO, Principal principal){
        Courses createdCourse = courseService.createCourse(courseDTO, principal);
        return ResponseEntity.ok("Course Created");
    }
}
