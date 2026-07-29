package com.learnspear.DTOs;

import lombok.Data;

@Data
public class ProjectSubmissionRequest {
    private String githubUrl;
    private String liveDemo;
    private String notes;
}
