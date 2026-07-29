package com.learnspear.DTOs;

import lombok.Data;

@Data
public class MentorSessionRequest {
    private Long trainerId;
    private Long courseId;
    private String startTime; // ISO Date String, parsed on backend
    private String endTime;   // ISO Date String
}
