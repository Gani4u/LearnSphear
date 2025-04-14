package com.learnspear.Repository;

import com.learnspear.entites.Courses;
import com.learnspear.entites.Lessons;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepo extends JpaRepository<Lessons, Long> {
    List<Lessons> findByCourseIdOrderBySequenceAsc(Long courseId);
    Optional<Lessons> findByIdAndCourse(Long id, Courses course);

}
