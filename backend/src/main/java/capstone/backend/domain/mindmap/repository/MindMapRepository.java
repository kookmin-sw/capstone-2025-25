package capstone.backend.domain.mindmap.repository;

import capstone.backend.domain.mindmap.entity.MindMap;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MindMapRepository extends JpaRepository<MindMap, Long> {
    List<MindMap> findByEisenhowerIdIsNotNullOrderByLastModifiedAtDesc();
    List<MindMap> findByEisenhowerIdIsNullOrderByLastModifiedAtDesc();
}
