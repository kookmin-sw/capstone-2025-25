package capstone.backend.domain.inventory.response;

import capstone.backend.domain.inventory.entity.InventoryItem;

public record InventoryItemUpdateResponse(
    Long id,
    String title,
    String memo
) {
    public static InventoryItemUpdateResponse from(InventoryItem item){
        return new InventoryItemUpdateResponse(
            item.getId(),
            item.getTitle(),
            item.getMemo()
        );
    }
}
