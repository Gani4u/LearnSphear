package com.learnspear.Repository;

import com.learnspear.entites.MentorReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MentorReviewRepo extends JpaRepository<MentorReview, Long> {
    Optional<MentorReview> findBySubmissionId(Long submissionId);
}
