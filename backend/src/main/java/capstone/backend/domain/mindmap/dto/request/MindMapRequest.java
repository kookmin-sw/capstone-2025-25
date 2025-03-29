package capstone.backend.domain.mindmap.dto.request;

import capstone.backend.domain.mindmap.entity.Edge;
import capstone.backend.domain.mindmap.entity.MindMapType;
import capstone.backend.domain.mindmap.entity.Node;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record MindMapRequest(
    @NotNull Long memberId,
    Long eisenhowerId,
    @NotBlank String title,
    @NotNull MindMapType type,
    @NotNull List<Node> nodes,
    List<Edge> edges
) {}