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
import java.util.Map;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StudentController {

    private final StudentService studentService;

    // ── Dashboard ────────────────────────────────────────────────
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<DashboardResponseDTO> getDashboardData(Principal principal) {
        return ResponseEntity.ok(studentService.getDashboardData(principal));
    }

    // ── Enrolled Courses (My Courses) ────────────────────────────
    @GetMapping("/enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<StudentEnrollmentDTO>> getEnrolledCourses(Principal principal) {
        return ResponseEntity.ok(studentService.getEnrolledCourses(principal));
    }

    // ── Explore Courses ───────────────────────────────────────────
    @GetMapping("/explore")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseExploreDTO>> exploreCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String level,
            Principal principal) {
        return ResponseEntity.ok(studentService.exploreCourses(search, category, level, principal));
    }

    @GetMapping("/explore/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CourseExploreDTO> getCourseDetail(@PathVariable Long courseId, Principal principal) {
        return ResponseEntity.ok(studentService.getCourseDetail(courseId, principal));
    }

    // ── Lesson Progress ───────────────────────────────────────────
    @PostMapping("/courses/{courseId}/lessons/{lessonId}/complete")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> completeLesson(@PathVariable Long courseId, @PathVariable Long lessonId, Principal principal) {
        return ResponseEntity.ok(studentService.completeLesson(courseId, lessonId, principal));
    }

    @GetMapping("/courses/{courseId}/lessons/completed")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Long>> getCompletedLessonIds(@PathVariable Long courseId, Principal principal) {
        return ResponseEntity.ok(studentService.getCompletedLessonIds(courseId, principal));
    }

    // ── Assignments ───────────────────────────────────────────────
    @GetMapping("/assignments")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<AssignmentDTO>> getAssignments(Principal principal) {
        return ResponseEntity.ok(studentService.getStudentAssignments(principal));
    }

    @PostMapping("/assignments/{assignmentId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<AssignmentSubmission> submitAssignment(
            @PathVariable Long assignmentId,
            @RequestBody Map<String, String> body,
            Principal principal) {
        return ResponseEntity.ok(studentService.submitAssignment(
                assignmentId, body.get("submissionText"), body.get("fileUrl"), principal));
    }

    @GetMapping("/assignments/my-submissions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<AssignmentSubmission>> getMySubmissions(Principal principal) {
        return ResponseEntity.ok(studentService.getMyAssignmentSubmissions(principal));
    }

    // ── Certificates ──────────────────────────────────────────────
    @GetMapping("/certificates")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CertificateDTO>> getCertificates(Principal principal) {
        return ResponseEntity.ok(studentService.getCertificates(principal));
    }

    // ── Reviews ───────────────────────────────────────────────────
    @PostMapping("/courses/{courseId}/review")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CourseReview> postReview(
            @PathVariable Long courseId,
            @RequestBody Map<String, Object> body,
            Principal principal) {
        Integer rating = (Integer) body.get("rating");
        String text = (String) body.get("reviewText");
        return ResponseEntity.ok(studentService.postReview(courseId, rating, text, principal));
    }

    @GetMapping("/courses/{courseId}/reviews")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseReviewDTO>> getCourseReviews(@PathVariable Long courseId) {
        return ResponseEntity.ok(studentService.getCourseReviews(courseId));
    }

    // ── Wishlist ──────────────────────────────────────────────────
    @PostMapping("/wishlist/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> addToWishlist(@PathVariable Long courseId, Principal principal) {
        return ResponseEntity.ok(studentService.addToWishlist(courseId, principal));
    }

    @DeleteMapping("/wishlist/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> removeFromWishlist(@PathVariable Long courseId, Principal principal) {
        return ResponseEntity.ok(studentService.removeFromWishlist(courseId, principal));
    }

    @GetMapping("/wishlist")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CourseExploreDTO>> getWishlist(Principal principal) {
        return ResponseEntity.ok(studentService.getWishlist(principal));
    }

    // ── Notes ─────────────────────────────────────────────────────
    @GetMapping("/lessons/{lessonId}/notes")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<LessonNotes>> getNotes(@PathVariable Long lessonId, Principal principal) {
        return ResponseEntity.ok(studentService.getNotes(lessonId, principal));
    }

    @PostMapping("/lessons/{lessonId}/notes")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<LessonNotes> addNote(@PathVariable Long lessonId,
            @RequestParam String note, @RequestParam Integer timestamp, Principal principal) {
        return ResponseEntity.ok(studentService.addNote(lessonId, note, timestamp, principal));
    }

    // ── Discussions ───────────────────────────────────────────────
    @GetMapping("/lessons/{lessonId}/discussions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Discussion>> getDiscussions(@PathVariable Long lessonId) {
        return ResponseEntity.ok(studentService.getDiscussions(lessonId));
    }

    @PostMapping("/lessons/{lessonId}/discussions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Discussion> addDiscussion(@PathVariable Long lessonId,
            @RequestParam String message, Principal principal) {
        return ResponseEntity.ok(studentService.addDiscussion(lessonId, message, principal));
    }

    // ── Roadmaps ──────────────────────────────────────────────────
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
    public ResponseEntity<List<StudentRoadmapProgress>> getRoadmapProgress(Principal principal) {
        return ResponseEntity.ok(studentService.getStudentRoadmapProgress(principal));
    }

    // ── Projects ──────────────────────────────────────────────────
    @GetMapping("/projects")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Project>> getProjects(Principal principal) {
        return ResponseEntity.ok(studentService.getProjectsForStudent(principal));
    }

    @PostMapping("/projects/{projectId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ProjectSubmission> submitProject(
            @PathVariable Long projectId,
            @RequestBody ProjectSubmissionRequest req, Principal principal) {
        return ResponseEntity.ok(studentService.submitProject(projectId, req, principal));
    }

    @GetMapping("/projects/submissions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ProjectSubmission>> getProjectSubmissions(Principal principal) {
        return ResponseEntity.ok(studentService.getSubmissions(principal));
    }

    // ── Mentors ───────────────────────────────────────────────────
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

    // ── Notifications ─────────────────────────────────────────────
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

    // ── Announcements ─────────────────────────────────────────────
    @GetMapping("/announcements")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<AnnouncementDTO>> getAnnouncements() {
        return ResponseEntity.ok(studentService.getAnnouncements());
    }


    // ── Profile ───────────────────────────────────────────────────
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
}
