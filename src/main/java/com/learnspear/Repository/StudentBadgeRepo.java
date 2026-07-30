package com.learnspear.Repository;

import com.learnspear.entites.StudentBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentBadgeRepo extends JpaRepository<StudentBadge, Long> {
    List<StudentBadge> findByStudentId(Long studentId);
    Optional<StudentBadge> findByStudentIdAndBadgeId(Long studentId, Long badgeId);
}
