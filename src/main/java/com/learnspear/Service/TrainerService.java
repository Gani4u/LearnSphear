package com.learnspear.Service;

import com.learnspear.DTOs.*;
import com.learnspear.Repository.*;
import com.learnspear.entites.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainerService {

    private final UserRepo userRepo;
    private final CourseRepo courseRepo;
    private final LessonRepo lessonRepo;
    private final EnrollmentRepo enrollmentRepo;
    private final ProjectRepo projectRepo;
    private final ProjectSubmissionRepo projectSubmissionRepo;
    private final MentorReviewRepo mentorReviewRepo;
    private final StudentXpRepo studentXpRepo;
    private final NotificationRepo notificationRepo;
    private final MentorSessionRepo mentorSessionRepo;
    private final AssignmentRepo assignmentRepo;
    private final AssignmentSubmissionRepo assignmentSubmissionRepo;
    private final CourseSectionRepo courseSectionRepo;
    private final CourseReviewRepo courseReviewRepo;
    private final LessonProgressRepo lessonProgressRepo;
    private final CertificateRepo certificateRepo;

    // ============================================================
    // 1. DASHBOARD
    // ============================================================
    public TrainerDashboardResponseDTO getDashboardData(Principal principal) {
        Users trainer = getTrainer(principal);
        List<Courses> courses = courseRepo.findByTrainer(trainer);

        long totalCourses = courses.size();
        long published = courses.stream().filter(c -> "PUBLISHED".equalsIgnoreCase(c.getStatus())).count();
        long drafts = courses.stream().filter(c -> "DRAFT".equalsIgnoreCase(c.getStatus())).count();
        Set<Long> uniqueStudents = new HashSet<>();
        long pendingReviews = 0;
        long pendingAssignments = 0;

        for (Courses course : courses) {
            List<Enrollment> enrollments = enrollmentRepo.findByCourse(course);
            for (Enrollment enrollment : enrollments) {
                uniqueStudents.add(enrollment.getStudent().getId());
            }
            List<ProjectSubmission> submissions = projectSubmissionRepo.findByCourseId(course.getId());
            for (ProjectSubmission sub : submissions) {
                if ("SUBMITTED".equals(sub.getStatus())) pendingReviews++;
            }
            for (Assignment a : assignmentRepo.findByCourse(course)) {
                pendingAssignments += assignmentSubmissionRepo.findByAssignmentId(a.getId()).stream()
                        .filter(s -> "SUBMITTED".equals(s.getStatus())).count();
            }
        }

        List<MentorSession> sessions = mentorSessionRepo.findByTrainerIdOrderByStartTimeAsc(trainer.getId());

        Double avgRating = 0.0;
        long totalReviews = 0;
        double sumRating = 0;
        for (Courses course : courses) {
            Double r = courseReviewRepo.findAverageRatingByCourseId(course.getId());
            long cnt = courseReviewRepo.countByCourseId(course.getId());
            if (r != null) { sumRating += r * cnt; totalReviews += cnt; }
        }
        if (totalReviews > 0) avgRating = Math.round((sumRating / totalReviews) * 10.0) / 10.0;

        return TrainerDashboardResponseDTO.builder()
                .totalCourses(totalCourses)
                .activeStudents((long) uniqueStudents.size())
                .pendingReviewsCount(pendingReviews + pendingAssignments)
                .averageRating(avgRating)
                .upcomingSessions(sessions)
                .courses(courses)
                .build();
    }

    // ============================================================
    // 2. COURSE MANAGEMENT
    // ============================================================
    public List<TrainerCourseDetailDTO> getCourses(Principal principal) {
        Users trainer = getTrainer(principal);
        return courseRepo.findByTrainer(trainer).stream()
                .map(c -> buildCourseDetail(c))
                .collect(Collectors.toList());
    }

    @Transactional
    public Courses createCourse(Courses course, Principal principal) {
        Users trainer = getTrainer(principal);
        course.setTrainer(trainer);
        course.setStatus("DRAFT");
        return courseRepo.save(course);
    }

    @Transactional
    public Courses updateCourse(Long courseId, Courses updatedData, Principal principal) {
        Courses course = getCourseOwnedByTrainer(courseId, principal);
        course.setTitle(updatedData.getTitle());
        if (updatedData.getSubtitle() != null) course.setSubtitle(updatedData.getSubtitle());
        if (updatedData.getDescription() != null) course.setDescription(updatedData.getDescription());
        if (updatedData.getLevel() != null) course.setLevel(updatedData.getLevel());
        if (updatedData.getCategory() != null) course.setCategory(updatedData.getCategory());
        if (updatedData.getLanguage() != null) course.setLanguage(updatedData.getLanguage());
        if (updatedData.getPrice() != null) course.setPrice(updatedData.getPrice());
        if (updatedData.getDiscount() != null) course.setDiscount(updatedData.getDiscount());
        if (updatedData.getDuration() != null) course.setDuration(updatedData.getDuration());
        if (updatedData.getImageUrl() != null) course.setImageUrl(updatedData.getImageUrl());
        if (updatedData.getThumbnailUrl() != null) course.setThumbnailUrl(updatedData.getThumbnailUrl());
        if (updatedData.getBannerUrl() != null) course.setBannerUrl(updatedData.getBannerUrl());
        if (updatedData.getTags() != null) course.setTags(updatedData.getTags());
        if (updatedData.getRequirements() != null) course.setRequirements(updatedData.getRequirements());
        if (updatedData.getOutcomes() != null) course.setOutcomes(updatedData.getOutcomes());
        return courseRepo.save(course);
    }

    @Transactional
    public void deleteCourse(Long courseId, Principal principal) {
        Courses course = getCourseOwnedByTrainer(courseId, principal);
        if (!"DRAFT".equalsIgnoreCase(course.getStatus())) {
            throw new RuntimeException("Only DRAFT courses can be deleted. Archive published courses instead.");
        }
        courseRepo.delete(course);
    }

    @Transactional
    public Courses publishCourse(Long courseId, Principal principal) {
        Courses course = getCourseOwnedByTrainer(courseId, principal);
        course.setStatus("PUBLISHED");
        return courseRepo.save(course);
    }

    @Transactional
    public Courses unpublishCourse(Long courseId, Principal principal) {
        Courses course = getCourseOwnedByTrainer(courseId, principal);
        course.setStatus("DRAFT");
        return courseRepo.save(course);
    }

    @Transactional
    public Courses archiveCourse(Long courseId, Principal principal) {
        Courses course = getCourseOwnedByTrainer(courseId, principal);
        course.setStatus("ARCHIVED");
        return courseRepo.save(course);
    }

    // ============================================================
    // 3. SECTIONS
    // ============================================================
    public List<CourseSection> getSections(Long courseId, Principal principal) {
        Courses course = getCourseOwnedByTrainer(courseId, principal);
        return courseSectionRepo.findByCourseOrderBySequenceAsc(course);
    }

    @Transactional
    public CourseSection addSection(Long courseId, String title, Principal principal) {
        Courses course = getCourseOwnedByTrainer(courseId, principal);
        long count = courseSectionRepo.countByCourse(course);
        return courseSectionRepo.save(CourseSection.builder()
                .course(course)
                .title(title)
                .sequence((int)(count + 1))
                .build());
    }

    @Transactional
    public CourseSection updateSection(Long sectionId, String title, Principal principal) {
        CourseSection section = courseSectionRepo.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found"));
        verifyTrainerOwnsSection(section, principal);
        section.setTitle(title);
        return courseSectionRepo.save(section);
    }

    @Transactional
    public void deleteSection(Long sectionId, Principal principal) {
        CourseSection section = courseSectionRepo.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found"));
        verifyTrainerOwnsSection(section, principal);
        courseSectionRepo.delete(section);
    }

    // ============================================================
    // 4. LESSONS
    // ============================================================
    @Transactional
    public Lessons addLesson(Long courseId, Lessons lesson, Principal principal) {
        Courses course = getCourseOwnedByTrainer(courseId, principal);
        long currentCount = lessonRepo.countByCourse(course);
        lesson.setCourse(course);
        lesson.setSequence((int)(currentCount + 1));
        return lessonRepo.save(lesson);
    }

    @Transactional
    public Lessons updateLesson(Long lessonId, Lessons updatedData, Principal principal) {
        Lessons lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        getCourseOwnedByTrainer(lesson.getCourse().getId(), principal); // verify ownership
        if (updatedData.getTitle() != null) lesson.setTitle(updatedData.getTitle());
        if (updatedData.getVideoUrl() != null) lesson.setVideoUrl(updatedData.getVideoUrl());
        if (updatedData.getDescription() != null) lesson.setDescription(updatedData.getDescription());
        if (updatedData.getContent() != null) lesson.setContent(updatedData.getContent());
        if (updatedData.getDuration() != null) lesson.setDuration(updatedData.getDuration());
        if (updatedData.getLessonType() != null) lesson.setLessonType(updatedData.getLessonType());
        if (updatedData.getIsPreview() != null) lesson.setIsPreview(updatedData.getIsPreview());
        if (updatedData.getResourcesUrl() != null) lesson.setResourcesUrl(updatedData.getResourcesUrl());
        if (updatedData.getSection() != null) lesson.setSection(updatedData.getSection());
        return lessonRepo.save(lesson);
    }

    @Transactional
    public void deleteLesson(Long lessonId, Principal principal) {
        Lessons lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        getCourseOwnedByTrainer(lesson.getCourse().getId(), principal);
        lessonRepo.delete(lesson);
    }

    public List<Lessons> getLessons(Long courseId, Principal principal) {
        Courses course = getCourseOwnedByTrainer(courseId, principal);
        return lessonRepo.findByCourseOrderBySequenceAsc(course);
    }

    // ============================================================
    // 5. ASSIGNMENTS
    // ============================================================
    public List<Assignment> getAssignments(Long courseId, Principal principal) {
        Courses course = getCourseOwnedByTrainer(courseId, principal);
        return assignmentRepo.findByCourse(course);
    }

    @Transactional
    public Assignment createAssignment(Long courseId, Assignment assignment, Principal principal) {
        Courses course = getCourseOwnedByTrainer(courseId, principal);
        assignment.setCourse(course);
        assignment.setCreatedAt(LocalDateTime.now());
        return assignmentRepo.save(assignment);
    }

    @Transactional
    public Assignment updateAssignment(Long assignmentId, Assignment updatedData, Principal principal) {
        Assignment assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        getCourseOwnedByTrainer(assignment.getCourse().getId(), principal);
        if (updatedData.getTitle() != null) assignment.setTitle(updatedData.getTitle());
        if (updatedData.getDescription() != null) assignment.setDescription(updatedData.getDescription());
        if (updatedData.getDeadlineDays() != null) assignment.setDeadlineDays(updatedData.getDeadlineDays());
        if (updatedData.getMaxMarks() != null) assignment.setMaxMarks(updatedData.getMaxMarks());
        if (updatedData.getFileUrl() != null) assignment.setFileUrl(updatedData.getFileUrl());
        return assignmentRepo.save(assignment);
    }

    @Transactional
    public void deleteAssignment(Long assignmentId, Principal principal) {
        Assignment assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        getCourseOwnedByTrainer(assignment.getCourse().getId(), principal);
        assignmentRepo.delete(assignment);
    }

    public List<AssignmentSubmissionDTO> getAssignmentSubmissions(Long assignmentId, Principal principal) {
        Assignment assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        getCourseOwnedByTrainer(assignment.getCourse().getId(), principal);
        return assignmentSubmissionRepo.findByAssignmentId(assignmentId).stream().map(s ->
            AssignmentSubmissionDTO.builder()
                    .id(s.getId())
                    .assignmentId(assignmentId)
                    .assignmentTitle(assignment.getTitle())
                    .studentId(s.getStudent().getId())
                    .studentUsername(s.getStudent().getUsername())
                    .submissionText(s.getSubmissionText())
                    .fileUrl(s.getFileUrl())
                    .submittedAt(s.getSubmittedAt())
                    .status(s.getStatus())
                    .grade(s.getGrade())
                    .feedback(s.getFeedback())
                    .gradedAt(s.getGradedAt())
                    .build()
        ).collect(Collectors.toList());
    }

    @Transactional
    public AssignmentSubmission gradeAssignmentSubmission(Long submissionId, Integer grade, String feedback, Principal principal) {
        AssignmentSubmission submission = assignmentSubmissionRepo.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        getCourseOwnedByTrainer(submission.getAssignment().getCourse().getId(), principal);
        submission.setGrade(grade);
        submission.setFeedback(feedback);
        submission.setStatus("GRADED");
        submission.setGradedAt(LocalDateTime.now());
        assignmentSubmissionRepo.save(submission);

        notificationRepo.save(Notification.builder()
                .user(submission.getStudent())
                .title("Assignment Graded 📝")
                .message("Your assignment '" + submission.getAssignment().getTitle() + "' was graded. Score: " + grade + "/" + submission.getAssignment().getMaxMarks())
                .type("REVIEW")
                .build());

        return submission;
    }

    // ============================================================
    // 6. PROJECTS
    // ============================================================
    public List<Project> getProjects(Long courseId, Principal principal) {
        Courses course = getCourseOwnedByTrainer(courseId, principal);
        return projectRepo.findByCourseId(course.getId());
    }

    @Transactional
    public Project createProject(Long courseId, Project project, Principal principal) {
        Courses course = getCourseOwnedByTrainer(courseId, principal);
        project.setCourse(course);
        return projectRepo.save(project);
    }

    @Transactional
    public Project updateProject(Long projectId, Project updatedData, Principal principal) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        getCourseOwnedByTrainer(project.getCourse().getId(), principal);
        if (updatedData.getTitle() != null) project.setTitle(updatedData.getTitle());
        if (updatedData.getDescription() != null) project.setDescription(updatedData.getDescription());
        if (updatedData.getDifficulty() != null) project.setDifficulty(updatedData.getDifficulty());
        if (updatedData.getDeadlineDays() != null) project.setDeadlineDays(updatedData.getDeadlineDays());
        if (updatedData.getMaxScore() != null) project.setMaxScore(updatedData.getMaxScore());
        if (updatedData.getGithubRequired() != null) project.setGithubRequired(updatedData.getGithubRequired());
        if (updatedData.getRubric() != null) project.setRubric(updatedData.getRubric());
        return projectRepo.save(project);
    }

    @Transactional
    public void deleteProject(Long projectId, Principal principal) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        getCourseOwnedByTrainer(project.getCourse().getId(), principal);
        projectRepo.delete(project);
    }

    public List<ProjectSubmission> getPendingSubmissions(Principal principal) {
        Users trainer = getTrainer(principal);
        List<Courses> courses = courseRepo.findByTrainer(trainer);
        List<ProjectSubmission> pending = new ArrayList<>();
        for (Courses course : courses) {
            List<ProjectSubmission> submissions = projectSubmissionRepo.findByCourseId(course.getId());
            pending.addAll(submissions.stream().filter(s -> "SUBMITTED".equals(s.getStatus())).collect(Collectors.toList()));
        }
        return pending;
    }

    @Transactional
    public ProjectSubmission gradeProjectSubmission(Long submissionId, String status, String feedback, Integer score, Principal principal) {
        Users trainer = getTrainer(principal);
        ProjectSubmission submission = projectSubmissionRepo.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        if (!submission.getProject().getCourse().getTrainer().getId().equals(trainer.getId())) {
            throw new RuntimeException("Unauthorized to grade this submission");
        }

        submission.setStatus(status);
        submission.setFeedback(feedback);
        submission.setScore(score);
        submission.setGradedAt(LocalDateTime.now());
        projectSubmissionRepo.save(submission);

        Users student = submission.getStudent();
        if ("APPROVED".equals(status)) {
            studentXpRepo.save(StudentXp.builder()
                    .student(student)
                    .activity("Project Approved: " + submission.getProject().getTitle())
                    .xp(100)
                    .earnedAt(LocalDateTime.now())
                    .build());
            Integer totalXp = studentXpRepo.sumXpByStudentId(student.getId());
            student.setXp(totalXp != null ? totalXp : 0);
            userRepo.save(student);
            notificationRepo.save(Notification.builder()
                    .user(student)
                    .title("Project Approved! 🎉")
                    .message("Your project '" + submission.getProject().getTitle() + "' was approved. Score: " + score)
                    .type("REVIEW")
                    .build());
        } else {
            notificationRepo.save(Notification.builder()
                    .user(student)
                    .title("Project Needs Changes ⚠️")
                    .message("Your project '" + submission.getProject().getTitle() + "' needs updates. Feedback: " + feedback)
                    .type("REVIEW")
                    .build());
        }
        return submission;
    }

    // Old gradeSubmission kept for backward compat
    @Transactional
    public MentorReview gradeSubmission(Long submissionId, String status, String feedback, Integer rating, Principal principal) {
        Users trainer = getTrainer(principal);
        ProjectSubmission submission = projectSubmissionRepo.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        if (!submission.getProject().getCourse().getTrainer().getId().equals(trainer.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        MentorReview review = MentorReview.builder()
                .submission(submission).trainer(trainer).rating(rating)
                .feedback(feedback).reviewedAt(LocalDateTime.now()).build();
        mentorReviewRepo.save(review);
        submission.setStatus(status);
        projectSubmissionRepo.save(submission);
        return review;
    }

    // ============================================================
    // 7. STUDENT INSIGHTS
    // ============================================================
    public List<StudentEnrollmentDTO> getCourseStudents(Long courseId, Principal principal) {
        Courses course = getCourseOwnedByTrainer(courseId, principal);
        List<Enrollment> enrollments = enrollmentRepo.findByCourse(course);
        return enrollments.stream().map(e -> {
            Users student = e.getStudent();
            long totalLessons = lessonRepo.countByCourse(course);
            long completedLessons = lessonProgressRepo.countByStudentIdAndCourseIdAndCompleted(student.getId(), course.getId(), true);
            return StudentEnrollmentDTO.builder()
                    .enrollmentId(e.getId())
                    .courseId(course.getId())
                    .courseTitle(course.getTitle())
                    .trainerName(student.getUsername())
                    .progressPercentage(e.getProgressPercentage())
                    .completed(e.getCompleted())
                    .enrollmentDate(e.getEnrollmentDate())
                    .lastAccessedAt(e.getLastAccessedAt())
                    .totalLessons((int) totalLessons)
                    .completedLessons((int) completedLessons)
                    .build();
        }).collect(Collectors.toList());
    }

    // ============================================================
    // 8. SESSIONS (kept for backward compat)
    // ============================================================
    public List<MentorSession> getSessions(Principal principal) {
        Users trainer = getTrainer(principal);
        return mentorSessionRepo.findByTrainerIdOrderByStartTimeAsc(trainer.getId());
    }

    // ============================================================
    // HELPERS
    // ============================================================
    private Users getTrainer(Principal principal) {
        return userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
    }

    private Courses getCourseOwnedByTrainer(Long courseId, Principal principal) {
        return courseRepo.findByIdAndTrainerUsername(courseId, principal.getName())
                .orElseThrow(() -> new RuntimeException("Course not found or unauthorized"));
    }

    private void verifyTrainerOwnsSection(CourseSection section, Principal principal) {
        if (!section.getCourse().getTrainer().getUsername().equals(principal.getName())) {
            throw new RuntimeException("Unauthorized: you do not own this section's course");
        }
    }

    private TrainerCourseDetailDTO buildCourseDetail(Courses course) {
        long totalStudents = enrollmentRepo.countByCourse(course);
        long totalLessons = lessonRepo.countByCourse(course);
        Double avgRating = courseReviewRepo.findAverageRatingByCourseId(course.getId());
        long reviewCount = courseReviewRepo.countByCourseId(course.getId());

        List<CourseSection> sections = courseSectionRepo.findByCourseOrderBySequenceAsc(course);
        List<CourseSectionDTO> sectionDTOs = sections.stream().map(sec -> {
            List<LessonDto> lessonDTOs = sec.getLessons().stream().map(l -> LessonDto.builder()
                    .id(l.getId()).title(l.getTitle()).videoUrl(l.getVideoUrl())
                    .duration(l.getDuration()).lessonType(l.getLessonType())
                    .isPreview(l.getIsPreview()).sequence(l.getSequence())
                    .sectionId(sec.getId()).description(l.getDescription())
                    .resourcesUrl(l.getResourcesUrl()).build()).collect(Collectors.toList());
            return CourseSectionDTO.builder().id(sec.getId()).title(sec.getTitle())
                    .sequence(sec.getSequence()).lessons(lessonDTOs).build();
        }).collect(Collectors.toList());

        return TrainerCourseDetailDTO.builder()
                .id(course.getId()).title(course.getTitle()).subtitle(course.getSubtitle())
                .description(course.getDescription()).imageUrl(course.getImageUrl())
                .thumbnailUrl(course.getThumbnailUrl()).bannerUrl(course.getBannerUrl())
                .level(course.getLevel()).category(course.getCategory()).language(course.getLanguage())
                .price(course.getPrice()).discount(course.getDiscount()).status(course.getStatus())
                .tags(course.getTags()).requirements(course.getRequirements()).outcomes(course.getOutcomes())
                .totalStudents((int) totalStudents).totalLessons((int) totalLessons)
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .reviewCount(reviewCount).sections(sectionDTOs).build();
    }
}
