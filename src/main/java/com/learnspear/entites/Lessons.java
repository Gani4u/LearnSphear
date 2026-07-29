package com.learnspear.entites;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "lessons")
public class Lessons {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String content;

    @Column(name = "video_url")
    private String videoUrl;

    @Builder.Default
    private Integer duration = 0;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_preview")
    @Builder.Default
    private Boolean isPreview = false;

    @Column(name = "lesson_type", length = 50)
    @Builder.Default
    private String lessonType = "VIDEO";

    @Column(nullable = false)
    private Integer sequence;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    private Courses course;
}
