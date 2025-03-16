package capstone.backend.global.security.oauth2.service;

import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import capstone.backend.domain.member.scheme.Role;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import capstone.backend.global.security.oauth2.user.OAuth2UserInfoFactory;
import capstone.backend.global.security.oauth2.user.OAuth2UserInfo;
import capstone.backend.global.security.oauth2.exception.OAuth2AuthenticationProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.stereotype.Service;


@Slf4j
@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        log.info("[OAuth2] 소셜 로그인 요청 수신");

        OAuth2User oAuth2User;
        try {
            // OAuth2 서버에서 사용자 정보 가져오기
            oAuth2User = super.loadUser(oAuth2UserRequest);
        } catch (OAuth2AuthenticationException e) {
            throw new OAuth2AuthenticationProcessingException("OAuth2 인증 중 오류 발생", e);
        }

        try {
            // provider 정보 가져오기 (Kakao, Naver, Google)
            String provider = oAuth2UserRequest.getClientRegistration().getRegistrationId();
            log.info("[OAuth2] Provider: {}", provider);

            // OAuth2 사용자 정보 객체 생성
            OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(provider, oAuth2User.getAttributes());

            // 필수 정보 검증
            if (userInfo.getEmail() == null) {
                log.error("[OAuth2] 사용자 정보 검증 실패 - 이메일이 없습니다.");
                throw new OAuth2AuthenticationProcessingException("OAuth2 사용자 정보가 유효하지 않습니다.");
            }

            if (userInfo.getProvider() == null) {
                log.error("[OAuth2] 사용자 정보 검증 실패 - Provider 정보가 없습니다.");
                throw new OAuth2AuthenticationProcessingException("OAuth2 제공자 정보가 유효하지 않습니다.");
            }

            Member member = memberRepository.findByEmail(userInfo.getEmail())
                    .orElseGet(() -> {
                        Member newMember = Member.create(
                                userInfo.getEmail(),
                                userInfo.getName(),
                                Role.USER,
                                provider);
                        return memberRepository.save(newMember);
                    });

            // 사용자 객체 반환
            return new CustomOAuth2User(member, userInfo);
        } catch (AuthenticationException ex) {
            log.error("[OAuth2] 인증 예외 발생 - {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("[OAuth2] 알 수 없는 예외 발생 - {}", ex.getMessage(), ex);
            throw new InternalAuthenticationServiceException("OAuth2 사용자 정보 처리 중 오류 발생", ex);
        }
    }
}
