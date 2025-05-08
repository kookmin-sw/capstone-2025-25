package capstone.backend.domain.inventory.repository;

import capstone.backend.domain.inventory.entity.InventoryItem;
import capstone.backend.domain.inventory.response.InventoryItemDetailResponse;
import capstone.backend.domain.inventory.response.InventoryItemResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    Page<InventoryItemResponse> findByMemberIdAndFolderId(Long memberId, Long folderId, Pageable pageable);
    InventoryItemDetailResponse findByMemberIdAndFolderIdAndId(Long memberId, Long folderId, Long inventoryId);
}
