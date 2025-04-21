package com.learnspear.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class EnrollmentResponseDTO {
    private Long id;
    private LocalDateTime enrollmentDate;
    private CourseResponseDTO course;
    //private Users student;
}
