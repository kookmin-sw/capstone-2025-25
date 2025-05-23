package capstone.backend.domain.inventory.repository;

import capstone.backend.domain.inventory.entity.InventoryFolder;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryFolderRepository extends JpaRepository<InventoryFolder, Long> {
    List<InventoryFolder> findAllByMemberIdOrderByCreatedAt(Long memberId);
    Optional<InventoryFolder> findByIdAndMemberId(Long id, Long memberId);
}
