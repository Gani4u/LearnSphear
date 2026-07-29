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

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

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

    @Column(length = 50)
    @Builder.Default
    private String status = "PUBLISHED";

    private Long roadmapId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    private Users trainer;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Lessons> lessons = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @JsonIgnore
    @Builder.Default
    private List<Enrollment> enrolledStudent = new ArrayList<>();
}
