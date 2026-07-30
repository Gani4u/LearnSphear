package com.learnspear.DTOs;

import com.learnspear.entites.Users;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponseDTO {
    private Long totalUsers;
    private Long studentCount;
    private Long trainerCount;
    private Long pendingTrainersCount;
    private Long courseCount;
    private Long totalEnrollments;
    private Long totalCertificates;
    private List<Users> pendingTrainers;
    private List<Users> allUsers;
}
