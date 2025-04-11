package com.learnspear.Service;

import com.learnspear.DTOs.CourseDTO;
import com.learnspear.Repository.CourseRepo;
import com.learnspear.Repository.UserRepo;
import com.learnspear.entites.Courses;
import com.learnspear.entites.Users;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepo courseRepo;
    private final UserRepo userRepo;

    public Courses createCourse(CourseDTO courseDTO, Principal principal){
        Users trainer = userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException(("User Not Found")));

        Courses courses = Courses.builder()
                .title(courseDTO.getTitle())
                .description(courseDTO.getDescription())
                .trainer_id(trainer)
                .build();
        return courseRepo.save(courses);
    }
}
