package capstone.backend.global.security.jwt;

import capstone.backend.global.property.JwtProperty;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtProvider {

    private final JwtProperty jwtProperty;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtProperty.getSecretKey()));
    }

    private Long getAccessTokenExpiration() {
        return jwtProperty.getAccessToken().getExpiration() * 3600 * 1000; // milliSecond
    }

    public Long getRefreshTokenExpiration() {
        return jwtProperty.getRefreshToken().getExpiration() * 3600 * 1000; // milliSecond
    }

    public String generateAccessToken(String memberId) {
        return Jwts.builder()
                .claim("id", memberId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + getAccessTokenExpiration()))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateRefreshToken(String memberId) {
        return Jwts.builder()
                .claim("id", memberId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + getRefreshTokenExpiration()))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public Claims getClaimsByToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String refreshAccessToken(String refreshToken) {
        try {
            String memberId = getClaimsByToken(refreshToken).get("id", String.class);
            return generateAccessToken(memberId);

        } catch (ExpiredJwtException e) {
            log.error("Refresh token expired");
            return null;
        } catch (JwtException e) {
            log.error("잘못된 JWT 서명: ", e);
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // 토큰의 만료 시간 검증
            return !claims.getExpiration().before(new Date());
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
