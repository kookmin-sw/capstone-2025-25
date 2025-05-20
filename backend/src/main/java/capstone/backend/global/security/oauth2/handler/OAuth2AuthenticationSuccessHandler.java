package capstone.backend.global.security.oauth2.handler;

import capstone.backend.domain.auth.service.AuthService;
import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.entity.Member;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final String CALLBACK_URL;
    private final MemberRepository memberRepository;
    private final AuthService authService;

    public OAuth2AuthenticationSuccessHandler(
            @Value("${url.base.client}") String clientDomain,
            @Value("${url.path.client.callback}") String callbackEndpoint,
            MemberRepository memberRepository,
            AuthService authService) {
                this.CALLBACK_URL = clientDomain + callbackEndpoint;
                this.memberRepository = memberRepository;
                this.authService = authService;
    }


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        log.info("OAuth2 로그인 성공");

        Member member = memberRepository.findByEmail(oAuth2User.getEmail()).orElseThrow(MemberNotFoundException::new);

        // 임시 발급 코드 생성 후 리디렉션
        String code = authService.generateOneTimeCode(member.getId());
        String redirectUrl = CALLBACK_URL + "?code=" + code;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
