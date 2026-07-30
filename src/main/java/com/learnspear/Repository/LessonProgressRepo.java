package com.learnspear.Repository;

import com.learnspear.entites.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepo extends JpaRepository<LessonProgress, Long> {
    List<LessonProgress> findByStudentIdAndCourseId(Long studentId, Long courseId);
    Optional<LessonProgress> findByStudentIdAndLessonId(Long studentId, Long lessonId);
    long countByStudentIdAndCourseIdAndCompleted(Long studentId, Long courseId, Boolean completed);
}
