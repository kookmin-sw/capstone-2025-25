package capstone.backend.domain.eisenhower.dto.request;

import capstone.backend.domain.eisenhower.entity.EisenhowerQuadrant;
import jakarta.validation.constraints.NotNull;

public record EisenhowerItemOrderUpdateRequest(
        @NotNull Long eisenhowerItemId,
        @NotNull EisenhowerQuadrant quadrant,
        @NotNull Long order
) {
}
