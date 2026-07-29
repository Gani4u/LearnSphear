package com.learnspear.Service;

import com.learnspear.Repository.*;
import com.learnspear.entites.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final UserRepo userRepo;
    private final CourseRepo courseRepo;
    private final QuizRepo quizRepo;
    private final QuizQuestionRepo quizQuestionRepo;
    private final StudentQuizProgressRepo studentQuizProgressRepo;
    private final StudentXpRepo studentXpRepo;
    private final NotificationRepo notificationRepo;

    @PostConstruct
    @Transactional
    public void seedDefaultQuizzes() {
        if (quizRepo.count() == 0) {
            List<Courses> courses = courseRepo.findAll();
            for (Courses course : courses) {
                Quiz midterm = Quiz.builder()
                        .course(course)
                        .title("Midterm Assessment for " + course.getTitle())
                        .description("Test your base knowledge of course concepts. Needs 60% to pass.")
                        .build();
                quizRepo.save(midterm);

                quizQuestionRepo.save(QuizQuestion.builder()
                        .quiz(midterm)
                        .questionText("Which of the following is a primary coding pillar of OOP?")
                        .optionA("Compilation")
                        .optionB("Inheritance")
                        .optionC("Paging")
                        .optionD("Linking")
                        .correctOption("B")
                        .build());

                quizQuestionRepo.save(QuizQuestion.builder()
                        .quiz(midterm)
                        .questionText("Which tool is typically used to compile program files in this track?")
                        .optionA("Pipelining")
                        .optionB("Compiler Wrapper")
                        .optionC("Javac/GCC/Interpreter")
                        .optionD("Linker")
                        .correctOption("C")
                        .build());

                quizQuestionRepo.save(QuizQuestion.builder()
                        .quiz(midterm)
                        .questionText("What does database normalization optimize for?")
                        .optionA("Increasing redundancy")
                        .optionB("Minimizing redundant datasets")
                        .optionC("Maximizing disk storage usage")
                        .optionD("Deleting indexes")
                        .correctOption("B")
                        .build());
            }
        }
    }

    public List<Quiz> getQuizzesForCourse(Long courseId) {
        return quizRepo.findByCourseId(courseId);
    }

    public List<QuizQuestion> getQuestionsForQuiz(Long quizId) {
        // Return questions. (Note: In production, you would map to a DTO to hide correctOption)
        return quizQuestionRepo.findByQuizId(quizId);
    }

    @Transactional
    public Map<String, Object> submitQuiz(Long quizId, Map<Long, String> studentAnswers, Principal principal) {
        Users student = userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        List<QuizQuestion> questions = quizQuestionRepo.findByQuizId(quizId);
        if (questions.isEmpty()) {
            throw new RuntimeException("No questions configured for this quiz");
        }

        int correctCount = 0;
        for (QuizQuestion question : questions) {
            String studentAns = studentAnswers.get(question.getId());
            if (studentAns != null && studentAns.trim().equalsIgnoreCase(question.getCorrectOption())) {
                correctCount++;
            }
        }

        int score = (correctCount * 100) / questions.size();
        boolean passed = score >= 60;

        // Check if student already passed this quiz
        Optional<StudentQuizProgress> existing = studentQuizProgressRepo.findByStudentIdAndQuizId(student.getId(), quizId);
        boolean previouslyPassed = existing.isPresent() && existing.get().getPassed();

        StudentQuizProgress progress;
        if (existing.isPresent()) {
            progress = existing.get();
            progress.setScore(score);
            progress.setPassed(passed);
            progress.setCompletedAt(LocalDateTime.now());
        } else {
            progress = StudentQuizProgress.builder()
                    .student(student)
                    .quiz(quiz)
                    .score(score)
                    .passed(passed)
                    .completedAt(LocalDateTime.now())
                    .build();
        }
        studentQuizProgressRepo.save(progress);

        // Award +50 XP if passed for the first time
        if (passed && !previouslyPassed) {
            studentXpRepo.save(StudentXp.builder()
                    .student(student)
                    .activity("Passed Quiz: " + quiz.getTitle())
                    .xp(50)
                    .earnedAt(LocalDateTime.now())
                    .build());

            Integer totalXp = studentXpRepo.sumXpByStudentId(student.getId());
            student.setXp(totalXp);
            userRepo.save(student);

            // Notify Student
            notificationRepo.save(Notification.builder()
                    .user(student)
                    .title("Quiz Passed! 🎯")
                    .message("You passed '" + quiz.getTitle() + "' with a score of " + score + "% and earned +50 XP!")
                    .type("LESSON")
                    .build());
        }

        Map<String, Object> results = new HashMap<>();
        results.putAll(Map.of(
                "score", score,
                "passed", passed,
                "correctCount", correctCount,
                "totalCount", questions.size()
        ));
        return results;
    }

    public List<StudentQuizProgress> getStudentProgress(Principal principal) {
        Users student = userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return studentQuizProgressRepo.findByStudentId(student.getId());
    }
}
