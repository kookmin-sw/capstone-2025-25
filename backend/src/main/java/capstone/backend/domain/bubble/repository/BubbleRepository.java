package capstone.backend.domain.bubble.repository;


import capstone.backend.domain.bubble.entity.Bubble;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BubbleRepository extends JpaRepository<Bubble, Long> {
    List<Bubble> findAllByMemberId(Long memberId);
    Optional<Bubble> findByMemberIdAndId(Long memberId, Long id);
    List<Bubble> findAllByMemberIdAndIdIn(Long memberId, List<Long> ids);
}
