package com.learnspear.Controllers;

import com.learnspear.Service.QuizService;
import com.learnspear.entites.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class QuizController {

    private final QuizService quizService;

    // 1. Get Quizzes for Course
    @GetMapping("/courses/{courseId}/quizzes")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Quiz>> getQuizzesForCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(quizService.getQuizzesForCourse(courseId));
    }

    // 2. Get Questions (shuffled list for quiz play)
    @GetMapping("/quizzes/{quizId}/questions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<QuizQuestion>> getQuestionsForQuiz(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizService.getQuestionsForQuiz(quizId));
    }

    // 3. Submit Answers
    @PostMapping("/quizzes/{quizId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Object>> submitQuiz(
            @PathVariable Long quizId,
            @RequestBody Map<Long, String> answers,
            Principal principal) {
        return ResponseEntity.ok(quizService.submitQuiz(quizId, answers, principal));
    }

    // 4. Get student attempts history
    @GetMapping("/quizzes/progress")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<StudentQuizProgress>> getStudentProgress(Principal principal) {
        return ResponseEntity.ok(quizService.getStudentProgress(principal));
    }
}
