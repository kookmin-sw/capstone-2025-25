package capstone.backend.domain.inventory.response;

import capstone.backend.domain.inventory.entity.InventoryItem;

public record InventoryItemDetailResponse(
    Long id,
    String memo
) {
    public static InventoryItemDetailResponse of(InventoryItem inventoryItem) {
        return new InventoryItemDetailResponse(
            inventoryItem.getId(),
            inventoryItem.getMemo()
        );
    }

}
