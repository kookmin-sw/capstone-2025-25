package capstone.backend.domain.bubble.repository;


import capstone.backend.domain.bubble.entity.Bubble;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BubbleRepository extends JpaRepository<Bubble, Long> {
    List<Bubble> findAllByMemberId(Long memberId);
}
