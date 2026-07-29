package com.learnspear.Repository;

import com.learnspear.entites.Assignment;
import com.learnspear.entites.Courses;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssignmentRepo extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourse(Courses course);
    List<Assignment> findByCourseId(Long courseId);
    List<Assignment> findByCourseIn(List<Courses> courses);
}
