package capstone.backend.domain.member.service;

import capstone.backend.domain.inventory.entity.InventoryFolder;
import capstone.backend.domain.inventory.repository.InventoryFolderRepository;
import capstone.backend.domain.member.dto.response.UserDataDTO;
import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final InventoryFolderRepository inventoryFolderRepository;

    public UserDataDTO findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .map(UserDataDTO::new)
                .orElseThrow(MemberNotFoundException::new);
    }

    @Transactional
    public void createDefaultFolder(Member member) {
        InventoryFolder defaultFolder = InventoryFolder.builder()
            .name("기본 폴더")
            .member(member)
            .build();
        inventoryFolderRepository.save(defaultFolder);
    }
    public Member findById(Long memberId) {
        return memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
    }
}
