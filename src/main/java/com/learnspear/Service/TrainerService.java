package com.learnspear.Service;

import com.learnspear.DTOs.ProfileResponseDTO;
import com.learnspear.DTOs.TrainerDashboardResponseDTO;
import com.learnspear.Repository.*;
import com.learnspear.entites.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TrainerService {

    private final UserRepo userRepo;
    private final CourseRepo courseRepo;
    private final LessonRepo lessonRepo;
    private final EnrollmentRepo enrollmentRepo;
    private final ProjectSubmissionRepo projectSubmissionRepo;
    private final MentorReviewRepo mentorReviewRepo;
    private final StudentXpRepo studentXpRepo;
    private final NotificationRepo notificationRepo;
    private final MentorSessionRepo mentorSessionRepo;

    // 1. Dashboard
    public TrainerDashboardResponseDTO getDashboardData(Principal principal) {
        Users trainer = getTrainer(principal);
        List<Courses> courses = courseRepo.findByTrainer(trainer);

        long totalCourses = courses.size();
        Set<Long> uniqueStudents = new HashSet<>();
        long pendingReviews = 0;

        for (Courses course : courses) {
            List<Enrollment> enrollments = enrollmentRepo.findByCourse(course);
            for (Enrollment enrollment : enrollments) {
                uniqueStudents.add(enrollment.getStudent().getId());
            }
            List<ProjectSubmission> submissions = projectSubmissionRepo.findByProjectId(course.getId());
            for (ProjectSubmission sub : submissions) {
                if ("SUBMITTED".equals(sub.getStatus())) {
                    pendingReviews++;
                }
            }
        }

        List<MentorSession> sessions = mentorSessionRepo.findByTrainerIdOrderByStartTimeAsc(trainer.getId());

        // Average Rating
        Double avgRating = 5.0; // default
        // We can load reviews from DB
        List<MentorReview> reviews = mentorReviewRepo.findAll();
        long trainerReviewsCount = 0;
        double sumRating = 0;
        for (MentorReview review : reviews) {
            if (review.getTrainer().getId().equals(trainer.getId())) {
                trainerReviewsCount++;
                sumRating += review.getRating();
            }
        }
        if (trainerReviewsCount > 0) {
            avgRating = sumRating / trainerReviewsCount;
        }

        return TrainerDashboardResponseDTO.builder()
                .totalCourses(totalCourses)
                .activeStudents((long) uniqueStudents.size())
                .pendingReviewsCount(pendingReviews)
                .averageRating(avgRating)
                .upcomingSessions(sessions)
                .courses(courses)
                .build();
    }

    // 2. Courses
    public List<Courses> getCourses(Principal principal) {
        Users trainer = getTrainer(principal);
        return courseRepo.findByTrainer(trainer);
    }

    @Transactional
    public Courses createCourse(Courses course, Principal principal) {
        Users trainer = getTrainer(principal);
        course.setTrainer(trainer);
        return courseRepo.save(course);
    }

    @Transactional
    public Lessons addLesson(Long courseId, Lessons lesson, Principal principal) {
        Courses course = courseRepo.findByIdAndTrainerUsername(courseId, principal.getName())
                .orElseThrow(() -> new RuntimeException("Course not found or unauthorized"));

        long currentCount = lessonRepo.countByCourse(course);
        lesson.setCourse(course);
        lesson.setSequence((int) (currentCount + 1));
        return lessonRepo.save(lesson);
    }

    // 3. Capstones Review
    public List<ProjectSubmission> getPendingSubmissions(Principal principal) {
        Users trainer = getTrainer(principal);
        List<Courses> courses = courseRepo.findByTrainer(trainer);
        List<ProjectSubmission> pending = new ArrayList<>();

        for (Courses course : courses) {
            List<ProjectSubmission> submissions = projectSubmissionRepo.findByProjectId(course.getId());
            for (ProjectSubmission sub : submissions) {
                if ("SUBMITTED".equals(sub.getStatus())) {
                    pending.add(sub);
                }
            }
        }
        return pending;
    }

    @Transactional
    public MentorReview gradeSubmission(Long submissionId, String status, String feedback, Integer rating, Principal principal) {
        Users trainer = getTrainer(principal);
        ProjectSubmission submission = projectSubmissionRepo.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        // Verify trainer owns course
        if (!submission.getProject().getCourse().getTrainer().getId().equals(trainer.getId())) {
            throw new RuntimeException("Unauthorized to grade this submission");
        }

        // Save review
        MentorReview review = MentorReview.builder()
                .submission(submission)
                .trainer(trainer)
                .rating(rating)
                .feedback(feedback)
                .reviewedAt(LocalDateTime.now())
                .build();
        mentorReviewRepo.save(review);

        // Update submission status
        submission.setStatus(status); // APPROVED or REJECTED
        projectSubmissionRepo.save(submission);

        // Award student XP and notify
        Users student = submission.getStudent();
        if ("APPROVED".equals(status)) {
            // Award +100 XP
            studentXpRepo.save(StudentXp.builder()
                    .student(student)
                    .activity("Project Approved: " + submission.getProject().getTitle())
                    .xp(100)
                    .earnedAt(LocalDateTime.now())
                    .build());

            Integer totalXp = studentXpRepo.sumXpByStudentId(student.getId());
            student.setXp(totalXp);
            userRepo.save(student);

            // Send notification
            notificationRepo.save(Notification.builder()
                    .user(student)
                    .title("Capstone Approved! 🎉")
                    .message("Your capstone project '" + submission.getProject().getTitle() + "' has been approved by " + trainer.getUsername() + "!")
                    .type("REVIEW")
                    .build());
        } else {
            // Send rejection notification
            notificationRepo.save(Notification.builder()
                    .user(student)
                    .title("Capstone Needs Changes ⚠️")
                    .message("Your capstone project '" + submission.getProject().getTitle() + "' needs updates. Feedback: " + feedback)
                    .type("REVIEW")
                    .build());
        }

        return review;
    }

    // 4. Appointments
    public List<MentorSession> getSessions(Principal principal) {
        Users trainer = getTrainer(principal);
        return mentorSessionRepo.findByTrainerIdOrderByStartTimeAsc(trainer.getId());
    }

    // Helpers
    private Users getTrainer(Principal principal) {
        return userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
    }
}
