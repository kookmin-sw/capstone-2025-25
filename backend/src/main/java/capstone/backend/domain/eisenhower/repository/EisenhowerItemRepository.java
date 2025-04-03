package capstone.backend.domain.eisenhower.repository;

import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EisenhowerItemRepository extends JpaRepository<EisenhowerItem, Long> {
    List<EisenhowerItem> findAllByMemberIdAndIsCompletedFalse(Long memberId);

    List<EisenhowerItem> findAllByMemberIdAndIsCompletedTrue(Long memberId);
}
