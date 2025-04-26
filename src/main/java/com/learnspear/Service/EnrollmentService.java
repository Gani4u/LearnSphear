package com.learnspear.Service;

import com.learnspear.DTOs.CourseDTO;
import com.learnspear.DTOs.CourseResponseDTO;
import com.learnspear.DTOs.EnrollmentResponseDTO;
import com.learnspear.DTOs.LessonDto;
import com.learnspear.Repository.CourseRepo;
import com.learnspear.Repository.EnrollmentRepo;
import com.learnspear.Repository.UserRepo;
import com.learnspear.entites.Courses;
import com.learnspear.entites.Enrollment;
import com.learnspear.entites.Users;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepo enrollmentRepo;
    private final UserRepo userRepo;
    private final CourseRepo courseRepo;

    public String enrollStudent(Long studentId, Long courseId){
        Users student = userRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Courses course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if(enrollmentRepo.findByStudentAndCourse(student, course).isPresent()){
            return "Already Enrolled in this course";
        }
        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .enrollmentDate(LocalDateTime.now())
                .build();
        enrollmentRepo.save(enrollment);
        return "Enrollment Done";
    }


    public List<EnrollmentResponseDTO> getEnrollmentsForStudent(Long studentId) {
        Users student = userRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Enrollment> enrollments = enrollmentRepo.findByStudent(student);

        return enrollments.stream().map(enrollment -> {
            Courses course = enrollment.getCourse();

            // Map lessons to DTOs
            List<LessonDto> lessonDTOs = course.getLessons().stream().map(lesson -> LessonDto.builder()
                    .title(lesson.getTitle())
                    .content(lesson.getContent())
                    .sequence(lesson.getSequence())
                    .build()).toList();

            CourseResponseDTO courseDTO = CourseResponseDTO.builder()
                    .id(course.getId())
                    .title(course.getTitle())
                    .description(course.getDescription())
                    .imageUrl(course.getImageUrl())
                    .lessons(lessonDTOs)
                    .build();

            return EnrollmentResponseDTO.builder()
                    .id(enrollment.getId())
                    .enrollmentDate(enrollment.getEnrollmentDate())
                    .course(courseDTO)
                    .build();
        }).toList();
    }

    public String unenrollStudent(Long studentId, Long courseId) {
        Users student = userRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Courses course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        Enrollment enrollment = enrollmentRepo.findByStudentAndCourse(student, course)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enrollmentRepo.delete(enrollment);
        return "Unenrollment successful";
    }

}
