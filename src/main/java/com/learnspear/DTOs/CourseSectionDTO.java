package com.learnspear.DTOs;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseSectionDTO {
    private Long id;
    private String title;
    private Integer sequence;
    private List<LessonDTO> lessons;
}
