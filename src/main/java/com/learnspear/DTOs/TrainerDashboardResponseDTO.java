package com.learnspear.DTOs;

import com.learnspear.entites.Courses;
import com.learnspear.entites.MentorSession;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainerDashboardResponseDTO {
    private Long totalCourses;
    private Long activeStudents;
    private Long pendingReviewsCount;
    private Double averageRating;
    private List<MentorSession> upcomingSessions;
    private List<Courses> courses;
}
