package com.learnspear.DTOs;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainerCourseDetailDTO {
    private Long id;
    private String title;
    private String subtitle;
    private String description;
    private String imageUrl;
    private String thumbnailUrl;
    private String bannerUrl;
    private String level;
    private String category;
    private String language;
    private Double price;
    private Double discount;
    private String status;
    private String tags;
    private String requirements;
    private String outcomes;
    private Integer totalStudents;
    private Integer totalLessons;
    private Double averageRating;
    private Long reviewCount;
    private List<CourseSectionDTO> sections;
}
