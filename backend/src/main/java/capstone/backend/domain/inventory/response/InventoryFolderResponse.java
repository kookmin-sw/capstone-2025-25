package capstone.backend.domain.inventory.response;

import capstone.backend.domain.inventory.entity.InventoryFolder;

public record InventoryFolderResponse(
    Long id,
    String name,
    int itemCount
) {
    public static InventoryFolderResponse from(InventoryFolder inventoryFolder) {
        return new InventoryFolderResponse(
            inventoryFolder.getId(),
            inventoryFolder.getName(),
            inventoryFolder.getItems() != null ? inventoryFolder.getItems().size() : 0
        );
    }
}
