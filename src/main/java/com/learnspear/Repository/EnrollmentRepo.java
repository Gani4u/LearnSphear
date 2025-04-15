package com.learnspear.Repository;

import com.learnspear.entites.Courses;
import com.learnspear.entites.Enrollment;
import com.learnspear.entites.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.nio.file.OpenOption;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepo extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudent(Users student);
    Optional<Enrollment> findByStudentAndCourse(Users student, Courses course);
}
