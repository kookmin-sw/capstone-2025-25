package capstone.backend.domain.inventory.service;

import capstone.backend.domain.inventory.entity.InventoryFolder;
import capstone.backend.domain.inventory.entity.InventoryItem;
import capstone.backend.domain.inventory.exception.FolderNotFoundException;
import capstone.backend.domain.inventory.exception.InventoryItemNotFoundException;
import capstone.backend.domain.inventory.repository.InventoryFolderRepository;
import capstone.backend.domain.inventory.repository.InventoryItemRepository;
import capstone.backend.domain.inventory.dto.request.InventoryItemCreateRequest;
import capstone.backend.domain.inventory.dto.request.InventoryItemUpdateRequest;
import capstone.backend.domain.inventory.dto.response.InventoryItemResponse;
import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import java.util.List;
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
    public Page<InventoryItemResponse> getInventoryItems(Long folderId, Long memberId, Pageable pageable) {
        return inventoryItemRepository.findByMemberIdAndFolderIdOrderByCreatedAt(memberId, folderId, pageable);
    }

    //보관함 아이템 상세 조회
    public InventoryItemResponse getInventoryItemDetail(Long itemId, Long memberId){
        return inventoryItemRepository.findByMemberIdAndId(memberId, itemId);
    }

    //보관함 아이템 삭제
    @Transactional
    public void deleteInventoryItem(Long itemId, Long memberId){
        InventoryItem item = inventoryItemRepository.findByIdAndMemberId(itemId, memberId)
            .orElseThrow(InventoryItemNotFoundException::new);

        inventoryItemRepository.delete(item);
    }

    //보관함 아이템 수정
    @Transactional
    public InventoryItemResponse updateInventoryItem(Long itemId, Long memberId, InventoryItemUpdateRequest request){
        InventoryItem item = inventoryItemRepository.findByIdAndMemberId(itemId, memberId)
            .orElseThrow(InventoryItemNotFoundException::new);

        item.update(request.title(), request.memo());
        return InventoryItemResponse.from(item);
    }

    //보관함 아이템 폴더 변경
    @Transactional
    public InventoryItemResponse moveInventoryItemFolder(Long memberId, Long itemId, Long folderId){
        InventoryItem item = inventoryItemRepository.findByIdAndMemberId(itemId, memberId)
            .orElseThrow(InventoryItemNotFoundException::new);

        InventoryFolder newFolder = inventoryFolderRepository.findById(folderId)
            .orElseThrow(FolderNotFoundException::new);

        item.updateFolder(newFolder);
        return InventoryItemResponse.from(item);
    }

    //보관함 최근 생성 5개 조회
    @Transactional
    public List<InventoryItemResponse> getRecentItems(Long memberId){
        return inventoryItemRepository.findTop5ByMemberIdOrderByCreatedAtDesc(memberId);
    }
}
