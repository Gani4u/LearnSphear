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
@Table(name = "student_xp")
public class StudentXp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Users student;

    @Column(nullable = false)
    private String activity;

    @Column(nullable = false)
    private Integer xp;

    @Column(name = "earned_at")
    @Builder.Default
    private LocalDateTime earnedAt = LocalDateTime.now();
}
