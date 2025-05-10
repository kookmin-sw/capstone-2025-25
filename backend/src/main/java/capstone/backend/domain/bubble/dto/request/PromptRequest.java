package capstone.backend.domain.bubble.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record PromptRequest(
        @NotBlank(message = "프롬프트를 입력해주세요.")
        @Schema(description = "사용자가 입력한 프롬프트", example = "하 오늘 캡스톤 개발해야되는데 운동도 가야되는데")
        String text
) {}
