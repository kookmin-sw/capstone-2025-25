package capstone.backend.domain.inventory.repository;

import capstone.backend.domain.inventory.entity.InventoryFolder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryFolderRepository extends JpaRepository<InventoryFolder, Long> {

}
