package capstone.backend.domain.mindmap.repository;

import capstone.backend.domain.mindmap.entity.MindMap;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MindMapRepository extends JpaRepository<MindMap, Long> {
    Optional<MindMap> findByIdAndMemberId(Long id, Long memberId);

    @Query("""
            SELECT m, e
            FROM MindMap m
            LEFT JOIN EisenhowerItem e ON e.mindMap.id = m.id
            WHERE m.member.id = :memberId
            ORDER BY m.lastModifiedAt DESC
        """)
    List<Object[]> findMindMapWithEisenhowerByMemberId(@Param("memberId") Long memberId);
}
