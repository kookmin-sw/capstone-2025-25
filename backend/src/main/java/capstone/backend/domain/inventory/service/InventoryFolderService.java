package capstone.backend.domain.inventory.service;

import capstone.backend.domain.inventory.entity.InventoryFolder;
import capstone.backend.domain.inventory.exception.FolderDeletionNotAllowedException;
import capstone.backend.domain.inventory.exception.FolderNotFoundException;
import capstone.backend.domain.inventory.repository.InventoryFolderRepository;
import capstone.backend.domain.inventory.dto.request.InventoryFolderRequest;
import capstone.backend.domain.inventory.dto.response.InventoryFolderResponse;
import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import java.time.LocalDateTime;
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
    public InventoryFolderResponse createInventoryFolder(
        InventoryFolderRequest inventoryFolderRequest, Long memberId){
        Member member = memberRepository.findById(memberId)
            .orElseThrow(MemberNotFoundException::new);

        InventoryFolder inventoryFolder = InventoryFolder.from(member, inventoryFolderRequest, false);
        return InventoryFolderResponse.from(inventoryFolderRepository.save(inventoryFolder));
    }

    //폴더 조회
    public List<InventoryFolderResponse> getInventoryFolders(Long memberId){
        return inventoryFolderRepository.findAllByMemberIdOrderByCreatedAt(memberId)
            .stream()
            .map(InventoryFolderResponse::from)
            .toList();
    }

    //폴더 상세 조회
    public InventoryFolderResponse getInventoryFolderDetail(Long memberId, Long folderId){
        InventoryFolder inventoryFolder = inventoryFolderRepository.findByIdAndMemberId(folderId, memberId)
            .orElseThrow(FolderDeletionNotAllowedException::new);

        return InventoryFolderResponse.from(inventoryFolder);
    }

    //폴더 수정
    @Transactional
    public InventoryFolderResponse updateInventoryFolder(Long memberId, Long folderId,
        InventoryFolderRequest request){

        InventoryFolder inventoryFolder = inventoryFolderRepository.findByIdAndMemberId(folderId, memberId)
            .orElseThrow(FolderNotFoundException::new);

        inventoryFolder.updateName(request.name());

        return InventoryFolderResponse.from(inventoryFolder);
    }

    //폴더 삭제
    @Transactional
    public void deleteInventoryFolder(Long memberId, Long folderId){
        if (folderId == 1L){
            throw new FolderDeletionNotAllowedException();
        }

        InventoryFolder inventoryFolder = inventoryFolderRepository.findByIdAndMemberId(folderId, memberId)
            .orElseThrow(FolderNotFoundException::new);

        inventoryFolderRepository.delete(inventoryFolder);
    }

    //회원가입 시 기본 폴더 생성
    @Transactional
    public void createDefaultFolder(Member member) {
        InventoryFolder defaultFolder = InventoryFolder.builder()
            .name("기본 폴더")
            .member(member)
            .isDefault(true)
            .createdAt(LocalDateTime.now())
            .build();
        inventoryFolderRepository.save(defaultFolder);
    }
}
