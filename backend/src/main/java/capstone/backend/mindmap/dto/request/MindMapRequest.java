package capstone.backend.mindmap.dto.request;

import capstone.backend.mindmap.entity.MindMapType;
import capstone.backend.mindmap.entity.Node;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;

@Builder
public record MindMapRequest(
    int orderIndex,
    @NotNull MindMapType type,
    @NotNull LocalDate toDoDate,
    @NotNull String title,
    @NotNull Long memberId,
    List<Node> nodes
) {}