package com.learnspear.Repository;

import com.learnspear.entites.Certificate;
import com.learnspear.entites.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CertificateRepo extends JpaRepository<Certificate, Long> {
    List<Certificate> findByStudent(Users student);
    List<Certificate> findByCourseId(Long courseId);
    Optional<Certificate> findByStudentIdAndCourseId(Long studentId, Long courseId);
    long countByStudentId(Long studentId);
}
