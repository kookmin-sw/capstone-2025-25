package capstone.backend.domain.mindmap.dto.response;

import capstone.backend.domain.mindmap.entity.Edge;
import capstone.backend.domain.mindmap.entity.MindMap;
import capstone.backend.domain.mindmap.entity.Node;
import capstone.backend.domain.mindmap.exception.NodeNotFoundException;
import java.util.Optional;
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
    ) {
        public static NodeResponse fromEntity(Node node){
            return new NodeResponse(
                node.getId(),
                node.getParentId(),
                node.getType().name(),
                node.getData().getQuestion(),
                node.getData().getAnswer(),
                node.getData().getSummary(),
                node.getData().getDepth(),
                node.getData().getRecommendedQuestions(),
                node.getPosition().getX(),
                node.getPosition().getY()
            );
        }
    }

    public record EdgeResponse(
        String id,
        String source,
        String target
    ) {
        public static EdgeResponse fromEntity(Edge edge){
            return new EdgeResponse(
                edge.getId(),
                edge.getSource(),
                edge.getTarget()
            );
        }
    }

    @Builder
    public static MindMapResponse fromEntity(MindMap mindMap) {
        List<NodeResponse> nodeResponses = Optional.ofNullable(mindMap.getNodes())
            .filter(list -> !list.isEmpty())
            .orElseThrow(() -> new NodeNotFoundException(mindMap.getMindmapId())) //node 없는 예외 만들기
            .stream()
            .map(NodeResponse::fromEntity)
            .toList();

        List<EdgeResponse> edgeResponses = Optional.ofNullable(mindMap.getEdges())
            .orElse(List.of())
            .stream()
            .map(EdgeResponse::fromEntity)
            .toList();

        return new MindMapResponse(
            mindMap.getMindmapId(),
            mindMap.getOrderIndex(),
            mindMap.getMemberId(),
            mindMap.getToDoDate(),
            mindMap.getTitle(),
            mindMap.getDescription(),
            mindMap.getLastModifiedAt(),
            mindMap.getType().name(),
            nodeResponses,
            edgeResponses
        );
    }
}