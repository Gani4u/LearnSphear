package com.learnspear.Repository;

import com.learnspear.entites.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<Users, Long> {
    Optional<Users> findByUsername(String username);
    long countByRole(com.learnspear.Enums.Role role);
    java.util.List<Users> findByRole(com.learnspear.Enums.Role role);
    java.util.List<Users> findByRoleAndApproved(com.learnspear.Enums.Role role, Boolean approved);
}
