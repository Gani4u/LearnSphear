package com.learnspear.Controllers;

import com.learnspear.DTOs.*;
import com.learnspear.Service.StudentService;
import com.learnspear.entites.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StudentController {

    private final StudentService studentService;

    // 1. Dashboard API
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<DashboardResponseDTO> getDashboardData(Principal principal) {
        return ResponseEntity.ok(studentService.getDashboardData(principal));
    }

    // 2. Profile APIs
    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ProfileResponseDTO> getProfile(Principal principal) {
        return ResponseEntity.ok(studentService.getProfile(principal));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ProfileResponseDTO> updateProfile(@RequestBody ProfileResponseDTO dto, Principal principal) {
        return ResponseEntity.ok(studentService.updateProfile(dto, principal));
    }

    // 3. Lesson Progress & Complete APIs
    @PostMapping("/courses/{courseId}/lessons/{lessonId}/complete")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> completeLesson(@PathVariable Long courseId, @PathVariable Long lessonId, Principal principal) {
        return ResponseEntity.ok(studentService.completeLesson(courseId, lessonId, principal));
    }

    // 4. Notes APIs
    @GetMapping("/lessons/{lessonId}/notes")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<LessonNotes>> getNotes(@PathVariable Long lessonId, Principal principal) {
        return ResponseEntity.ok(studentService.getNotes(lessonId, principal));
    }

    @PostMapping("/lessons/{lessonId}/notes")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<LessonNotes> addNote(@PathVariable Long lessonId, @RequestParam String note, @RequestParam Integer timestamp, Principal principal) {
        return ResponseEntity.ok(studentService.addNote(lessonId, note, timestamp, principal));
    }

    // 5. Discussion APIs
    @GetMapping("/lessons/{lessonId}/discussions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Discussion>> getDiscussions(@PathVariable Long lessonId) {
        return ResponseEntity.ok(studentService.getDiscussions(lessonId));
    }

    @PostMapping("/lessons/{lessonId}/discussions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Discussion> addDiscussion(@PathVariable Long lessonId, @RequestParam String message, Principal principal) {
        return ResponseEntity.ok(studentService.addDiscussion(lessonId, message, principal));
    }

    // 6. Roadmap APIs
    @GetMapping("/roadmaps")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Roadmap>> getRoadmaps() {
        return ResponseEntity.ok(studentService.getRoadmaps());
    }

    @GetMapping("/roadmaps/{roadmapId}/nodes")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<RoadmapNode>> getRoadmapNodes(@PathVariable Long roadmapId) {
        return ResponseEntity.ok(studentService.getRoadmapNodes(roadmapId));
    }

    @GetMapping("/roadmaps/progress")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<StudentRoadmapProgress>> getStudentRoadmapProgress(Principal principal) {
        return ResponseEntity.ok(studentService.getStudentRoadmapProgress(principal));
    }

    // 7. Projects APIs
    @GetMapping("/projects")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Project>> getProjectsForStudent(Principal principal) {
        return ResponseEntity.ok(studentService.getProjectsForStudent(principal));
    }

    @PostMapping("/projects/{projectId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ProjectSubmission> submitProject(@PathVariable Long projectId, @RequestBody ProjectSubmissionRequest req, Principal principal) {
        return ResponseEntity.ok(studentService.submitProject(projectId, req, principal));
    }

    @GetMapping("/projects/submissions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ProjectSubmission>> getSubmissions(Principal principal) {
        return ResponseEntity.ok(studentService.getSubmissions(principal));
    }

    // 8. Mentors & Booking APIs
    @GetMapping("/mentors")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Users>> getMentors(Principal principal) {
        return ResponseEntity.ok(studentService.getMentors(principal));
    }

    @PostMapping("/mentor/session/request")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<MentorSession> requestSession(@RequestBody MentorSessionRequest req, Principal principal) {
        return ResponseEntity.ok(studentService.requestSession(req, principal));
    }

    // 9. Notifications APIs
    @GetMapping("/notifications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Notification>> getNotifications(Principal principal) {
        return ResponseEntity.ok(studentService.getNotifications(principal));
    }

    @PutMapping("/notifications/read")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> markNotificationsRead(Principal principal) {
        return ResponseEntity.ok(studentService.markNotificationsRead(principal));
    }
}
