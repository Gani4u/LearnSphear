package com.learnspear.DTOs;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentDTO {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private String title;
    private String description;
    private Integer deadlineDays;
    private Integer maxMarks;
    private String fileUrl;
    private LocalDateTime createdAt;
    // For student view
    private String submissionStatus;
    private Integer grade;
    private String feedback;
}
