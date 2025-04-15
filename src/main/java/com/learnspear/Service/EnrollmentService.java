package com.learnspear.Service;

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

    @Autowired
    private final EnrollmentRepo enrollmentRepo;

    @Autowired
    private final UserRepo userRepo;

    @Autowired
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

    public List<Enrollment> getEnrollmentsForStudent(Long studentId){
        Users student = userRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return enrollmentRepo.findByStudent(student);
    }
}
