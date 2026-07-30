package com.learnspear.DTOs;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseReviewDTO {
    private Long id;
    private Long courseId;
    private Long studentId;
    private String studentUsername;
    private Integer rating;
    private String reviewText;
    private LocalDateTime createdAt;
}
