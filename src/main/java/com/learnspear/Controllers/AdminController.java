package com.learnspear.Controllers;

import com.learnspear.DTOs.AdminDashboardResponseDTO;
import com.learnspear.Service.AdminService;
import com.learnspear.entites.Users;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminController {

    private final AdminService adminService;

    // 1. Get Dashboard Analytics & Users Feed
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponseDTO> getAdminDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    // 2. Approve Instructor/Trainer
    @PostMapping("/trainers/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Users> approveTrainer(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveTrainer(id));
    }

    // 3. Toggle User Status (Suspend/Unsuspend)
    @PostMapping("/users/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Users> toggleUserApproval(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserApproval(id));
    }
}
