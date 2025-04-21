package com.learnspear.DTOs;

import lombok.*;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDto {
    private String title;
    private String content;
    private Integer sequence;
}
