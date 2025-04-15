package capstone.backend.domain.mindmap.dto.response;

import capstone.backend.domain.mindmap.entity.Edge;
import capstone.backend.domain.mindmap.entity.MindMap;
import capstone.backend.domain.mindmap.entity.Node;
import capstone.backend.domain.mindmap.exception.NodeNotFoundException;
import java.util.Optional;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.List;

public record MindMapResponse(
    Long id,
    String title,
    String type,
    LocalDateTime lastModifiedAt,
    List<NodeResponse> nodes,
    List<EdgeResponse> edges
) {
    public record NodeResponse(
        String id,
        String type,
        String question,
        String answer,
        String summary,
        int depth,
        List<String> recommendedQuestions,
        int x,
        int y,
        int width,
        int height
    ) {
        public static NodeResponse fromEntity(Node node){
            return new NodeResponse(
                node.getId(),
                node.getType().name(),
                node.getData().getQuestion(),
                node.getData().getAnswer(),
                node.getData().getSummary(),
                node.getData().getDepth(),
                node.getData().getRecommendedQuestions(),
                node.getPosition().getX(),
                node.getPosition().getY(),
                node.getMeasured().getWidth(),
                node.getMeasured().getHeight()
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
            .orElseThrow(NodeNotFoundException::new)
            .stream()
            .map(NodeResponse::fromEntity)
            .toList();

        List<EdgeResponse> edgeResponses = Optional.ofNullable(mindMap.getEdges())
            .orElse(List.of())
            .stream()
            .map(EdgeResponse::fromEntity)
            .toList();

        return new MindMapResponse(
            mindMap.getId(),
            mindMap.getTitle(),
            mindMap.getType().name(),
            mindMap.getLastModifiedAt(),
            nodeResponses,
            edgeResponses
        );
    }
}