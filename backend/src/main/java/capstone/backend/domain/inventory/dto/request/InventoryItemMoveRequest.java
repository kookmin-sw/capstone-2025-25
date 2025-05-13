package capstone.backend.domain.inventory.dto.request;

import jakarta.validation.constraints.NotNull;

public record InventoryItemMoveRequest(
    @NotNull(message = "id를 입력해주세요.")
    Long folderId
) {
}
