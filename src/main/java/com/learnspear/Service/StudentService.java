package com.learnspear.Service;

import com.learnspear.DTOs.*;
import com.learnspear.Repository.*;
import com.learnspear.entites.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final UserRepo userRepo;
    private final EnrollmentRepo enrollmentRepo;
    private final CourseRepo courseRepo;
    private final LessonRepo lessonRepo;
    private final LessonProgressRepo lessonProgressRepo;
    private final LessonNotesRepo lessonNotesRepo;
    private final CourseResourcesRepo courseResourcesRepo;
    private final RoadmapRepo roadmapRepo;
    private final RoadmapNodeRepo roadmapNodeRepo;
    private final StudentRoadmapProgressRepo studentRoadmapProgressRepo;
    private final ProjectRepo projectRepo;
    private final ProjectSubmissionRepo projectSubmissionRepo;
    private final MentorReviewRepo mentorReviewRepo;
    private final StudentXpRepo studentXpRepo;
    private final BadgeMasterRepo badgeMasterRepo;
    private final StudentBadgeRepo studentBadgeRepo;
    private final NotificationRepo notificationRepo;
    private final DiscussionRepo discussionRepo;
    private final MentorSessionRepo mentorSessionRepo;
    private final AssignmentRepo assignmentRepo;
    private final AssignmentSubmissionRepo assignmentSubmissionRepo;
    private final CertificateRepo certificateRepo;
    private final CourseReviewRepo courseReviewRepo;
    private final WishlistRepo wishlistRepo;
    private final CourseSectionRepo courseSectionRepo;
    private final AnnouncementRepo announcementRepo;
    private final PaymentRepo paymentRepo;

    // ============================================================
    // SEED DEFAULT DATA
    // ============================================================
    @PostConstruct
    @Transactional
    public void seedDefaultData() {
        // Seed default trainer
        Users trainer = userRepo.findByUsername("instructor").orElse(null);
        if (trainer == null) {
            org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder =
                new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder(10);
            trainer = new Users();
            trainer.setUsername("instructor");
            trainer.setEmail("instructor@learnspear.com");
            trainer.setPassword(encoder.encode("password"));
            trainer.setRole(com.learnspear.Enums.Role.TRAINER);
            trainer.setApproved(true);
            trainer.setBio("Senior Software Engineer with 10+ years of building enterprise scale Java and React systems.");
            userRepo.save(trainer);
        }

        // Seed default student
        Users studentUser = userRepo.findByUsername("student").orElse(null);
        if (studentUser == null) {
            org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder =
                new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder(10);
            studentUser = new Users();
            studentUser.setUsername("student");
            studentUser.setEmail("student@learnspear.com");
            studentUser.setPassword(encoder.encode("password"));
            studentUser.setRole(com.learnspear.Enums.Role.STUDENT);
            studentUser.setApproved(true);
            studentUser.setBio("Enthusiastic developer learning Full Stack Engineering.");
            userRepo.save(studentUser);
        }

        // Seed default admin
        Users adminUser = userRepo.findByUsername("admin").orElse(null);
        if (adminUser == null) {
            org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder =
                new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder(10);
            adminUser = new Users();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@learnspear.com");
            adminUser.setPassword(encoder.encode("password"));
            adminUser.setRole(com.learnspear.Enums.Role.ADMIN);
            adminUser.setApproved(true);
            adminUser.setBio("Platform Super Administrator.");
            userRepo.save(adminUser);
        }

        // Seed default courses
        if (courseRepo.count() == 0) {
            final Users finalTrainer = trainer;

            Courses javaCourse = Courses.builder()
                    .title("Java Backend Masterclass")
                    .subtitle("Build enterprise REST APIs with Spring Boot & Hibernate")
                    .description("Comprehensive guide to core Java, OOP, collections, Spring Boot, Hibernate, REST APIs, and microservices.")
                    .level("Intermediate")
                    .category("Backend Engineering")
                    .duration(36)
                    .language("English")
                    .price(99.00)
                    .status("PUBLISHED")
                    .tags("java,spring,backend,api")
                    .requirements("Basic programming knowledge required")
                    .outcomes("Build production-ready REST APIs, Deploy Spring Boot applications")
                    .trainer(finalTrainer)
                    .build();
            courseRepo.save(javaCourse);

            CourseSection s1 = CourseSection.builder().course(javaCourse).title("Module 1: Java Fundamentals").sequence(1).build();
            CourseSection s2 = CourseSection.builder().course(javaCourse).title("Module 2: Spring Boot").sequence(2).build();
            courseSectionRepo.save(s1);
            courseSectionRepo.save(s2);

            lessonRepo.save(Lessons.builder().course(javaCourse).section(s1).title("Java Basics & Syntax").content("Learn variables, data types and loops.").sequence(1).build());
            lessonRepo.save(Lessons.builder().course(javaCourse).section(s1).title("OOP Pillars in Java").content("Master Encapsulation, Inheritance, Polymorphism.").sequence(2).build());
            lessonRepo.save(Lessons.builder().course(javaCourse).section(s2).title("Spring Boot REST Framework").content("Build REST Controllers, handle requests.").sequence(3).build());

            assignmentRepo.save(Assignment.builder().course(javaCourse).title("Build a REST Controller").description("Create a full CRUD REST controller for a Product entity using Spring Boot.").deadlineDays(7).maxMarks(100).build());

            Courses reactCourse = Courses.builder()
                    .title("Vite & React Mastery")
                    .subtitle("Modern frontend engineering with React, Redux & Tailwind")
                    .description("Learn React hooks, virtual DOM, JSX routing, Redux Toolkit state, Tailwind CSS, and optimized production builds.")
                    .level("Beginner")
                    .category("Frontend Engineering")
                    .duration(24)
                    .language("English")
                    .price(79.00)
                    .status("PUBLISHED")
                    .tags("react,frontend,javascript,vite")
                    .requirements("HTML & CSS basics required")
                    .outcomes("Build full React SPA applications, Manage state with Redux")
                    .trainer(finalTrainer)
                    .build();
            courseRepo.save(reactCourse);

            CourseSection r1 = CourseSection.builder().course(reactCourse).title("Module 1: React Basics").sequence(1).build();
            courseSectionRepo.save(r1);

            lessonRepo.save(Lessons.builder().course(reactCourse).section(r1).title("Introduction to JSX").content("Understand component rendering and props binding.").sequence(1).build());
            lessonRepo.save(Lessons.builder().course(reactCourse).section(r1).title("React Hooks System").content("Master useState, useEffect, and custom hooks.").sequence(2).build());

            assignmentRepo.save(Assignment.builder().course(reactCourse).title("Build a Todo App").description("Create a complete Todo app with React hooks, local state management, and Tailwind CSS styling.").deadlineDays(5).maxMarks(100).build());
        }

        if (badgeMasterRepo.count() == 0) {
            badgeMasterRepo.save(BadgeMaster.builder().name("First Step").description("Completed your first lesson!").icon("Flame").xpRequired(10).build());
            badgeMasterRepo.save(BadgeMaster.builder().name("Streak Master").description("Maintained a 5-day streak!").icon("Calendar").xpRequired(50).build());
            badgeMasterRepo.save(BadgeMaster.builder().name("Code Warrior").description("Submitted your first capstone project!").icon("Cpu").xpRequired(100).build());
            badgeMasterRepo.save(BadgeMaster.builder().name("Certified Graduate").description("Achieved 500+ XP on LearnSpear!").icon("Award").xpRequired(500).build());
        }

        if (roadmapRepo.count() == 0) {
            Roadmap backendPath = Roadmap.builder()
                    .title("Backend Developer")
                    .description("Master server-side architectures, REST APIs, databases, containers, and cloud environments.")
                    .level("Intermediate")
                    .build();
            roadmapRepo.save(backendPath);
            roadmapNodeRepo.save(RoadmapNode.builder().roadmap(backendPath).title("Java Fundamentals").orderNo(1).estimatedHours(12).xpReward(50).build());
            roadmapNodeRepo.save(RoadmapNode.builder().roadmap(backendPath).title("Spring Boot").orderNo(2).estimatedHours(20).xpReward(100).build());
        }

        if (projectRepo.count() == 0) {
            List<Courses> courses = courseRepo.findAll();
            for (Courses course : courses) {
                projectRepo.save(Project.builder()
                        .course(course)
                        .title("Build a CRUD REST API for " + course.getTitle())
                        .description("Create a fully operational CRUD REST API. Must include relational tables, input validation, clean layered architecture.")
                        .difficulty("Medium")
                        .deadlineDays(7)
                        .maxScore(100)
                        .githubRequired(true)
                        .rubric("- Clean code: 30pts\n- Working API: 40pts\n- Tests: 20pts\n- Documentation: 10pts")
                        .build());
            }
        }

        // Seed announcement
        if (announcementRepo.count() == 0) {
            Users admin = userRepo.findByUsername("admin").orElse(null);
            if (admin != null) {
                announcementRepo.save(Announcement.builder()
                        .title("Welcome to LearnSphear! 🎉")
                        .message("We're excited to have you here. Start exploring courses and begin your learning journey today!")
                        .type("GLOBAL")
                        .createdBy(admin)
                        .build());
            }
        }
    }

    // ============================================================
    // 1. DASHBOARD
    // ============================================================
    public DashboardResponseDTO getDashboardData(Principal principal) {
        Users student = getStudent(principal);

        Integer totalXp = studentXpRepo.sumXpByStudentId(student.getId());
        if (totalXp == null) totalXp = 0;
        if (!totalXp.equals(student.getXp())) {
            student.setXp(totalXp);
            userRepo.save(student);
        }

        long enrolledCount = enrollmentRepo.countByStudent(student);
        long completedCount = enrollmentRepo.countByStudentAndCompleted(student, true);
        List<Notification> unreadNotifications = notificationRepo.findByUserIdAndIsReadOrderByCreatedAtDesc(student.getId(), false);
        List<MentorSession> sessions = mentorSessionRepo.findByStudentIdOrderByStartTimeAsc(student.getId());

        List<Enrollment> enrollments = enrollmentRepo.findByStudent(student);
        EnrollmentResponseDTO lastActive = null;
        if (!enrollments.isEmpty()) {
            Enrollment active = enrollments.get(enrollments.size() - 1);
            lastActive = mapEnrollmentToDTO(active);
        }

        return DashboardResponseDTO.builder()
                .xp(student.getXp())
                .streak(student.getStreak())
                .enrolledCoursesCount(enrolledCount)
                .completedCoursesCount(completedCount)
                .notifications(unreadNotifications)
                .upcomingSessions(sessions)
                .dailyGoal(60)
                .lastActiveEnrollment(lastActive)
                .build();
    }

    // ============================================================
    // 2. ENROLLED COURSES (MY COURSES TAB)
    // ============================================================
    public List<StudentEnrollmentDTO> getEnrolledCourses(Principal principal) {
        Users student = getStudent(principal);
        List<Enrollment> enrollments = enrollmentRepo.findByStudent(student);
        return enrollments.stream().map(e -> {
            Courses course = e.getCourse();
            long totalLessons = lessonRepo.countByCourse(course);
            long completedLessons = lessonProgressRepo.countByStudentIdAndCourseIdAndCompleted(student.getId(), course.getId(), true);
            return StudentEnrollmentDTO.builder()
                    .enrollmentId(e.getId())
                    .courseId(course.getId())
                    .courseTitle(course.getTitle())
                    .courseSubtitle(course.getSubtitle())
                    .thumbnailUrl(course.getThumbnailUrl())
                    .imageUrl(course.getImageUrl())
                    .trainerName(course.getTrainer().getUsername())
                    .progressPercentage(e.getProgressPercentage())
                    .completed(e.getCompleted())
                    .certificateGenerated(e.getCertificateGenerated())
                    .enrollmentDate(e.getEnrollmentDate())
                    .lastAccessedAt(e.getLastAccessedAt())
                    .totalLessons((int) totalLessons)
                    .completedLessons((int) completedLessons)
                    .level(course.getLevel())
                    .category(course.getCategory())
                    .build();
        }).collect(Collectors.toList());
    }

    // ============================================================
    // 3. EXPLORE COURSES
    // ============================================================
    public List<CourseExploreDTO> exploreCourses(String search, String category, String level, Principal principal) {
        Users student = principal != null ? userRepo.findByUsername(principal.getName()).orElse(null) : null;
        List<Courses> allCourses = courseRepo.findAll().stream()
                .filter(c -> "PUBLISHED".equalsIgnoreCase(c.getStatus()))
                .collect(Collectors.toList());

        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            allCourses = allCourses.stream()
                    .filter(c -> c.getTitle().toLowerCase().contains(q) ||
                                 (c.getDescription() != null && c.getDescription().toLowerCase().contains(q)) ||
                                 (c.getCategory() != null && c.getCategory().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }
        if (category != null && !category.isBlank() && !"All".equalsIgnoreCase(category)) {
            allCourses = allCourses.stream()
                    .filter(c -> category.equalsIgnoreCase(c.getCategory()))
                    .collect(Collectors.toList());
        }
        if (level != null && !level.isBlank() && !"All".equalsIgnoreCase(level)) {
            allCourses = allCourses.stream()
                    .filter(c -> level.equalsIgnoreCase(c.getLevel()))
                    .collect(Collectors.toList());
        }

        final Users finalStudent = student;
        return allCourses.stream().map(course -> buildCourseExploreDTO(course, finalStudent)).collect(Collectors.toList());
    }

    public CourseExploreDTO getCourseDetail(Long courseId, Principal principal) {
        Courses course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        Users student = principal != null ? userRepo.findByUsername(principal.getName()).orElse(null) : null;
        return buildCourseExploreDTO(course, student);
    }

    private CourseExploreDTO buildCourseExploreDTO(Courses course, Users student) {
        long totalLessons = lessonRepo.countByCourse(course);
        Double avgRating = courseReviewRepo.findAverageRatingByCourseId(course.getId());
        long reviewCount = courseReviewRepo.countByCourseId(course.getId());
        long enrolledCount = enrollmentRepo.countByCourse(course);

        boolean isEnrolled = false;
        boolean isWishlisted = false;
        if (student != null) {
            isEnrolled = enrollmentRepo.findByStudentAndCourse(student, course).isPresent();
            isWishlisted = wishlistRepo.existsByStudentIdAndCourseId(student.getId(), course.getId());
        }

        List<CourseSection> sections = courseSectionRepo.findByCourseOrderBySequenceAsc(course);
        List<CourseSectionDTO> sectionDTOs = sections.stream().map(sec -> {
            List<LessonDto> lessonDTOs = sec.getLessons().stream().map(l -> LessonDto.builder()
                    .id(l.getId())
                    .title(l.getTitle())
                    .videoUrl(l.getIsPreview() ? l.getVideoUrl() : null)
                    .isPreview(l.getIsPreview())
                    .duration(l.getDuration())
                    .lessonType(l.getLessonType())
                    .sequence(l.getSequence())
                    .sectionId(sec.getId())
                    .build()).collect(Collectors.toList());
            return CourseSectionDTO.builder()
                    .id(sec.getId())
                    .title(sec.getTitle())
                    .sequence(sec.getSequence())
                    .lessons(lessonDTOs)
                    .build();
        }).collect(Collectors.toList());

        return CourseExploreDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .subtitle(course.getSubtitle())
                .description(course.getDescription())
                .imageUrl(course.getImageUrl())
                .thumbnailUrl(course.getThumbnailUrl())
                .level(course.getLevel())
                .category(course.getCategory())
                .language(course.getLanguage())
                .price(course.getPrice())
                .discount(course.getDiscount())
                .tags(course.getTags())
                .status(course.getStatus())
                .trainerName(course.getTrainer().getUsername())
                .trainerId(course.getTrainer().getId())
                .totalLessons((int) totalLessons)
                .totalDuration(course.getDuration())
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .reviewCount(reviewCount)
                .enrolledCount(enrolledCount)
                .isEnrolled(isEnrolled)
                .isWishlisted(isWishlisted)
                .sections(sectionDTOs)
                .build();
    }

    // ============================================================
    // 4. LESSON PROGRESS
    // ============================================================
    @Transactional
    public String completeLesson(Long courseId, Long lessonId, Principal principal) {
        Users student = getStudent(principal);
        Lessons lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        Courses course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Optional<LessonProgress> existing = lessonProgressRepo.findByStudentIdAndLessonId(student.getId(), lessonId);
        if (existing.isPresent()) {
            return "Lesson already marked completed";
        }

        LessonProgress progress = LessonProgress.builder()
                .student(student)
                .lesson(lesson)
                .course(course)
                .completed(true)
                .completedAt(LocalDateTime.now())
                .build();
        lessonProgressRepo.save(progress);

        Enrollment enrollment = enrollmentRepo.findByStudentAndCourse(student, course)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enrollment.setLastAccessedAt(LocalDateTime.now());

        long totalLessons = lessonRepo.countByCourse(course);
        long completedLessons = lessonProgressRepo.countByStudentIdAndCourseIdAndCompleted(student.getId(), courseId, true);

        int percentage = totalLessons > 0 ? (int) ((completedLessons * 100) / totalLessons) : 0;
        enrollment.setProgressPercentage(percentage);

        if (percentage >= 100) {
            enrollment.setCompleted(true);
            enrollment.setCompletedAt(LocalDateTime.now());
            enrollment.setCertificateGenerated(true);

            // Auto-generate certificate
            boolean certExists = certificateRepo.findByStudentIdAndCourseId(student.getId(), courseId).isPresent();
            if (!certExists) {
                certificateRepo.save(Certificate.builder()
                        .student(student)
                        .course(course)
                        .issuedAt(LocalDateTime.now())
                        .build());
            }

            notificationRepo.save(Notification.builder()
                    .user(student)
                    .title("Course Completed! 🎓")
                    .message("Congratulations! You have completed: " + course.getTitle() + ". Your certificate is ready!")
                    .type("SYSTEM")
                    .build());
        }
        enrollmentRepo.save(enrollment);

        awardXp(student, 10, "Completed Lesson: " + lesson.getTitle());
        checkAndAwardBadges(student);

        return "Lesson progress updated successfully";
    }

    public List<Long> getCompletedLessonIds(Long courseId, Principal principal) {
        Users student = getStudent(principal);
        List<LessonProgress> list = lessonProgressRepo.findByStudentIdAndCourseId(student.getId(), courseId);
        return list.stream().map(lp -> lp.getLesson().getId()).toList();
    }

    // ============================================================
    // 5. ASSIGNMENTS
    // ============================================================
    public List<AssignmentDTO> getStudentAssignments(Principal principal) {
        Users student = getStudent(principal);
        List<Enrollment> enrollments = enrollmentRepo.findByStudent(student);
        List<Courses> enrolledCourses = enrollments.stream().map(Enrollment::getCourse).collect(Collectors.toList());
        List<Assignment> assignments = assignmentRepo.findByCourseIn(enrolledCourses);

        return assignments.stream().map(a -> {
            Optional<AssignmentSubmission> sub = assignmentSubmissionRepo.findByAssignmentIdAndStudentId(a.getId(), student.getId());
            return AssignmentDTO.builder()
                    .id(a.getId())
                    .courseId(a.getCourse().getId())
                    .courseTitle(a.getCourse().getTitle())
                    .title(a.getTitle())
                    .description(a.getDescription())
                    .deadlineDays(a.getDeadlineDays())
                    .maxMarks(a.getMaxMarks())
                    .fileUrl(a.getFileUrl())
                    .createdAt(a.getCreatedAt())
                    .submissionStatus(sub.map(AssignmentSubmission::getStatus).orElse("NOT_SUBMITTED"))
                    .grade(sub.map(AssignmentSubmission::getGrade).orElse(null))
                    .feedback(sub.map(AssignmentSubmission::getFeedback).orElse(null))
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public AssignmentSubmission submitAssignment(Long assignmentId, String submissionText, String fileUrl, Principal principal) {
        Users student = getStudent(principal);
        Assignment assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        Optional<AssignmentSubmission> existing = assignmentSubmissionRepo.findByAssignmentIdAndStudentId(assignmentId, student.getId());
        AssignmentSubmission submission;
        if (existing.isPresent()) {
            submission = existing.get();
            submission.setSubmissionText(submissionText);
            submission.setFileUrl(fileUrl);
            submission.setStatus("RESUBMITTED");
            submission.setSubmittedAt(LocalDateTime.now());
        } else {
            submission = AssignmentSubmission.builder()
                    .assignment(assignment)
                    .student(student)
                    .submissionText(submissionText)
                    .fileUrl(fileUrl)
                    .status("SUBMITTED")
                    .submittedAt(LocalDateTime.now())
                    .build();
        }
        return assignmentSubmissionRepo.save(submission);
    }

    public List<AssignmentSubmission> getMyAssignmentSubmissions(Principal principal) {
        Users student = getStudent(principal);
        return assignmentSubmissionRepo.findByStudent(student);
    }

    // ============================================================
    // 6. CERTIFICATES
    // ============================================================
    public List<CertificateDTO> getCertificates(Principal principal) {
        Users student = getStudent(principal);
        return certificateRepo.findByStudent(student).stream().map(cert ->
            CertificateDTO.builder()
                    .id(cert.getId())
                    .courseId(cert.getCourse().getId())
                    .courseTitle(cert.getCourse().getTitle())
                    .trainerName(cert.getCourse().getTrainer().getUsername())
                    .issuedAt(cert.getIssuedAt())
                    .certificateUrl(cert.getCertificateUrl())
                    .studentName(student.getUsername())
                    .build()
        ).collect(Collectors.toList());
    }

    // ============================================================
    // 7. REVIEWS
    // ============================================================
    @Transactional
    public CourseReview postReview(Long courseId, Integer rating, String reviewText, Principal principal) {
        Users student = getStudent(principal);
        Courses course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Optional<CourseReview> existing = courseReviewRepo.findByCourseIdAndStudentId(courseId, student.getId());
        CourseReview review;
        if (existing.isPresent()) {
            review = existing.get();
            review.setRating(rating);
            review.setReviewText(reviewText);
            review.setUpdatedAt(LocalDateTime.now());
        } else {
            review = CourseReview.builder()
                    .course(course)
                    .student(student)
                    .rating(rating)
                    .reviewText(reviewText)
                    .createdAt(LocalDateTime.now())
                    .build();
        }
        return courseReviewRepo.save(review);
    }

    public List<CourseReviewDTO> getCourseReviews(Long courseId) {
        return courseReviewRepo.findByCourseId(courseId).stream().map(r ->
            CourseReviewDTO.builder()
                    .id(r.getId())
                    .courseId(courseId)
                    .studentId(r.getStudent().getId())
                    .studentUsername(r.getStudent().getUsername())
                    .rating(r.getRating())
                    .reviewText(r.getReviewText())
                    .createdAt(r.getCreatedAt())
                    .build()
        ).collect(Collectors.toList());
    }

    // ============================================================
    // 8. WISHLIST
    // ============================================================
    @Transactional
    public String addToWishlist(Long courseId, Principal principal) {
        Users student = getStudent(principal);
        if (wishlistRepo.existsByStudentIdAndCourseId(student.getId(), courseId)) {
            return "Already in wishlist";
        }
        Courses course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        wishlistRepo.save(Wishlist.builder().student(student).course(course).build());
        return "Added to wishlist";
    }

    @Transactional
    public String removeFromWishlist(Long courseId, Principal principal) {
        Users student = getStudent(principal);
        wishlistRepo.deleteByStudentIdAndCourseId(student.getId(), courseId);
        return "Removed from wishlist";
    }

    public List<CourseExploreDTO> getWishlist(Principal principal) {
        Users student = getStudent(principal);
        return wishlistRepo.findByStudent(student).stream()
                .map(w -> buildCourseExploreDTO(w.getCourse(), student))
                .collect(Collectors.toList());
    }

    // ============================================================
    // 9. NOTES
    // ============================================================
    public List<LessonNotes> getNotes(Long lessonId, Principal principal) {
        Users student = getStudent(principal);
        return lessonNotesRepo.findByStudentIdAndLessonId(student.getId(), lessonId);
    }

    public LessonNotes addNote(Long lessonId, String noteText, Integer timestamp, Principal principal) {
        Users student = getStudent(principal);
        Lessons lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        LessonNotes note = LessonNotes.builder()
                .student(student)
                .lesson(lesson)
                .note(noteText)
                .videoTimestamp(timestamp)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return lessonNotesRepo.save(note);
    }

    // ============================================================
    // 10. DISCUSSIONS
    // ============================================================
    public List<Discussion> getDiscussions(Long lessonId) {
        return discussionRepo.findByLessonIdOrderByCreatedAtAsc(lessonId);
    }

    public Discussion addDiscussion(Long lessonId, String message, Principal principal) {
        Users student = getStudent(principal);
        Lessons lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        Discussion discussion = Discussion.builder()
                .lesson(lesson)
                .student(student)
                .message(message)
                .createdAt(LocalDateTime.now())
                .build();
        return discussionRepo.save(discussion);
    }

    // ============================================================
    // 11. ROADMAPS
    // ============================================================
    public List<Roadmap> getRoadmaps() {
        return roadmapRepo.findAll();
    }

    public List<RoadmapNode> getRoadmapNodes(Long roadmapId) {
        return roadmapNodeRepo.findByRoadmapIdOrderByOrderNoAsc(roadmapId);
    }

    public List<StudentRoadmapProgress> getStudentRoadmapProgress(Principal principal) {
        Users student = getStudent(principal);
        return studentRoadmapProgressRepo.findByStudentId(student.getId());
    }

    // ============================================================
    // 12. PROJECTS
    // ============================================================
    public List<Project> getProjectsForStudent(Principal principal) {
        Users student = getStudent(principal);
        List<Enrollment> enrollments = enrollmentRepo.findByStudent(student);
        List<Project> projects = new ArrayList<>();
        for (Enrollment enrollment : enrollments) {
            projects.addAll(projectRepo.findByCourseId(enrollment.getCourse().getId()));
        }
        return projects;
    }

    @Transactional
    public ProjectSubmission submitProject(Long projectId, ProjectSubmissionRequest req, Principal principal) {
        Users student = getStudent(principal);
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Optional<ProjectSubmission> existing = projectSubmissionRepo.findByStudentIdAndProjectId(student.getId(), projectId);
        ProjectSubmission submission;
        if (existing.isPresent()) {
            submission = existing.get();
            submission.setGithubUrl(req.getGithubUrl());
            submission.setLiveDemo(req.getLiveDemo());
            submission.setNotes(req.getNotes());
            submission.setStatus("SUBMITTED");
            submission.setSubmittedAt(LocalDateTime.now());
        } else {
            submission = ProjectSubmission.builder()
                    .project(project)
                    .student(student)
                    .githubUrl(req.getGithubUrl())
                    .liveDemo(req.getLiveDemo())
                    .notes(req.getNotes())
                    .status("SUBMITTED")
                    .submittedAt(LocalDateTime.now())
                    .build();
            awardXp(student, 100, "Submitted Project: " + project.getTitle());
        }
        projectSubmissionRepo.save(submission);

        Users trainerUser = project.getCourse().getTrainer();
        notificationRepo.save(Notification.builder()
                .user(trainerUser)
                .title("New Project Submission 💻")
                .message("Student " + student.getUsername() + " submitted: " + project.getTitle())
                .type("REVIEW")
                .build());

        return submission;
    }

    public List<ProjectSubmission> getSubmissions(Principal principal) {
        Users student = getStudent(principal);
        return projectSubmissionRepo.findByStudentId(student.getId());
    }

    // ============================================================
    // 13. MENTORS (Kept for backward compat)
    // ============================================================
    public List<Users> getMentors(Principal principal) {
        Users student = getStudent(principal);
        List<Enrollment> enrollments = enrollmentRepo.findByStudent(student);
        return enrollments.stream().map(e -> e.getCourse().getTrainer()).distinct().toList();
    }

    public MentorSession requestSession(MentorSessionRequest req, Principal principal) {
        Users student = getStudent(principal);
        Users trainerUser = userRepo.findById(req.getTrainerId())
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        Courses course = courseRepo.findById(req.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ISO_DATE_TIME;
        LocalDateTime start = LocalDateTime.parse(req.getStartTime(), formatter);
        LocalDateTime end = LocalDateTime.parse(req.getEndTime(), formatter);
        MentorSession session = MentorSession.builder()
                .student(student).trainer(trainerUser).course(course)
                .startTime(start).endTime(end)
                .meetingLink("https://meet.google.com/mock-link-ls")
                .status("SCHEDULED")
                .build();
        mentorSessionRepo.save(session);
        notificationRepo.save(Notification.builder()
                .user(trainerUser)
                .title("Session Request 📅")
                .message("Student " + student.getUsername() + " requested a live session for " + course.getTitle())
                .type("SYSTEM")
                .build());
        return session;
    }

    // ============================================================
    // 14. NOTIFICATIONS
    // ============================================================
    public List<Notification> getNotifications(Principal principal) {
        Users student = getStudent(principal);
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(student.getId());
    }

    @Transactional
    public String markNotificationsRead(Principal principal) {
        Users student = getStudent(principal);
        List<Notification> unread = notificationRepo.findByUserIdAndIsReadOrderByCreatedAtDesc(student.getId(), false);
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepo.saveAll(unread);
        return "Notifications marked read";
    }

    // ============================================================
    // 15. ANNOUNCEMENTS
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

    // ============================================================
    // 16. PAYMENTS HISTORY
    // ============================================================
    public List<Payment> getBillingHistory(Principal principal) {
        Users student = getStudent(principal);
        return paymentRepo.findByStudent(student);
    }

    // ============================================================
    // 17. PROFILE
    // ============================================================
    public ProfileResponseDTO getProfile(Principal principal) {
        Users student = getStudent(principal);
        List<StudentBadge> badgesEarned = studentBadgeRepo.findByStudentId(student.getId());
        List<BadgeMaster> badges = badgesEarned.stream().map(StudentBadge::getBadge).toList();
        List<ProjectSubmission> submissions = projectSubmissionRepo.findByStudentId(student.getId());
        return ProfileResponseDTO.builder()
                .username(student.getUsername())
                .email(student.getEmail())
                .bio(student.getBio())
                .profileImage(student.getProfile_image())
                .linkedinUrl(student.getLinkedin_url())
                .githubUrl(student.getGithub_url())
                .resumeUrl(student.getResume_url())
                .xp(student.getXp())
                .streak(student.getStreak())
                .badges(badges)
                .completedProjects(submissions)
                .build();
    }

    public ProfileResponseDTO updateProfile(ProfileResponseDTO dto, Principal principal) {
        Users student = getStudent(principal);
        student.setBio(dto.getBio());
        student.setProfile_image(dto.getProfileImage());
        student.setLinkedin_url(dto.getLinkedinUrl());
        student.setGithub_url(dto.getGithubUrl());
        student.setResume_url(dto.getResumeUrl());
        userRepo.save(student);
        return getProfile(principal);
    }

    // ============================================================
    // HELPERS
    // ============================================================
    private Users getStudent(Principal principal) {
        return userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void awardXp(Users student, int amount, String activity) {
        studentXpRepo.save(StudentXp.builder()
                .student(student)
                .activity(activity)
                .xp(amount)
                .earnedAt(LocalDateTime.now())
                .build());
        Integer totalXp = studentXpRepo.sumXpByStudentId(student.getId());
        student.setXp(totalXp != null ? totalXp : 0);
        userRepo.save(student);
    }

    private void checkAndAwardBadges(Users student) {
        List<BadgeMaster> allBadges = badgeMasterRepo.findAll();
        for (BadgeMaster badge : allBadges) {
            Optional<StudentBadge> existing = studentBadgeRepo.findByStudentIdAndBadgeId(student.getId(), badge.getId());
            if (existing.isEmpty() && student.getXp() >= badge.getXpRequired()) {
                studentBadgeRepo.save(StudentBadge.builder()
                        .student(student)
                        .badge(badge)
                        .earnedAt(LocalDateTime.now())
                        .build());
                notificationRepo.save(Notification.builder()
                        .user(student)
                        .title("Badge Unlocked! 🏆")
                        .message("You unlocked the badge: " + badge.getName())
                        .type("STREAK")
                        .build());
            }
        }
    }

    private EnrollmentResponseDTO mapEnrollmentToDTO(Enrollment enrollment) {
        Courses course = enrollment.getCourse();
        List<LessonDto> lessonDTOs = course.getLessons().stream().map(lesson -> LessonDto.builder()
                .title(lesson.getTitle())
                .content(lesson.getContent())
                .sequence(lesson.getSequence())
                .build()).toList();
        CourseResponseDTO courseDTO = CourseResponseDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .imageUrl(course.getImageUrl())
                .lessons(lessonDTOs)
                .build();
        return EnrollmentResponseDTO.builder()
                .id(enrollment.getId())
                .enrollmentDate(enrollment.getEnrollmentDate())
                .course(courseDTO)
                .build();
    }
}
