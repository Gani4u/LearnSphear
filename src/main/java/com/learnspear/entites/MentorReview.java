package com.learnspear.entites;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "mentor_review")
public class MentorReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private ProjectSubmission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    private Users trainer;

    @Builder.Default
    private Integer rating = 5;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "reviewed_at")
    @Builder.Default
    private LocalDateTime reviewedAt = LocalDateTime.now();
}
