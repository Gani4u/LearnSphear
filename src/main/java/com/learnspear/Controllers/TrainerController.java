package com.learnspear.Controllers;

import com.learnspear.DTOs.*;
import com.learnspear.Service.TrainerService;
import com.learnspear.entites.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/trainer")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TrainerController {

    private final TrainerService trainerService;

    // ── Dashboard ─────────────────────────────────────────────────
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<TrainerDashboardResponseDTO> getDashboardData(Principal principal) {
        return ResponseEntity.ok(trainerService.getDashboardData(principal));
    }

    // ── Courses ───────────────────────────────────────────────────
    @GetMapping("/courses")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<TrainerCourseDetailDTO>> getCourses(Principal principal) {
        return ResponseEntity.ok(trainerService.getCourses(principal));
    }

    @PostMapping("/courses")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<Courses> createCourse(@RequestBody Courses course, Principal principal) {
        return ResponseEntity.ok(trainerService.createCourse(course, principal));
    }

    @PutMapping("/courses/{courseId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<Courses> updateCourse(@PathVariable Long courseId,
            @RequestBody Courses course, Principal principal) {
        return ResponseEntity.ok(trainerService.updateCourse(courseId, course, principal));
    }

    @DeleteMapping("/courses/{courseId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<String> deleteCourse(@PathVariable Long courseId, Principal principal) {
        trainerService.deleteCourse(courseId, principal);
        return ResponseEntity.ok("Course deleted successfully");
    }

    @PostMapping("/courses/{courseId}/publish")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<Courses> publishCourse(@PathVariable Long courseId, Principal principal) {
        return ResponseEntity.ok(trainerService.publishCourse(courseId, principal));
    }

    @PostMapping("/courses/{courseId}/unpublish")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<Courses> unpublishCourse(@PathVariable Long courseId, Principal principal) {
        return ResponseEntity.ok(trainerService.unpublishCourse(courseId, principal));
    }

    @PostMapping("/courses/{courseId}/archive")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<Courses> archiveCourse(@PathVariable Long courseId, Principal principal) {
        return ResponseEntity.ok(trainerService.archiveCourse(courseId, principal));
    }

    // ── Sections ──────────────────────────────────────────────────
    @GetMapping("/courses/{courseId}/sections")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<CourseSection>> getSections(@PathVariable Long courseId, Principal principal) {
        return ResponseEntity.ok(trainerService.getSections(courseId, principal));
    }

    @PostMapping("/courses/{courseId}/sections")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<CourseSection> addSection(@PathVariable Long courseId,
            @RequestBody Map<String, String> body, Principal principal) {
        return ResponseEntity.ok(trainerService.addSection(courseId, body.get("title"), principal));
    }

    @PutMapping("/sections/{sectionId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<CourseSection> updateSection(@PathVariable Long sectionId,
            @RequestBody Map<String, String> body, Principal principal) {
        return ResponseEntity.ok(trainerService.updateSection(sectionId, body.get("title"), principal));
    }

    @DeleteMapping("/sections/{sectionId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<String> deleteSection(@PathVariable Long sectionId, Principal principal) {
        trainerService.deleteSection(sectionId, principal);
        return ResponseEntity.ok("Section deleted");
    }

    // ── Lessons ───────────────────────────────────────────────────
    @GetMapping("/courses/{courseId}/lessons")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<Lessons>> getLessons(@PathVariable Long courseId, Principal principal) {
        return ResponseEntity.ok(trainerService.getLessons(courseId, principal));
    }

    @PostMapping("/courses/{courseId}/lessons")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<Lessons> addLesson(@PathVariable Long courseId,
            @RequestBody Lessons lesson, Principal principal) {
        return ResponseEntity.ok(trainerService.addLesson(courseId, lesson, principal));
    }

    @PutMapping("/lessons/{lessonId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<Lessons> updateLesson(@PathVariable Long lessonId,
            @RequestBody Lessons lesson, Principal principal) {
        return ResponseEntity.ok(trainerService.updateLesson(lessonId, lesson, principal));
    }

    @DeleteMapping("/lessons/{lessonId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<String> deleteLesson(@PathVariable Long lessonId, Principal principal) {
        trainerService.deleteLesson(lessonId, principal);
        return ResponseEntity.ok("Lesson deleted");
    }

    // ── Assignments ───────────────────────────────────────────────
    @GetMapping("/courses/{courseId}/assignments")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<Assignment>> getAssignments(@PathVariable Long courseId, Principal principal) {
        return ResponseEntity.ok(trainerService.getAssignments(courseId, principal));
    }

    @PostMapping("/courses/{courseId}/assignments")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<Assignment> createAssignment(@PathVariable Long courseId,
            @RequestBody Assignment assignment, Principal principal) {
        return ResponseEntity.ok(trainerService.createAssignment(courseId, assignment, principal));
    }

    @PutMapping("/assignments/{assignmentId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<Assignment> updateAssignment(@PathVariable Long assignmentId,
            @RequestBody Assignment assignment, Principal principal) {
        return ResponseEntity.ok(trainerService.updateAssignment(assignmentId, assignment, principal));
    }

    @DeleteMapping("/assignments/{assignmentId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<String> deleteAssignment(@PathVariable Long assignmentId, Principal principal) {
        trainerService.deleteAssignment(assignmentId, principal);
        return ResponseEntity.ok("Assignment deleted");
    }

    @GetMapping("/assignments/{assignmentId}/submissions")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<AssignmentSubmissionDTO>> getAssignmentSubmissions(
            @PathVariable Long assignmentId, Principal principal) {
        return ResponseEntity.ok(trainerService.getAssignmentSubmissions(assignmentId, principal));
    }

    @PostMapping("/assignments/submissions/{submissionId}/grade")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<AssignmentSubmission> gradeAssignment(@PathVariable Long submissionId,
            @RequestBody Map<String, Object> body, Principal principal) {
        Integer grade = (Integer) body.get("grade");
        String feedback = (String) body.get("feedback");
        return ResponseEntity.ok(trainerService.gradeAssignmentSubmission(submissionId, grade, feedback, principal));
    }

    // ── Projects ──────────────────────────────────────────────────
    @GetMapping("/courses/{courseId}/projects")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<Project>> getProjects(@PathVariable Long courseId, Principal principal) {
        return ResponseEntity.ok(trainerService.getProjects(courseId, principal));
    }

    @PostMapping("/courses/{courseId}/projects")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<Project> createProject(@PathVariable Long courseId,
            @RequestBody Project project, Principal principal) {
        return ResponseEntity.ok(trainerService.createProject(courseId, project, principal));
    }

    @PutMapping("/projects/{projectId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<Project> updateProject(@PathVariable Long projectId,
            @RequestBody Project project, Principal principal) {
        return ResponseEntity.ok(trainerService.updateProject(projectId, project, principal));
    }

    @DeleteMapping("/projects/{projectId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<String> deleteProject(@PathVariable Long projectId, Principal principal) {
        trainerService.deleteProject(projectId, principal);
        return ResponseEntity.ok("Project deleted");
    }

    @GetMapping("/submissions/pending")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<ProjectSubmission>> getPendingSubmissions(Principal principal) {
        return ResponseEntity.ok(trainerService.getPendingSubmissions(principal));
    }

    @PostMapping("/projects/submissions/{submissionId}/grade")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<ProjectSubmission> gradeProjectSubmission(@PathVariable Long submissionId,
            @RequestBody Map<String, Object> body, Principal principal) {
        String status = (String) body.get("status");
        String feedback = (String) body.get("feedback");
        Integer score = body.get("score") != null ? (Integer) body.get("score") : 0;
        return ResponseEntity.ok(trainerService.gradeProjectSubmission(submissionId, status, feedback, score, principal));
    }

    // Old grade endpoint (backward compat)
    @PostMapping("/submissions/{submissionId}/grade")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<MentorReview> gradeSubmission(@PathVariable Long submissionId,
            @RequestParam String status, @RequestParam String feedback,
            @RequestParam Integer rating, Principal principal) {
        return ResponseEntity.ok(trainerService.gradeSubmission(submissionId, status, feedback, rating, principal));
    }

    // ── Student Insights ──────────────────────────────────────────
    @GetMapping("/courses/{courseId}/students")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<StudentEnrollmentDTO>> getCourseStudents(
            @PathVariable Long courseId, Principal principal) {
        return ResponseEntity.ok(trainerService.getCourseStudents(courseId, principal));
    }

    // ── Sessions ──────────────────────────────────────────────────
    @GetMapping("/sessions")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<MentorSession>> getSessions(Principal principal) {
        return ResponseEntity.ok(trainerService.getSessions(principal));
    }
}
