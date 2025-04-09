package capstone.backend.domain.eisenhower.repository;

import capstone.backend.domain.eisenhower.entity.EisenhowerCategory;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EisenhowerCategoryRepository extends JpaRepository<EisenhowerCategory, Long> {
    Optional<EisenhowerCategory> findByIdAndMemberId(Long categoryId, Long memberId);
    Optional<List<EisenhowerCategory>> findAllByMemberId(Long memberId);
}
