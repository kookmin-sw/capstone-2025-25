package capstone.backend.domain.eisenhower.dto.request;

import capstone.backend.domain.eisenhower.entity.EisenhowerQuadrant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record EisenhowerItemCreateRequest(
        @NotBlank(message = "제목은 필수이며, 공백일 수 없습니다.")
        @Schema(description = "아이템 제목", example = "운동하기")
        String title,

        @Schema(description = "카테고리 ID (없으면 null)", example = "3")
        Long categoryId,

        @Schema(description = "마감일 (yyyy-MM-dd)", example = "2025-04-30")
        LocalDate dueDate,

        @NotNull(message = "사분면(quadrant)은 필수입니다.")
        @Schema(description = "아이젠하워 사분면", example = "Q1")
        EisenhowerQuadrant quadrant,

        @NotNull(message = "정렬 순서(order)는 필수입니다.")
        @Schema(description = "정렬 순서 (작은 값일수록 우선)", example = "1")
        Long order,

        @Schema(description = "메모", example = "운동은 어려워!")
        String memo
) {
}
