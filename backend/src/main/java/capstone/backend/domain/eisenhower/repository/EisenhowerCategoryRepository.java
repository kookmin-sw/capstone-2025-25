package capstone.backend.domain.eisenhower.repository;

import capstone.backend.domain.eisenhower.entity.EisenhowerCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EisenhowerCategoryRepository extends JpaRepository<EisenhowerCategory, Long> {
}
