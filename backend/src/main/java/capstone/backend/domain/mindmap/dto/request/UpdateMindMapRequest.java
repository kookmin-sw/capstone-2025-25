package capstone.backend.domain.mindmap.dto.request;

import capstone.backend.domain.mindmap.entity.Edge;
import capstone.backend.domain.mindmap.entity.Node;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record UpdateMindMapRequest(
    @Schema(description = "마인드맵 노드 정보")
    @NotEmpty(message = "노드 정보를 입력해주세요.")
    List<Node> nodes,

    @Schema(description = "마인드맵 엣지 정보")
    List<Edge> edges
) { }
