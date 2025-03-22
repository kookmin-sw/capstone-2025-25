package capstone.backend.domain.mindmap.dto.response;

import capstone.backend.domain.mindmap.entity.MindMap;
import lombok.Builder;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Builder
public record MindMapResponse(
    Long id,
    int order_index,
    Long memberId,
    LocalDate toDoDate,
    String title,
    int maxDepth,
    LocalDateTime lastModifiedAt,
    String type,
    List<NodeResponse> nodes,
    List<EdgeResponse> edges
) {
    @Builder
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

    @Builder
    public record EdgeResponse(
        String id,
        String source,
        String target
    ) {}

    @Builder
    public static MindMapResponse fromEntity(MindMap mindMap) {
        return MindMapResponse.builder()
            .id(mindMap.getMindmapId())
            .title(mindMap.getTitle())
            .order_index(mindMap.getOrderIndex())
            .memberId(mindMap.getMemberId())
            .toDoDate(mindMap.getToDoDate())
            .type(mindMap.getType().name())
            .lastModifiedAt(mindMap.getLastModifiedAt())
            .build();
    }
}