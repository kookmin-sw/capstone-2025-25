package capstone.backend.domain.eisenhower.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import capstone.backend.domain.common.entity.TaskType;
import java.time.LocalDate;

public record EisenhowerItemUpdateRequest(
        @Size(max = 20, message = "제목은 최대 20자까지 입력 가능합니다.")
        @Schema(description = "할 일 제목", example = "운동하기")
        String title,

        @Schema(description = "작업 타입", example = "TODO")
        TaskType type,

        @Schema(description = "카테고리 ID (null이면 변경 없음)", example = "3")
        Long categoryId,

        @Schema(description = "마감일 (null이면 변경 없음)", example = "2025-04-30")
        LocalDate dueDate,

        @Size(max = 255, message = "메모는 최대 255자까지 입력 가능합니다.")
        @Schema(description = "메모", example = "아침에 30분 조깅")
        String memo,

        @Schema(description = "완료 여부", example = "true")
        Boolean isCompleted,

        @Schema(description = "마감일을 명시적으로 null로 설정할지 여부, null로 바꾸고 싶을때는 true로 설정", example = "false")
        Boolean dueDateExplicitlyNull,

        @Schema(description = "카테고리를 명시적으로 null로 설정할지 여부, null로 바꾸고 싶을때는 true로 설정", example = "false")
        Boolean categoryExplicitlyNull
) {
}
