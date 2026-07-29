package com.learnspear.Repository;

import com.learnspear.entites.CourseSection;
import com.learnspear.entites.Courses;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseSectionRepo extends JpaRepository<CourseSection, Long> {
    List<CourseSection> findByCourseOrderBySequenceAsc(Courses course);
    List<CourseSection> findByCourseId(Long courseId);
    long countByCourse(Courses course);
}
