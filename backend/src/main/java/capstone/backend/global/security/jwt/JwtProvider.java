package capstone.backend.global.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class JwtProvider {

    @Value("${jwt.secret-key}")
    private String secretKey;

    @Value("${jwt.access-token.expiration}")
    private long tokenValidityInHours;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // JWT 토큰 생성
    // Claims 추가 필요
    // userId를 Claims에 포함하여 JWT 생성
    public String generateToken(String memberId) {
        Date now = new Date();
        long jwtExpirationMs = TimeUnit.HOURS.toMillis(tokenValidityInHours); // 만료 시간(밀리초 변환)
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        // Claims 객체 생성
        Claims claims = Jwts.claims().setSubject(memberId);
        claims.put("memberId", memberId);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // userId 추출
    public String extractToken(String token) {
        return parseClaims(token).get("memberId", String.class);
    }

    // 토큰에서 Claims 추출
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        if (Objects.isNull(token) || token.trim().isEmpty()) {
            log.error("JWT token is null or empty");
            return false;
        }

        try {
            Claims claims = parseClaims(token);

            if (claims.getExpiration().before(new Date())) {
                log.error("JWT token has expired");
                return false;
            }

            return true;
        } catch (Exception e) {
            log.error("Invalid JWT token: ", e);
            return false;
        }
    }
}