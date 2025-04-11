package capstone.backend.domain.member.service;

import capstone.backend.domain.member.dto.response.UserDataDTO;
import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public UserDataDTO findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .map(UserDataDTO::new)
                .orElseThrow(MemberNotFoundException::new);
    }
}
