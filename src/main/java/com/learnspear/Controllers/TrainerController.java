package com.learnspear.Controllers;

import com.learnspear.DTOs.TrainerDashboardResponseDTO;
import com.learnspear.Service.TrainerService;
import com.learnspear.entites.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/trainer")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TrainerController {

    private final TrainerService trainerService;

    // 1. Dashboard analytics endpoint
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<TrainerDashboardResponseDTO> getDashboardData(Principal principal) {
        return ResponseEntity.ok(trainerService.getDashboardData(principal));
    }

    // 2. Course Management endpoints
    @GetMapping("/courses")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<Courses>> getCourses(Principal principal) {
        return ResponseEntity.ok(trainerService.getCourses(principal));
    }

    @PostMapping("/courses")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<Courses> createCourse(@RequestBody Courses course, Principal principal) {
        return ResponseEntity.ok(trainerService.createCourse(course, principal));
    }

    @PostMapping("/courses/{courseId}/lessons")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<Lessons> addLesson(@PathVariable Long courseId, @RequestBody Lessons lesson, Principal principal) {
        return ResponseEntity.ok(trainerService.addLesson(courseId, lesson, principal));
    }

    // 3. Capstone Grading endpoints
    @GetMapping("/submissions/pending")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<ProjectSubmission>> getPendingSubmissions(Principal principal) {
        return ResponseEntity.ok(trainerService.getPendingSubmissions(principal));
    }

    @PostMapping("/submissions/{submissionId}/grade")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<MentorReview> gradeSubmission(
            @PathVariable Long submissionId,
            @RequestParam String status,
            @RequestParam String feedback,
            @RequestParam Integer rating,
            Principal principal) {
        return ResponseEntity.ok(trainerService.gradeSubmission(submissionId, status, feedback, rating, principal));
    }

    // 4. Session Calendar appointments
    @GetMapping("/sessions")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<MentorSession>> getSessions(Principal principal) {
        return ResponseEntity.ok(trainerService.getSessions(principal));
    }
}
