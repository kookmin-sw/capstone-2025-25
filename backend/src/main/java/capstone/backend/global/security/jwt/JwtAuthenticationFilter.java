package capstone.backend.global.security.jwt;

import capstone.backend.domain.auth.exception.AccessLogoutTokenException;
import capstone.backend.domain.auth.exception.AccessTokenExpiredException;
import capstone.backend.domain.auth.exception.InvalidTokenException;
import capstone.backend.domain.auth.repository.BlacklistTokenRedisRepository;
import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.entity.Member;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.api.exception.ApiException;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final MemberRepository memberRepository;
    private final BlacklistTokenRedisRepository blacklistTokenRedisRepository;

    @Override
    protected void doFilterInternal(@Nonnull HttpServletRequest request,
                                    @Nonnull HttpServletResponse response,
                                    @Nonnull FilterChain filterChain) throws IOException, ServletException {
        try {
            String accessToken = jwtProvider.resolveToken(request);

            if (accessToken != null && jwtProvider.validateToken(accessToken)) {

                // BlackList Token인 경우 401 에러
                if (blacklistTokenRedisRepository.existsById(accessToken)) {
                    handleException(response, new AccessLogoutTokenException());
                    return;
                }

                Claims claimsByToken = jwtProvider.getClaimsByToken(accessToken);

                Authentication authentication = getAuthentication(claimsByToken);
                authentication.setAuthenticated(true);

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (ExpiredJwtException e) {
            handleException(response, new AccessTokenExpiredException());
            return;
        } catch (JwtException e) {
            handleException(response, new InvalidTokenException());
            return;
        } catch (ApiException e) {
            handleException(response, e);
            return;
        }
        filterChain.doFilter(request, response);
    }

    private Authentication getAuthentication(Claims claims) {
        Member member = memberRepository.findById(Long.parseLong(claims.get("id", String.class)))
                .orElseThrow(MemberNotFoundException::new);
        CustomOAuth2User user = new CustomOAuth2User(member, claims);
        return new OAuth2AuthenticationToken(user, user.getAuthorities(), user.getProvider());
    }

    private void handleException(HttpServletResponse response, ApiException e) throws IOException {
        ApiResponse<?> apiResponse = ApiResponse.error(e.getHttpStatus(), e.getMessage());
        String content = new ObjectMapper().writeValueAsString(apiResponse);
        response.addHeader("Content-Type", "application/json");
        response.setStatus(e.getHttpStatus().value()); // 에러 상태 추가
        response.getWriter().write(content);
        response.getWriter().flush();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return uri.equals("/api/auth/reissue") || uri.equals("/api/auth/token");
    }
}
