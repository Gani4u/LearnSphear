package com.learnspear.Repository;

import com.learnspear.entites.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnnouncementRepo extends JpaRepository<Announcement, Long> {
    List<Announcement> findAllByOrderByCreatedAtDesc();
    List<Announcement> findByTypeOrderByCreatedAtDesc(String type);
}
