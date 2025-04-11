package com.learnspear.Repository;

import com.learnspear.entites.Courses;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepo extends JpaRepository<Courses, Long> {
}
