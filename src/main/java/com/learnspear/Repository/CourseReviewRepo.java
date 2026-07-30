package com.learnspear.Repository;

import com.learnspear.entites.CourseReview;
import com.learnspear.entites.Courses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface CourseReviewRepo extends JpaRepository<CourseReview, Long> {
    List<CourseReview> findByCourse(Courses course);
    List<CourseReview> findByCourseId(Long courseId);
    Optional<CourseReview> findByCourseIdAndStudentId(Long courseId, Long studentId);

    @Query("SELECT AVG(r.rating) FROM CourseReview r WHERE r.course.id = :courseId")
    Double findAverageRatingByCourseId(Long courseId);

    long countByCourseId(Long courseId);
}
