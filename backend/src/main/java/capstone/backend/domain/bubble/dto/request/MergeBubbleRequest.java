package capstone.backend.domain.bubble.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record MergeBubbleRequest(
    @NotNull
    @Schema(description = "병합할 버블 리스트", example = "[1, 2]")
    List<Long> bubbleList,

    @NotBlank
    @Schema(description = "생성할 버블 텍스트", example = "점심에 밥 먹고 양치하기")
    String mergedTitle
) {
}
