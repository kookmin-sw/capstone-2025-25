package capstone.backend.domain.inventory.response;

import capstone.backend.domain.inventory.entity.InventoryItem;
import java.time.LocalDate;

public record InventoryItemResponse(
    Long id,
    String title,
    LocalDate createdAt
) {
    public static InventoryItemResponse from(InventoryItem item) {
        return new InventoryItemResponse(
            item.getId(),
            item.getTitle(),
            item.getCreatedAt()
        );
    }

}
