package com.learnspear.Repository;

import com.learnspear.entites.ProjectSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectSubmissionRepo extends JpaRepository<ProjectSubmission, Long> {
    List<ProjectSubmission> findByStudentId(Long studentId);
    Optional<ProjectSubmission> findByStudentIdAndProjectId(Long studentId, Long projectId);
    List<ProjectSubmission> findByProjectId(Long projectId);
}
