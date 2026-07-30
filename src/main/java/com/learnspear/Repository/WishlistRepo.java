package com.learnspear.Repository;

import com.learnspear.entites.Users;
import com.learnspear.entites.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistRepo extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByStudent(Users student);
    Optional<Wishlist> findByStudentIdAndCourseId(Long studentId, Long courseId);
    void deleteByStudentIdAndCourseId(Long studentId, Long courseId);
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}
