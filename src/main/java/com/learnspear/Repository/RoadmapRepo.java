package com.learnspear.Repository;

import com.learnspear.entites.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoadmapRepo extends JpaRepository<Roadmap, Long> {
}
