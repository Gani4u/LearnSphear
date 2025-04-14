package com.learnspear.Service;

import com.learnspear.DTOs.LessonDto;
import com.learnspear.Repository.CourseRepo;
import com.learnspear.Repository.LessonRepo;
import com.learnspear.entites.Courses;
import com.learnspear.entites.Lessons;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {

    @Autowired
    CourseRepo courseRepo;

    @Autowired
    LessonRepo lessonRepo;

    public Lessons createLesson(Long courseId, LessonDto lessonDto){
        Courses course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Lessons lesson = new Lessons();
        lesson.setTitle(lessonDto.getTitle());
        lesson.setContent(lessonDto.getContent());
        lesson.setSequence(lessonDto.getSequence());
        lesson.setCourse(course);

        return lessonRepo.save(lesson);
    }

    public List<Lessons> getLessonsByCourse(Long courseId) {
        return lessonRepo.findByCourseIdOrderBySequenceAsc(courseId);
    }


    @Transactional
    public void deleteLessonByCourseAndTrainer(Long courseId, Long lessonId, String trainerUsername) {
        // Step 1: Get the course by ID and trainer's username
        Courses course = courseRepo.findByIdAndTrainerUsername(courseId, trainerUsername)
                .orElseThrow(() -> new RuntimeException("Course not found or not owned by trainer"));

        // Step 2: Find lesson by ID and Course
        Lessons lesson = lessonRepo.findByIdAndCourse(lessonId, course)
                .orElseThrow(() -> new RuntimeException("Lesson not found in the specified course"));

        // Step 3: Delete the lesson
        lessonRepo.delete(lesson);
    }

}
