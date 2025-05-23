package com.learnspear.Service;

import com.learnspear.DTOs.CourseDTO;
import com.learnspear.DTOs.CourseResponseDTO;
import com.learnspear.Repository.CourseRepo;
import com.learnspear.Repository.UserRepo;
import com.learnspear.entites.Courses;
import com.learnspear.entites.Users;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepo courseRepo;
    private final UserRepo userRepo;
    private final FileStorageService fileStorageService;

    public Courses createCourse(CourseDTO courseDTO, Principal principal){
        Users trainer = userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException(("User Not Found")));

        String imageUrl = null;
        if (courseDTO.getImage() != null && !courseDTO.getImage().isEmpty()) {
            try {
                imageUrl = fileStorageService.saveFile(courseDTO.getImage());
            } catch (IOException e) {
                throw new RuntimeException("Failed to store image", e);
            }
        }


        Courses courses = Courses.builder()
                .title(courseDTO.getTitle())
                .description(courseDTO.getDescription())
                .imageUrl(imageUrl)
                .trainer(trainer)
                .build();
        return courseRepo.save(courses);
    }

    public void deleteCourse(Long courseId, Principal principal) {
        String username = principal.getName();
        Courses course = courseRepo.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        // Ensures only the trainer who created the course can delete it
        if (!course.getTrainer().getUsername().equals(username)) {
            throw new AccessDeniedException("You are not authorized to delete this course");
        }

        // Delete the course
        courseRepo.delete(course);
    }

    public CourseResponseDTO convertToDto(Courses courses){
        CourseResponseDTO dto = new CourseResponseDTO();
        dto.setId(courses.getId());
        dto.setTitle(courses.getTitle());
        dto.setDescription(courses.getDescription());
        dto.setImageUrl(courses.getImageUrl());
        return dto;
    }

    public List<CourseResponseDTO> getCoursesByTrainer(Principal principal){
        Users trainer = userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        List<Courses> courses = courseRepo.findByTrainer(trainer);
        return courses.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<CourseResponseDTO> getAllCourses() {
        List<Courses> courses = courseRepo.findAll();
        return courses.stream().map(course -> convertToDto(course)).collect(Collectors.toList());
    }
}
