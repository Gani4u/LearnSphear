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
@Table(name = "certificates",
    uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id"}))
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Users student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Courses course;

    @Column(name = "issued_at")
    @Builder.Default
    private LocalDateTime issuedAt = LocalDateTime.now();

    @Column(name = "certificate_url")
    private String certificateUrl;
}
