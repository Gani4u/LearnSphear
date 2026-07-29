package com.learnspear.DTOs;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateDTO {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private String trainerName;
    private LocalDateTime issuedAt;
    private String certificateUrl;
    private String studentName;
}
