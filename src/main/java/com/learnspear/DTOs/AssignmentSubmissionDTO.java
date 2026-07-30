package com.learnspear.DTOs;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentSubmissionDTO {
    private Long id;
    private Long assignmentId;
    private String assignmentTitle;
    private Long studentId;
    private String studentUsername;
    private String submissionText;
    private String fileUrl;
    private LocalDateTime submittedAt;
    private String status;
    private Integer grade;
    private String feedback;
    private LocalDateTime gradedAt;
}
