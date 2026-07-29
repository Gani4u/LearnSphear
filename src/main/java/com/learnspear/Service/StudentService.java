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
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    // Seed database with default roadmaps, badges, and projects on start
    @PostConstruct
    @Transactional
    public void seedDefaultData() {
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
            roadmapNodeRepo.save(RoadmapNode.builder().roadmap(backendPath).title("OOP & Collections").orderNo(2).estimatedHours(10).xpReward(50).build());
            roadmapNodeRepo.save(RoadmapNode.builder().roadmap(backendPath).title("Spring Boot").orderNo(3).estimatedHours(20).xpReward(100).build());
            roadmapNodeRepo.save(RoadmapNode.builder().roadmap(backendPath).title("REST APIs & Security").orderNo(4).estimatedHours(15).xpReward(100).build());
            roadmapNodeRepo.save(RoadmapNode.builder().roadmap(backendPath).title("Docker & AWS").orderNo(5).estimatedHours(18).xpReward(150).build());
            roadmapNodeRepo.save(RoadmapNode.builder().roadmap(backendPath).title("Certified Developer").orderNo(6).estimatedHours(0).xpReward(250).build());
        }

        // Add dummy projects if none exist
        if (projectRepo.count() == 0) {
            List<Courses> courses = courseRepo.findAll();
            for (Courses course : courses) {
                projectRepo.save(Project.builder()
                        .course(course)
                        .title("Build a CRUD REST API for " + course.getTitle())
                        .description("Create a fully operational CRUD REST API. Must include relational tables, input validation, clean layered architecture, and unit testing wrappers.")
                        .difficulty("Medium")
                        .deadlineDays(7)
                        .maxScore(100)
                        .build());
            }
        }
    }

    // 1. Dashboard
    public DashboardResponseDTO getDashboardData(Principal principal) {
        Users student = getStudent(principal);

        // Sum XP
        Integer totalXp = studentXpRepo.sumXpByStudentId(student.getId());
        if (student.getXp() != totalXp) {
            student.setXp(totalXp);
            userRepo.save(student);
        }

        long enrolledCount = enrollmentRepo.countByStudent(student);
        long completedCount = enrollmentRepo.countByStudentAndCompleted(student, true);
        List<Notification> unreadNotifications = notificationRepo.findByUserIdAndIsReadOrderByCreatedAtDesc(student.getId(), false);
        List<MentorSession> sessions = mentorSessionRepo.findByStudentIdOrderByStartTimeAsc(student.getId());

        // Find last active enrollment
        List<Enrollment> enrollments = enrollmentRepo.findByStudent(student);
        EnrollmentResponseDTO lastActive = null;
        if (!enrollments.isEmpty()) {
            Enrollment active = enrollments.get(enrollments.size() - 1); // Get last enrollment
            lastActive = mapEnrollmentToDTO(active);
        }

        return DashboardResponseDTO.builder()
                .xp(student.getXp())
                .streak(student.getStreak())
                .enrolledCoursesCount(enrolledCount)
                .completedCoursesCount(completedCount)
                .notifications(unreadNotifications)
                .upcomingSessions(sessions)
                .dailyGoal(60) // default 60%
                .lastActiveEnrollment(lastActive)
                .build();
    }

    // 2. Profile Details & Updates
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

    // 3. Lesson Progress & Completion
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

        // Save progress
        LessonProgress progress = LessonProgress.builder()
                .student(student)
                .lesson(lesson)
                .course(course)
                .completed(true)
                .completedAt(LocalDateTime.now())
                .build();
        lessonProgressRepo.save(progress);

        // Update overall course progress percentage
        Enrollment enrollment = enrollmentRepo.findByStudentAndCourse(student, course)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        long totalLessons = lessonRepo.countByCourse(course);
        long completedLessons = lessonProgressRepo.countByStudentIdAndCourseIdAndCompleted(student.getId(), courseId, true);

        int percentage = totalLessons > 0 ? (int) ((completedLessons * 100) / totalLessons) : 0;
        enrollment.setProgressPercentage(percentage);
        if (percentage >= 100) {
            enrollment.setCompleted(true);
            enrollment.setCompletedAt(LocalDateTime.now());
            
            // Create notification for completing course
            notificationRepo.save(Notification.builder()
                    .user(student)
                    .title("Course Completed! 🎓")
                    .message("Congratulations! You have completed the course: " + course.getTitle())
                    .type("SYSTEM")
                    .build());
        }
        enrollmentRepo.save(enrollment);

        // Award XP
        awardXp(student, 10, "Completed Lesson: " + lesson.getTitle());

        // Check and unlock badges
        checkAndAwardBadges(student);

        return "Lesson progress updated successfully";
    }

    // 4. Notes
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

    // 5. Discussion
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

    // 6. Roadmap
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

    // 7. Projects
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
            // Award XP for first submission
            awardXp(student, 100, "Submitted Capstone Project: " + project.getTitle());
        }

        projectSubmissionRepo.save(submission);

        // Notify Trainer/Mentor
        Users trainer = project.getCourse().getTrainer();
        notificationRepo.save(Notification.builder()
                .user(trainer)
                .title("New Project Submission 💻")
                .message("Student " + student.getUsername() + " submitted a project for: " + project.getTitle())
                .type("REVIEW")
                .build());

        return submission;
    }

    public List<ProjectSubmission> getSubmissions(Principal principal) {
        Users student = getStudent(principal);
        return projectSubmissionRepo.findByStudentId(student.getId());
    }

    // 8. Mentors & Booking
    public List<Users> getMentors(Principal principal) {
        Users student = getStudent(principal);
        List<Enrollment> enrollments = enrollmentRepo.findByStudent(student);
        return enrollments.stream().map(e -> e.getCourse().getTrainer()).distinct().toList();
    }

    public MentorSession requestSession(MentorSessionRequest req, Principal principal) {
        Users student = getStudent(principal);
        Users trainer = userRepo.findById(req.getTrainerId())
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        Courses course = courseRepo.findById(req.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        LocalDateTime start = LocalDateTime.parse(req.getStartTime(), formatter);
        LocalDateTime end = LocalDateTime.parse(req.getEndTime(), formatter);

        MentorSession session = MentorSession.builder()
                .student(student)
                .trainer(trainer)
                .course(course)
                .startTime(start)
                .endTime(end)
                .meetingLink("https://meet.google.com/mock-link-ls")
                .status("SCHEDULED")
                .build();

        mentorSessionRepo.save(session);

        // Notify Trainer
        notificationRepo.save(Notification.builder()
                .user(trainer)
                .title("Session Request 📅")
                .message("Student " + student.getUsername() + " requested a live session for " + course.getTitle() + " on " + start.toString())
                .type("SYSTEM")
                .build());

        return session;
    }

    // 9. Notifications
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

    // Helpers
    private Users getStudent(Principal principal) {
        return userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    private void awardXp(Users student, int amount, String activity) {
        studentXpRepo.save(StudentXp.builder()
                .student(student)
                .activity(activity)
                .xp(amount)
                .earnedAt(LocalDateTime.now())
                .build());

        Integer totalXp = studentXpRepo.sumXpByStudentId(student.getId());
        student.setXp(totalXp);
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

                // Create alert notification
                notificationRepo.save(Notification.builder()
                        .user(student)
                        .title("Badge Unlocked! 🏆")
                        .message("Congratulations! You unlocked the badge: " + badge.getName())
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
