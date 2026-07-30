package com.learnspear.entites;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "courses")
public class Courses {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 400)
    private String subtitle;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "banner_url")
    private String bannerUrl;

    @Column(length = 50)
    @Builder.Default
    private String level = "Beginner";

    @Column(length = 100)
    @Builder.Default
    private String category = "General";

    @Builder.Default
    private Integer duration = 0;

    @Column(length = 50)
    @Builder.Default
    private String language = "English";

    @Builder.Default
    private Double price = 0.0;

    @Builder.Default
    private Double discount = 0.0;

    @Column(length = 50)
    @Builder.Default
    private String status = "DRAFT"; // DRAFT, PENDING, PUBLISHED, REJECTED, ARCHIVED

    private Long roadmapId;

    @Column(length = 500)
    private String tags;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String outcomes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    private Users trainer;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<CourseSection> sections = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Lessons> lessons = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @JsonIgnore
    @Builder.Default
    private List<Enrollment> enrolledStudent = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @JsonIgnore
    @Builder.Default
    private List<Assignment> assignments = new ArrayList<>();
}
