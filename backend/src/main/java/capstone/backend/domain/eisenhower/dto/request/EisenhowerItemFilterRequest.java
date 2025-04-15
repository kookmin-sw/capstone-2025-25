package capstone.backend.domain.eisenhower.dto.request;

import capstone.backend.domain.common.entity.TaskType;
import capstone.backend.domain.eisenhower.entity.EisenhowerQuadrant;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

public record EisenhowerItemFilterRequest(
        @Schema(description = "완료 여부 필터 (true: 완료, false: 미완료, null: 전체)")
        Boolean completed,

        @Schema(description = "마감일 기준 필터")
        LocalDate dueDate,

        @Schema(description = "카테고리 ID 필터")
        Long categoryId,

        TaskType type,

        EisenhowerQuadrant quadrant
) {
}
