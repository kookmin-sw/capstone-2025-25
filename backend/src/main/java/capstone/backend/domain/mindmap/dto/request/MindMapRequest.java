package capstone.backend.domain.mindmap.dto.request;

import capstone.backend.domain.mindmap.entity.Edge;
import capstone.backend.domain.common.entity.TaskType;
import capstone.backend.domain.mindmap.entity.Node;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record MindMapRequest(
    @Schema(description = "아이젠하워 아이디")
    Long eisenhowerId,

    @Schema(description = "마인드맵 제목")
    @NotBlank(message = "제목을 입력해주세요.")
    String title,

    @Schema(description = "마인드맵 타입(TODO, THINKING)")
    @NotNull(message = "타입을 입력해주세요.")
    TaskType type,

    @Schema(description = "마인드맵 노드 정보")
    @NotEmpty(message = "노드 정보를 입력해주세요.")
    List<Node> nodes,

    @Schema(description = "마인드맵 엣지 정보")
    List<Edge> edges
) {}
