package com.learnspear.Repository;

import com.learnspear.entites.Payment;
import com.learnspear.entites.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Long> {
    List<Payment> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Payment> findByStudent(Users student);
}
