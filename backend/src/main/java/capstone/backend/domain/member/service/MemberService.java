package capstone.backend.domain.member.service;

import capstone.backend.domain.member.dto.response.UserDataDTO;
import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import capstone.backend.domain.member.scheme.Role;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemberService {

    private static final Logger log = LoggerFactory.getLogger(MemberService.class);
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
    public Member updateLoginStatus(Member member) {
        log.info("Updating login status for {}", member);
        member.updateRegistered();
        memberRepository.save(member);
        return member;
    }

    @Transactional
    public Member registerNewMember(String email, String username, String provider) {
        Member newMember = Member.create(email, username, Role.USER, provider, false);
        return memberRepository.save(newMember);
    }

    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email).orElse(null);
    }
}
