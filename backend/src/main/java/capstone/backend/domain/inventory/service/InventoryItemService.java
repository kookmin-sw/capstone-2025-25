package capstone.backend.domain.inventory.service;

import capstone.backend.domain.inventory.entity.InventoryFolder;
import capstone.backend.domain.inventory.entity.InventoryItem;
import capstone.backend.domain.inventory.exception.FolderNotFoundException;
import capstone.backend.domain.inventory.repository.InventoryFolderRepository;
import capstone.backend.domain.inventory.repository.InventoryItemRepository;
import capstone.backend.domain.inventory.request.InventoryItemCreateRequest;
import capstone.backend.domain.inventory.response.InventoryItemResponse;
import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryItemService {
    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryFolderRepository inventoryFolderRepository;
    private final MemberRepository memberRepository;

    //보관함 아이템 생성
    @Transactional
    public InventoryItemResponse createInventoryItem(InventoryItemCreateRequest request, Long memberId){
        Member member = memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);

        InventoryFolder folder = inventoryFolderRepository.findById(request.folderId())
            .orElseThrow(FolderNotFoundException::new);

        InventoryItem inventoryItem = InventoryItem.from(request, folder, member);
        return InventoryItemResponse.from(inventoryItemRepository.save(inventoryItem));
    }

    //보관함 조회
    @Transactional
    public Page<InventoryItemResponse> getInventoryItems(Long folderId, Long memberId, Pageable pageable) {
        return inventoryItemRepository.findByMemberIdAndFolderId(memberId, folderId, pageable);
    }
}
