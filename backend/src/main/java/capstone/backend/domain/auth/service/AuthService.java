package capstone.backend.domain.auth.service;

import capstone.backend.domain.auth.dto.response.RefreshAccessTokenResponse;
import capstone.backend.domain.auth.exception.InvalidRefreshTokenException;
import capstone.backend.domain.auth.repository.RefreshTokenRedisRepository;
import capstone.backend.domain.auth.schema.RefreshToken;
import capstone.backend.global.security.jwt.JwtProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final JwtProvider jwtProvider;

    @Transactional
    public void saveRefreshToken(Long memberId, String token, long ttl) {
        RefreshToken refreshToken = new RefreshToken(memberId, token, String.valueOf(memberId), ttl);
        refreshTokenRedisRepository.save(refreshToken);
    }

    @Transactional
    public void deleteRefreshToken(String token) {
        refreshTokenRedisRepository.deleteByToken(token);
    }

    // RT로 AT발급
    public RefreshAccessTokenResponse refreshAccessToken(String refreshToken) {
        RefreshToken storedToken = refreshTokenRedisRepository.findByToken(refreshToken).orElseThrow(InvalidRefreshTokenException::new);
        String at = jwtProvider.refreshAccessToken(storedToken.token());
        return new RefreshAccessTokenResponse(at);
    }

    // 로그아웃
    @Transactional
    public void logout(String refreshToken, HttpServletResponse response) {
        if (refreshToken != null) {
            deleteRefreshToken(refreshToken);
        }

        // 쿠키에서 Refresh Token 삭제
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);
        response.addCookie(refreshTokenCookie);
    }
}
