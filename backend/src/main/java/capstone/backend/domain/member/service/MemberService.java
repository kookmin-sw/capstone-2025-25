package capstone.backend.domain.member.service;

import capstone.backend.domain.member.dto.response.UserDataDTO;
import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.entity.Member;
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

    public Member findById(Long memberId) {
        return memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
    }

    @Transactional
    public void deleteMember(Long memberId) {
        memberRepository.deleteById(memberId);
    }

    public boolean isMemberRegistered(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);

        return member.getIsRegistered();  // true: 재 로그인
    }

    @Transactional
    public void updateLoginStatus(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);

        member.updateRegistered();
    }
}
