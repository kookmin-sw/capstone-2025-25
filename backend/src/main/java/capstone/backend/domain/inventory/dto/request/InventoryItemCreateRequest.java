package capstone.backend.domain.inventory.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record InventoryItemCreateRequest(
    @NotNull(message = "폴더 ID를 입력해주세요")
    @Schema(description = "폴더 ID", example = "1")
    Long folderId,

    @NotBlank(message = "아이템 제목을 설정해주세요.")
    @Schema(description = "보관함 아이템 제목", example = "몸짱 되는 법")
    String title,

    @Size(max = 255, message = "메모는 최대 255자까지 입력 가능합니다.")
    @Schema(description = "보관함 아이템 메모", example = "몸짱을 위해 헬스 매일 가기")
    String memo
) {
}
