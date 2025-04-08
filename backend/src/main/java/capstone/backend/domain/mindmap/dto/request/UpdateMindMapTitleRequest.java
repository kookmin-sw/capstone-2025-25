package capstone.backend.domain.mindmap.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record UpdateMindMapTitleRequest (
    @Schema(description = "마인드맵 제목")
    @NotBlank(message = "제목을 입력해주세요.")
    String title
){}