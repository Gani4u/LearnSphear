package com.learnspear.Repository;

import com.learnspear.entites.CourseResources;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseResourcesRepo extends JpaRepository<CourseResources, Long> {
    List<CourseResources> findByLessonId(Long lessonId);
}
