package com.learnspear.Repository;

import com.learnspear.entites.Courses;
import com.learnspear.entites.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepo extends JpaRepository<Courses, Long> {
    List<Courses> findByTrainer(Users trainer);
    Optional<Courses> findByIdAndTrainerUsername(Long id, String username);

}
