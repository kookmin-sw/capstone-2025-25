package capstone.backend.domain.eisenhower.dto.request;

import capstone.backend.domain.eisenhower.entity.EisenhowerQuadrant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record EisenhowerItemOrderUpdateRequest(
        @NotNull(message = "아이젠하워 항목 ID는 필수입니다.")
        @Schema(description = "이동할 아이젠하워 항목의 ID", example = "1")
        Long eisenhowerItemId,

        @NotNull(message = "사분면(quadrant)은 필수입니다. 이전과 값이 바뀌지 않더라도 필수적으로 넣어줘야 합니다.")
        @Schema(description = "이동할 사분면", example = "Q1")
        EisenhowerQuadrant quadrant,

        @NotNull(message = "정렬 순서(order)는 필수입니다. 이전과 값이 바뀌지 않더라도 필수적으로 넣어줘야 합니다.")
        @Schema(description = "변경 후 정렬 순서 (작을수록 위)", example = "2")
        Long order
) {
}
