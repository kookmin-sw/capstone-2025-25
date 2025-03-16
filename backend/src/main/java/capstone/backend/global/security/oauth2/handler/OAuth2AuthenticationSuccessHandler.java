package capstone.backend.global.security.oauth2.handler;

import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import capstone.backend.global.api.exception.ApiException;
import capstone.backend.global.security.jwt.JwtProvider;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

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

        Member member = memberRepository.findByEmail(oAuth2User.getEmail()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "유저 정보를 찾을 수 없습니다."));

        String accessToken = jwtProvider.generateAccessToken(member);
        String refreshToken = jwtProvider.generateRefreshToken(member);
        String redirectUrl = UriComponentsBuilder.fromUriString(CALLBACK_URL)
                .queryParam("access_token", accessToken)
                .queryParam("refresh_token", refreshToken)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

}
