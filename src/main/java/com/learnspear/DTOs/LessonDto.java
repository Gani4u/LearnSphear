package com.learnspear.DTOs;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDTO {
    private Long id;
    private String title;
    private String videoUrl;
    private String resourcesUrl;
    private Integer duration;
    private String lessonType;
    private Boolean isPreview;
    private Integer sequence;
    private Long sectionId;
    private String description;
}
