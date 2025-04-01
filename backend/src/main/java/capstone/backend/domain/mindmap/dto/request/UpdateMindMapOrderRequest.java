package capstone.backend.domain.mindmap.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record UpdateMindMapOrderRequest(
    @NotNull LocalDate toDoDate,
    @NotEmpty List<MindMapOrder> orderList
) {
    public record MindMapOrder(
        @NotNull Long mindMapId,
        @NotNull Integer orderIndex
    ) {}
}