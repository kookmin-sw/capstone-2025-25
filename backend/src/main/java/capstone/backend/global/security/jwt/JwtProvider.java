package capstone.backend.global.security.jwt;

import capstone.backend.global.property.JwtProperty;
import capstone.backend.global.redis.RedisService;
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
    private final RedisService redisService;

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
        String refreshToken = Jwts.builder()
                .claim("id", memberId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + getRefreshTokenExpiration()))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();

        // Redis에 저장 (key: memberId, value: refreshToken, 만료시간 설정)
        redisService.saveRefreshToken(memberId, refreshToken);

        return refreshToken;
    }

    public Claims getClaimsByToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String refreshAccessToken(String refreshToken) {
        String id = getClaimsByToken(refreshToken).get("id").toString();
        String storedToken = redisService.getRefreshToken(id);

        if (storedToken != null && storedToken.equals(refreshToken)) {
            return generateAccessToken(id);
        }

        return null;
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
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
