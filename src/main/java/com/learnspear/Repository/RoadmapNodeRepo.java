package com.learnspear.Repository;

import com.learnspear.entites.RoadmapNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoadmapNodeRepo extends JpaRepository<RoadmapNode, Long> {
    List<RoadmapNode> findByRoadmapIdOrderByOrderNoAsc(Long roadmapId);
}
