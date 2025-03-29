package capstone.backend.domain.mindmap.dto.response;

import capstone.backend.domain.mindmap.entity.MindMap;
import java.time.LocalDateTime;

public record MindMapListResponse(
   Long id,
   String title,
   String type,
   LocalDateTime lastModifiedAt
){
    public static MindMapListResponse fromEntity(MindMap mindMap){
        return new MindMapListResponse(
            mindMap.getId(),
            mindMap.getTitle(),
            mindMap.getType().name(),
            mindMap.getLastModifiedAt()
        );
    }
}
