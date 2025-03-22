package capstone.backend.domain.mindmap.repository;

import capstone.backend.domain.mindmap.entity.MindMap;
import capstone.backend.domain.mindmap.entity.MindMapType;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MindMapRepository extends JpaRepository<MindMap, Long> {
    List<MindMap> findAllByToDoDateAndTypeOrderByOrderIndexAsc(
        LocalDate date,
        MindMapType type);
}
