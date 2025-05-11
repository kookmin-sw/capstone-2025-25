package capstone.backend.domain.todayTask.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record TodayTaskUpdateRequest(
    @NotNull
    @Schema(description = "할 일 완료 여부", example = "true")
    Boolean isCompleted
) {
}
