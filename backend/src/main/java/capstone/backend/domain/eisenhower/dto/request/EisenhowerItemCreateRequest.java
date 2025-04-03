package capstone.backend.domain.eisenhower.dto.request;

import capstone.backend.domain.common.entity.TaskType;
import capstone.backend.domain.eisenhower.entity.EisenhowerQuadrant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record EisenhowerItemCreateRequest(
        @NotBlank String title,
        Long categoryId,
        LocalDate dueDate,
        @NotNull EisenhowerQuadrant quadrant,
        @NotNull TaskType type,
        @NotNull Long order
) {
}
