package capstone.backend.domain.inventory.service;

import capstone.backend.domain.inventory.entity.InventoryFolder;
import capstone.backend.domain.inventory.exception.FolderNotFoundException;
import capstone.backend.domain.inventory.repository.InventoryFolderRepository;
import capstone.backend.domain.inventory.request.InventoryFolderCreateRequest;
import capstone.backend.domain.inventory.response.InventoryFolderResponse;
import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryFolderService {
    private final MemberRepository memberRepository;
    private final InventoryFolderRepository inventoryFolderRepository;

    //폴더 생성
    @Transactional
    public InventoryFolderResponse createInventoryFolder(InventoryFolderCreateRequest inventoryFolderCreateRequest, Long memberId){
        Member member = memberRepository.findById(memberId)
            .orElseThrow(MemberNotFoundException::new);

        InventoryFolder inventoryFolder = InventoryFolder.from(member, inventoryFolderCreateRequest);
        return InventoryFolderResponse.from(inventoryFolderRepository.save(inventoryFolder));
    }

    //폴더 조회
    public List<InventoryFolderResponse> getInventoryFolders(Long memberId){
        return inventoryFolderRepository.findAllByMemberId(memberId).orElseThrow(FolderNotFoundException::new)
            .stream()
            .map(InventoryFolderResponse::from)
            .toList();
    }

    //폴더 수정
    @Transactional
    public InventoryFolderResponse updateInventoryFolder(Long memberId, Long folderId,
        InventoryFolderCreateRequest request){

        InventoryFolder inventoryFolder = inventoryFolderRepository.findByIdAndMemberId(folderId, memberId)
            .orElseThrow(() -> new FolderNotFoundException());

        inventoryFolder.updateName(request.name());

        return InventoryFolderResponse.from(inventoryFolder);
    }
}
