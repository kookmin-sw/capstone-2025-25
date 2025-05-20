package capstone.backend.global.security.oauth2.service;

import capstone.backend.domain.inventory.service.InventoryFolderService;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import capstone.backend.domain.member.scheme.Role;
import capstone.backend.global.security.oauth2.exception.OAuth2AuthenticationProcessingException;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import capstone.backend.global.security.oauth2.user.OAuth2UserInfo;
import capstone.backend.global.security.oauth2.user.OAuth2UserInfoFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;
    private final InventoryFolderService inventoryFolderService;

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
            if (userInfo.getEmail() == null || userInfo.getProvider() == null) {
                throw new OAuth2AuthenticationProcessingException("OAuth2 사용자 정보가 유효하지 않습니다.");
            }

            Member member = findOrCreateMember(userInfo, provider);

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

    private Member findOrCreateMember(OAuth2UserInfo userInfo, String provider) {
        return memberRepository.findByEmail(userInfo.getEmail())
                .orElseGet(() -> {
                    log.info("[OAuth2] 최초 로그인 유저 - 신규 계정 생성 및 기본 폴더 설정");
                    Member newMember = Member.create(
                            userInfo.getEmail(),
                            userInfo.getName(),
                            Role.USER,
                            provider,
                            false);

                    memberRepository.save(newMember);

                    //기본 폴더 생성
                    inventoryFolderService.createDefaultFolder(newMember);

                    return newMember;
                });
    }
}
