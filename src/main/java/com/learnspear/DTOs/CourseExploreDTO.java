package com.learnspear.DTOs;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseExploreDTO {
    private Long id;
    private String title;
    private String subtitle;
    private String description;
    private String imageUrl;
    private String thumbnailUrl;
    private String level;
    private String category;
    private String language;
    private Double price;
    private Double discount;
    private String tags;
    private String status;
    private String trainerName;
    private Long trainerId;
    private Integer totalLessons;
    private Integer totalDuration;
    private Double averageRating;
    private Long reviewCount;
    private Long enrolledCount;
    private Boolean isEnrolled;
    private Boolean isWishlisted;
    private List<CourseSectionDTO> sections;
}
