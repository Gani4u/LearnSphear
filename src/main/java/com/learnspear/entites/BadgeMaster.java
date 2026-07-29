package com.learnspear.entites;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "badge_master")
public class BadgeMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false, length = 100)
    private String icon;

    @Column(name = "xp_required")
    @Builder.Default
    private Integer xpRequired = 100;
}
