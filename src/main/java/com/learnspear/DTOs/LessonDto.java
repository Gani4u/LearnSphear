package com.learnspear.DTOs;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDto {
    private Long id;
    private String title;
    private String content;
    private Integer sequence;
    private String videoUrl;
    private String resourcesUrl;
    private Integer duration;
    private String lessonType;
    private Boolean isPreview;
    private Long sectionId;
    private String description;
}
