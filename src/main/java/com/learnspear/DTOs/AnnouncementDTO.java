package com.learnspear.DTOs;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementDTO {
    private Long id;
    private String title;
    private String message;
    private String type;
    private String createdBy;
    private LocalDateTime createdAt;
}
