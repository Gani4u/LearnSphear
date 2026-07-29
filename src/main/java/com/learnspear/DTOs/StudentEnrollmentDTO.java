package com.learnspear.DTOs;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentEnrollmentDTO {
    private Long enrollmentId;
    private Long courseId;
    private String courseTitle;
    private String courseSubtitle;
    private String thumbnailUrl;
    private String imageUrl;
    private String trainerName;
    private Integer progressPercentage;
    private Boolean completed;
    private Boolean certificateGenerated;
    private LocalDateTime enrollmentDate;
    private LocalDateTime lastAccessedAt;
    private Integer totalLessons;
    private Integer completedLessons;
    private String level;
    private String category;
}
