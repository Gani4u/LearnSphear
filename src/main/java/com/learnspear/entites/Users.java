package com.learnspear.entites;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.learnspear.Enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Data
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 225)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false, updatable = false)
    private LocalDateTime created_at = LocalDateTime.now();

    @Column(length = 255)
    private String profile_image;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 255)
    private String linkedin_url;

    @Column(length = 255)
    private String github_url;

    @Column(length = 255)
    private String resume_url;

    @Column(columnDefinition = "integer default 0")
    private Integer xp = 0;

    @Column(columnDefinition = "integer default 0")
    private Integer streak = 0;

    private java.time.LocalDate last_learning_date;

    @Column(name = "approved", nullable = false)
    private Boolean approved = true;

    @OneToMany(mappedBy = "trainer", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Courses> courses;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Enrollment> enrollments;
}
