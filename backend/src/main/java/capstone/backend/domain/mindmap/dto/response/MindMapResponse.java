package capstone.backend.domain.mindmap.dto.response;

import capstone.backend.domain.mindmap.entity.Edge;
import capstone.backend.domain.mindmap.entity.MindMap;
import capstone.backend.domain.mindmap.entity.Node;
import capstone.backend.domain.mindmap.entity.NodeData;
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
        NodeData data,
        PositionResponse position,
        MeasuredResponse measured
    ) {
        public static NodeResponse fromEntity(Node node){
            return new NodeResponse(
                node.getId(),
                node.getType().name(),
                node.getData(),
                new PositionResponse(node.getPosition().getX(), node.getPosition().getY()),
                new MeasuredResponse(node.getMeasured().getWidth(), node.getMeasured().getHeight())
            );
        }
        public record PositionResponse(int x, int y){}
        public record MeasuredResponse(int width, int height){}
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