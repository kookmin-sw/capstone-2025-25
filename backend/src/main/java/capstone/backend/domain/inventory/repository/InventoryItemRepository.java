package capstone.backend.domain.inventory.repository;

import capstone.backend.domain.inventory.entity.InventoryItem;
import capstone.backend.domain.inventory.dto.response.InventoryItemResponse;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    Page<InventoryItemResponse> findByMemberIdAndFolderId(Long memberId, Long folderId, Pageable pageable);
    InventoryItemResponse findByMemberIdAndId(Long memberId, Long inventoryId);
    Optional<InventoryItem> findByIdAndMemberId(Long inventoryId, Long memberId);
    List<InventoryItemResponse> findTop5ByMemberIdOrderByCreatedAtDesc(Long memberId);
}
