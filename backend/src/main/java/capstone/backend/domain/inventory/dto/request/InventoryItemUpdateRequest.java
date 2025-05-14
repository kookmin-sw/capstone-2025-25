package capstone.backend.domain.inventory.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record InventoryItemUpdateRequest(
    @NotBlank(message = "제목은 비어있으면 안됩니다.")
    @Schema(description = "수정할 보관함 아이템 제목", example = "업데이트된 제목")
    String title,

    @Size(max = 255, message = "메모는 최대 255자까지 입력 가능합니다.")
    @Schema(description = "수정할 보관함 아이템 메모", example = "업데이트된 메모")
    String memo
) {}

