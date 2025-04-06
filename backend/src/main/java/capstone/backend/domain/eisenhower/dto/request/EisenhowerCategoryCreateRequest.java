package capstone.backend.domain.eisenhower.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EisenhowerCategoryCreateRequest(
        @NotNull
        @Size(max = 10, message = "제목은 최대 10자까지 입력 가능합니다.")
        @Schema(description = "카테고리 제목", example = "중요한 일")
        String title,

        @Pattern(regexp = "^#[A-Fa-f0-9]{6}$", message = "컬러는 HEX 색상코드 형식이어야 합니다.")
        @Schema(description = "카테고리 색상 (HEX)", example = "#FF0000")
        @NotNull
        String color
) {
}
