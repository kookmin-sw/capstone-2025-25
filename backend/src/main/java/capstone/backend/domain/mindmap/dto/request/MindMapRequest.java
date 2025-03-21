package capstone.backend.domain.mindmap.dto.request;

import capstone.backend.domain.mindmap.entity.MindMapType;
import capstone.backend.domain.mindmap.entity.Node;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record MindMapRequest(
    Integer orderIndex,
    @NotNull MindMapType type,
    @NotNull LocalDate toDoDate,
    @NotBlank String title,
    @NotNull Long memberId,
    List<Node> nodes
) {}