package com.learnspear.Controllers;

import com.learnspear.DTOs.AdminDashboardResponseDTO;
import com.learnspear.DTOs.AnnouncementDTO;
import com.learnspear.Service.AdminService;
import com.learnspear.entites.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminController {

    private final AdminService adminService;

    // ── Dashboard ─────────────────────────────────────────────────
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponseDTO> getAdminDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    // ── Trainer Management ────────────────────────────────────────
    @GetMapping("/trainers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Users>> getAllTrainers() {
        return ResponseEntity.ok(adminService.getAllTrainers());
    }

    @GetMapping("/trainers/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Users>> getPendingTrainers() {
        return ResponseEntity.ok(adminService.getPendingTrainers());
    }

    @PostMapping("/trainers/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Users> approveTrainer(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveTrainer(id));
    }

    @PostMapping("/trainers/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Users> rejectTrainer(@PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(adminService.rejectTrainer(id, reason));
    }

    @PostMapping("/users/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Users> toggleUserApproval(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserApproval(id));
    }

    // ── Student Management ────────────────────────────────────────
    @GetMapping("/students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Users>> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    @GetMapping("/users/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Users>> searchUsers(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(adminService.searchUsers(query));
    }

    // ── Course Moderation ─────────────────────────────────────────
    @GetMapping("/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Courses>> getAllCourses() {
        return ResponseEntity.ok(adminService.getAllCourses());
    }

    @PostMapping("/courses/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Courses> approveCourse(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveCourse(id));
    }

    @PostMapping("/courses/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Courses> rejectCourse(@PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(adminService.rejectCourse(id, reason));
    }

    @PostMapping("/courses/{id}/feature")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Courses> featureCourse(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.featureCourse(id));
    }

    @PostMapping("/courses/{id}/hide")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Courses> hideCourse(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.hideCourse(id));
    }

    @PostMapping("/courses/{id}/archive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Courses> archiveCourse(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.archiveCourse(id));
    }

    // ── Announcements ─────────────────────────────────────────────
    @GetMapping("/announcements")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AnnouncementDTO>> getAnnouncements() {
        return ResponseEntity.ok(adminService.getAnnouncements());
    }

    @PostMapping("/announcements")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Announcement> createAnnouncement(
            @RequestBody Map<String, String> body, Principal principal) {
        return ResponseEntity.ok(adminService.createAnnouncement(
                body.get("title"), body.get("message"), body.get("type"), principal));
    }

    @DeleteMapping("/announcements/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAnnouncement(@PathVariable Long id) {
        adminService.deleteAnnouncement(id);
        return ResponseEntity.ok("Announcement deleted");
    }
}
