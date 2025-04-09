package capstone.backend.domain.eisenhower.repository;

import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EisenhowerItemRepository extends JpaRepository<EisenhowerItem, Long>, EisenhowerItemRepositoryCustom {
    List<EisenhowerItem> findAllByMemberIdAndIsCompletedFalse(Long memberId);

    List<EisenhowerItem> findAllByMemberIdAndIsCompletedTrue(Long memberId);

    Optional<EisenhowerItem> findByIdAndMemberId(Long itemId, Long memberId);

    Page<EisenhowerItem> findByMemberIdAndTitleContaining(Long memberId, String keyword, Pageable pageable);
}
