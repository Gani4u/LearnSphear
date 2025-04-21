package com.learnspear.DTOs;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private MultipartFile image; // 👈 for file upload
}
