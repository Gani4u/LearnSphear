package com.learnspear.Repository;

import com.learnspear.entites.StudentRoadmapProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRoadmapProgressRepo extends JpaRepository<StudentRoadmapProgress, Long> {
    List<StudentRoadmapProgress> findByStudentId(Long studentId);
    Optional<StudentRoadmapProgress> findByStudentIdAndRoadmapNodeId(Long studentId, Long roadmapNodeId);
}
