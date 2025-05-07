package capstone.backend.domain.bubble.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record ConfirmBubbleRequest(
        @NotBlank(message = "버블의 텍스트를 입력해주세요.")
        @Schema(description = "버블의 텍스트", example = "캡스톤 개발을 해야 한다.")
        String prompt
) {}
