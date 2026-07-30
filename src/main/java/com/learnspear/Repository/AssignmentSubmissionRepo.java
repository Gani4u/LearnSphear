package com.learnspear.Repository;

import com.learnspear.entites.AssignmentSubmission;
import com.learnspear.entites.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AssignmentSubmissionRepo extends JpaRepository<AssignmentSubmission, Long> {
    List<AssignmentSubmission> findByStudent(Users student);
    List<AssignmentSubmission> findByAssignmentId(Long assignmentId);
    Optional<AssignmentSubmission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);
    long countByAssignmentId(Long assignmentId);
}
