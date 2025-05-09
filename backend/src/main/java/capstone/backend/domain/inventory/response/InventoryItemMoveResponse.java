package capstone.backend.domain.inventory.response;

import capstone.backend.domain.inventory.entity.InventoryItem;
import java.time.LocalDate;

public record InventoryItemMoveResponse(
    Long id,
    Long folderId,
    String title,
    String memo,
    LocalDate createdAt
) {
    public static InventoryItemMoveResponse from(InventoryItem item) {
        return new InventoryItemMoveResponse(
            item.getId(),
            item.getFolder().getId(),
            item.getTitle(),
            item.getMemo(),
            item.getCreatedAt()
        );
    }
}
