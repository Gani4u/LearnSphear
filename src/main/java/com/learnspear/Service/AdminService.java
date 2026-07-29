package com.learnspear.Service;

import com.learnspear.DTOs.AdminDashboardResponseDTO;
import com.learnspear.Enums.Role;
import com.learnspear.Repository.*;
import com.learnspear.entites.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepo userRepo;
    private final CourseRepo courseRepo;
    private final NotificationRepo notificationRepo;

    public AdminDashboardResponseDTO getDashboard() {
        long total = userRepo.count();
        long students = userRepo.countByRole(Role.STUDENT);
        long trainers = userRepo.countByRole(Role.TRAINER);
        long courses = courseRepo.count();

        List<Users> pendingTrainers = userRepo.findByRoleAndApproved(Role.TRAINER, false);
        List<Users> allUsers = userRepo.findAll();

        return AdminDashboardResponseDTO.builder()
                .totalUsers(total)
                .studentCount(students)
                .trainerCount(trainers)
                .pendingTrainersCount((long) pendingTrainers.size())
                .courseCount(courses)
                .pendingTrainers(pendingTrainers)
                .allUsers(allUsers)
                .build();
    }

    @Transactional
    public Users approveTrainer(Long trainerId) {
        Users trainer = userRepo.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        if (trainer.getRole() != Role.TRAINER) {
            throw new RuntimeException("User is not a Trainer");
        }

        trainer.setApproved(true);
        userRepo.save(trainer);

        // Notify trainer
        notificationRepo.save(Notification.builder()
                .user(trainer)
                .title("Profile Approved! 🚀")
                .message("Your instructor profile has been approved by the Admin. You can now build and publish courses!")
                .type("SYSTEM")
                .build());

        return trainer;
    }

    @Transactional
    public Users toggleUserApproval(Long userId) {
        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setApproved(!user.getApproved());
        return userRepo.save(user);
    }
}
