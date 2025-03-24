package capstone.backend.domain.mindmap.dto.response;

import capstone.backend.domain.mindmap.entity.MindMap;
import lombok.Builder;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record MindMapResponse(
    Long id,
    int order_index,
    Long memberId,
    LocalDate toDoDate,
    String title,
    String description,
    LocalDateTime lastModifiedAt,
    String type,
    List<NodeResponse> nodes,
    List<EdgeResponse> edges
) {
    public record NodeResponse(
        String id,
        String parentId,
        String type,
        String question,
        String answer,
        String summary,
        int depth,
        List<String> recommendedQuestions,
        int x,
        int y
    ) {}

    public record EdgeResponse(
        String id,
        String source,
        String target
    ) {}

    @Builder
    public static MindMapResponse fromEntity(MindMap mindMap) {
        return new MindMapResponse(
            mindMap.getMindmapId(),
            mindMap.getOrderIndex(),
            mindMap.getMemberId(),
            mindMap.getToDoDate(),
            mindMap.getTitle(),
            mindMap.getDescription(),
            mindMap.getLastModifiedAt(),
            mindMap.getType().name(),
            null,
            null
        );
    }
}