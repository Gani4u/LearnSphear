package com.learnspear.Service;

import com.learnspear.DTOs.AdminDashboardResponseDTO;
import com.learnspear.DTOs.AnnouncementDTO;
import com.learnspear.Enums.Role;
import com.learnspear.Repository.*;
import com.learnspear.entites.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepo userRepo;
    private final CourseRepo courseRepo;
    private final NotificationRepo notificationRepo;
    private final EnrollmentRepo enrollmentRepo;
    private final CertificateRepo certificateRepo;
    private final PaymentRepo paymentRepo;
    private final AnnouncementRepo announcementRepo;

    // ============================================================
    // 1. DASHBOARD
    // ============================================================
    public AdminDashboardResponseDTO getDashboard() {
        long total = userRepo.count();
        long students = userRepo.countByRole(Role.STUDENT);
        long trainers = userRepo.countByRole(Role.TRAINER);
        long courses = courseRepo.count();
        long enrollments = enrollmentRepo.count();
        long certificates = certificateRepo.count();

        List<Users> pendingTrainers = userRepo.findByRoleAndApproved(Role.TRAINER, false);
        List<Users> allUsers = userRepo.findAll();

        return AdminDashboardResponseDTO.builder()
                .totalUsers(total)
                .studentCount(students)
                .trainerCount(trainers)
                .pendingTrainersCount((long) pendingTrainers.size())
                .courseCount(courses)
                .totalEnrollments(enrollments)
                .totalCertificates(certificates)
                .pendingTrainers(pendingTrainers)
                .allUsers(allUsers)
                .build();
    }

    // ============================================================
    // 2. TRAINER MANAGEMENT
    // ============================================================
    public List<Users> getAllTrainers() {
        return userRepo.findByRole(Role.TRAINER);
    }

    public List<Users> getPendingTrainers() {
        return userRepo.findByRoleAndApproved(Role.TRAINER, false);
    }

    @Transactional
    public Users approveTrainer(Long trainerId) {
        Users trainer = userRepo.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        if (trainer.getRole() != Role.TRAINER) {
            throw new RuntimeException("User is not a Trainer");
        }
        trainer.setApproved(true);
        userRepo.save(trainer);
        notificationRepo.save(Notification.builder()
                .user(trainer)
                .title("Profile Approved! 🚀")
                .message("Your instructor profile has been approved by the Admin. You can now build and publish courses!")
                .type("SYSTEM")
                .build());
        return trainer;
    }

    @Transactional
    public Users rejectTrainer(Long trainerId, String reason) {
        Users trainer = userRepo.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        trainer.setApproved(false);
        userRepo.save(trainer);
        notificationRepo.save(Notification.builder()
                .user(trainer)
                .title("Profile Not Approved ❌")
                .message("Your instructor profile was not approved. Reason: " + (reason != null ? reason : "Does not meet requirements"))
                .type("SYSTEM")
                .build());
        return trainer;
    }

    @Transactional
    public Users toggleUserApproval(Long userId) {
        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setApproved(!user.getApproved());
        return userRepo.save(user);
    }

    // ============================================================
    // 3. STUDENT MANAGEMENT
    // ============================================================
    public List<Users> getAllStudents() {
        return userRepo.findByRole(Role.STUDENT);
    }

    public List<Users> searchUsers(String query) {
        if (query == null || query.isBlank()) return userRepo.findAll();
        return userRepo.findAll().stream()
                .filter(u -> u.getUsername().toLowerCase().contains(query.toLowerCase()) ||
                             u.getEmail().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
    }

    // ============================================================
    // 4. COURSE MODERATION
    // ============================================================
    public List<Courses> getAllCourses() {
        return courseRepo.findAll();
    }

    @Transactional
    public Courses approveCourse(Long courseId) {
        Courses course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setStatus("PUBLISHED");
        courseRepo.save(course);
        notificationRepo.save(Notification.builder()
                .user(course.getTrainer())
                .title("Course Approved ✅")
                .message("Your course '" + course.getTitle() + "' has been approved and is now live!")
                .type("SYSTEM")
                .build());
        return course;
    }

    @Transactional
    public Courses rejectCourse(Long courseId, String reason) {
        Courses course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setStatus("REJECTED");
        courseRepo.save(course);
        notificationRepo.save(Notification.builder()
                .user(course.getTrainer())
                .title("Course Rejected ❌")
                .message("Your course '" + course.getTitle() + "' was rejected. Reason: " + (reason != null ? reason : "Does not meet content standards"))
                .type("SYSTEM")
                .build());
        return course;
    }

    @Transactional
    public Courses featureCourse(Long courseId) {
        Courses course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setStatus("FEATURED");
        return courseRepo.save(course);
    }

    @Transactional
    public Courses hideCourse(Long courseId) {
        Courses course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setStatus("HIDDEN");
        return courseRepo.save(course);
    }

    @Transactional
    public Courses archiveCourse(Long courseId) {
        Courses course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setStatus("ARCHIVED");
        return courseRepo.save(course);
    }

    // ============================================================
    // 5. ANNOUNCEMENTS
    // ============================================================
    public List<AnnouncementDTO> getAnnouncements() {
        return announcementRepo.findAllByOrderByCreatedAtDesc().stream().map(a ->
            AnnouncementDTO.builder()
                    .id(a.getId())
                    .title(a.getTitle())
                    .message(a.getMessage())
                    .type(a.getType())
                    .createdBy(a.getCreatedBy() != null ? a.getCreatedBy().getUsername() : "Admin")
                    .createdAt(a.getCreatedAt())
                    .build()
        ).collect(Collectors.toList());
    }

    @Transactional
    public Announcement createAnnouncement(String title, String message, String type, Principal principal) {
        Users admin = userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        return announcementRepo.save(Announcement.builder()
                .title(title)
                .message(message)
                .type(type != null ? type : "GLOBAL")
                .createdBy(admin)
                .build());
    }

    @Transactional
    public void deleteAnnouncement(Long announcementId) {
        announcementRepo.deleteById(announcementId);
    }
}
