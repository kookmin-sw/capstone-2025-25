package capstone.backend.domain.inventory.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record InventoryFolderCreateRequest(
    @NotNull
    @Size(max = 10, message = "이름은 최대 10글자까지 가능합니다.")
    @Schema(description = "폴더 이름", example = "운동")
    String name
) {
}
