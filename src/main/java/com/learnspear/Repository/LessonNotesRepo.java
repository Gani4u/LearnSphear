package com.learnspear.Repository;

import com.learnspear.entites.LessonNotes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LessonNotesRepo extends JpaRepository<LessonNotes, Long> {
    List<LessonNotes> findByStudentIdAndLessonId(Long studentId, Long lessonId);
    Optional<LessonNotes> findByStudentIdAndLessonIdAndId(Long studentId, Long lessonId, Long noteId);
}
