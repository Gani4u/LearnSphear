package com.learnspear.DTOs;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private List<LessonDto> lessons;
}
