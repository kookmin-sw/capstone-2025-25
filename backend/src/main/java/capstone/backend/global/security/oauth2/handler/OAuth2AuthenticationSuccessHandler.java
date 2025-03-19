package capstone.backend.global.security.oauth2.handler;

import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import capstone.backend.global.security.jwt.JwtProvider;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
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
    private final JwtProvider jwtProvider;
    private final MemberRepository memberRepository;

    public OAuth2AuthenticationSuccessHandler(
            @Value("${url.base.client}") String clientDomain,
            @Value("${url.path.client.callback}") String callbackEndpoint,
            JwtProvider jwtProvider,
            MemberRepository memberRepository) {
                this.CALLBACK_URL = clientDomain + callbackEndpoint;
                this.jwtProvider = jwtProvider;
                this.memberRepository = memberRepository;
    }


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        log.info("OAuth2 로그인 성공");

        Member member = memberRepository.findByEmail(oAuth2User.getEmail()).orElseThrow(MemberNotFoundException::new);

        String accessToken = jwtProvider.generateAccessToken(member);
        String refreshToken = jwtProvider.generateRefreshToken(member);

        response.setHeader("Authorization", "Bearer " + accessToken);

        // HTTP Only & Secure 쿠키에 리프레시 토큰 추가
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);  // HTTPS에서만 사용
        refreshTokenCookie.setPath("/");  // 모든 경로에서 쿠키 접근 가능
        refreshTokenCookie.setMaxAge((int) (jwtProvider.getRefreshTokenExpiration() / 1000)); // 초 단위

        response.addCookie(refreshTokenCookie);

        getRedirectStrategy().sendRedirect(request, response, CALLBACK_URL);
    }
}
