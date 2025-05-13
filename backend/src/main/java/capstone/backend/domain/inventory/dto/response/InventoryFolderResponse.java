package capstone.backend.domain.inventory.dto.response;

import capstone.backend.domain.inventory.entity.InventoryFolder;

public record InventoryFolderResponse(
    Long id,
    String name,
    int itemCount,
    boolean isDefault
) {
    public static InventoryFolderResponse from(InventoryFolder inventoryFolder) {
        return new InventoryFolderResponse(
            inventoryFolder.getId(),
            inventoryFolder.getName(),
            inventoryFolder.getItems() != null ? inventoryFolder.getItems().size() : 0,
            inventoryFolder.isDefault()
        );
    }
}
