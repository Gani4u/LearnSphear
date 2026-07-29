package com.learnspear.Repository;

import com.learnspear.entites.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DiscussionRepo extends JpaRepository<Discussion, Long> {
    List<Discussion> findByLessonIdOrderByCreatedAtAsc(Long lessonId);
}
