package capstone.backend.domain.mindmap.repository;

import capstone.backend.domain.mindmap.entity.MindMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MindMapRepository extends JpaRepository<MindMap, Long> {
}
