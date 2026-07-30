package com.learnspear.entites;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "course_resources")
public class CourseResources {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lessons lesson;

    @Column(nullable = false)
    private String title;

    @Column(length = 50)
    @Builder.Default
    private String type = "PDF";

    @Column(name = "file_url", nullable = false)
    private String fileUrl;
}
