package com.learnspear.Repository;

import com.learnspear.entites.StudentXp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentXpRepo extends JpaRepository<StudentXp, Long> {
    List<StudentXp> findByStudentIdOrderByEarnedAtDesc(Long studentId);
    
    @Query("SELECT COALESCE(SUM(x.xp), 0) FROM StudentXp x WHERE x.student.id = :studentId")
    Integer sumXpByStudentId(Long studentId);
}
