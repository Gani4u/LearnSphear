package com.learnspear.Repository;

import com.learnspear.entites.StudentQuizProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentQuizProgressRepo extends JpaRepository<StudentQuizProgress, Long> {
    List<StudentQuizProgress> findByStudentId(Long studentId);
    Optional<StudentQuizProgress> findByStudentIdAndQuizId(Long studentId, Long quizId);
}
