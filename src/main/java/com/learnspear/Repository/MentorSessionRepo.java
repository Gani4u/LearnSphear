package com.learnspear.Repository;

import com.learnspear.entites.MentorSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MentorSessionRepo extends JpaRepository<MentorSession, Long> {
    List<MentorSession> findByStudentIdOrderByStartTimeAsc(Long studentId);
    List<MentorSession> findByTrainerIdOrderByStartTimeAsc(Long trainerId);
}
