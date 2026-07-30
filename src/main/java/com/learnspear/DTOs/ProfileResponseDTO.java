package com.learnspear.DTOs;

import com.learnspear.entites.BadgeMaster;
import com.learnspear.entites.ProjectSubmission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponseDTO {
    private String username;
    private String email;
    private String bio;
    private String profileImage;
    private String linkedinUrl;
    private String githubUrl;
    private String resumeUrl;
    private Integer xp;
    private Integer streak;
    private List<BadgeMaster> badges;
    private List<ProjectSubmission> completedProjects;
}
