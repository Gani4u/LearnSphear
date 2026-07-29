package com.learnspear.DTOs;

import com.learnspear.entites.MentorSession;
import com.learnspear.entites.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponseDTO {
    private Integer xp;
    private Integer streak;
    private Long enrolledCoursesCount;
    private Long completedCoursesCount;
    private List<Notification> notifications;
    private List<MentorSession> upcomingSessions;
    private Integer dailyGoal; // in percentage, e.g. 60%
    private EnrollmentResponseDTO lastActiveEnrollment;
}
