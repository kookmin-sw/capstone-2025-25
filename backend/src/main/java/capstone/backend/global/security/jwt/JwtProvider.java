package capstone.backend.global.security.jwt;

import capstone.backend.domain.auth.repository.RefreshTokenRepository;
import capstone.backend.domain.member.scheme.Member;
import capstone.backend.domain.auth.scheme.RefreshToken;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.Optional;

@Slf4j
@Component
public class JwtProvider {

    private final Key signingKey;
    private final Long accessTokenExpiration;
    private final Long refreshTokenExpiration;
    private final RefreshTokenRepository refreshTokenRepository;

    public JwtProvider(@Value("${jwt.secret-key}") String secretKey,
                       @Value("${jwt.access-token.expiration}") Long accessTokenExpiration,
                       @Value("${jwt.refresh-token.expiration}") Long refreshTokenExpiration,
                       RefreshTokenRepository refreshTokenRepository
    ) {
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
        this.refreshTokenRepository = refreshTokenRepository;
        this.signingKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretKey));
    }

    public String generateAccessToken(Member member) {
        return Jwts.builder()
                .claim("email", member.getEmail())
                .claim("username", member.getUsername())
                .claim("role", member.getRole().toString())
                .claim("provider", member.getProvider())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateRefreshToken(Member member) {
        String refreshToken = Jwts.builder()
                .claim("email", member.getEmail())
                .claim("username", member.getUsername())
                .claim("role", member.getRole().toString())
                .claim("provider", member.getProvider())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();

        // 기존에 토큰이 있다면 업데이트, 없으면 생성.
        refreshTokenRepository.findByMember(member)
                .ifPresentOrElse(
                        existingToken -> {
                            existingToken.setToken(refreshToken);
                            existingToken.setExpiryDate(Instant.now().plusMillis(refreshTokenExpiration));
                            refreshTokenRepository.save(existingToken);
                        },
                        () -> refreshTokenRepository.save(
                                RefreshToken.create(member, refreshToken, Instant.now().plusMillis(refreshTokenExpiration))
                        )
                );

        return refreshToken;
    }

    // token 내 정보 추출
    public Claims getClaimsByToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Access Token 재발급
    public Optional<String> refreshAccessToken(String refreshToken) {
        return refreshTokenRepository.findByToken(refreshToken)
                .filter(token -> !token.isExpired())
                .map(token -> generateAccessToken(token.getMember()));
    }


    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(signingKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            log.error("Invalid JWT token: ", e);
            return false;
        }
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        return (bearerToken != null && bearerToken.startsWith("Bearer ")) ? bearerToken.substring(7) : null;
    }
}
