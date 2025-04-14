package com.learnspear.Controllers;


import com.learnspear.DTOs.LessonDto;
import com.learnspear.Service.LessonService;
import com.learnspear.entites.Lessons;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/trainer/courses/lessons")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LessonController {

    @Autowired
    LessonService lessonService;

    @PostMapping("/{courseId}/create")
    public ResponseEntity<?> createLesson(@PathVariable Long courseId, @RequestBody LessonDto lessonDto){
        Lessons created = lessonService.createLesson(courseId, lessonDto);
        return ResponseEntity.ok("Lesson Created for Course ID: "+courseId);
    }

    @GetMapping("/{courseId}/list")
    public ResponseEntity<List<Lessons>> getLessons(@PathVariable Long courseId) {
        return ResponseEntity.ok(lessonService.getLessonsByCourse(courseId));
    }

    @DeleteMapping("/{courseId}/lessons/{lessonId}/delete")
    public ResponseEntity<String> deleteLesson(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            Principal principal) {
        lessonService.deleteLessonByCourseAndTrainer(courseId, lessonId, principal.getName());
        return ResponseEntity.ok("Lesson deleted successfully");
    }


}
