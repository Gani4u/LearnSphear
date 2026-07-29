package com.learnspear.Repository;

import com.learnspear.entites.BadgeMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BadgeMasterRepo extends JpaRepository<BadgeMaster, Long> {
}
