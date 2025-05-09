package capstone.backend.domain.inventory.request;

import jakarta.validation.constraints.NotNull;

public record InventoryItemMoveRequest(
    @NotNull Long folderId
) {
}
