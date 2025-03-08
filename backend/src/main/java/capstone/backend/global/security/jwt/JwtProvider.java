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
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class JwtProvider {

    @Value("${jwt.secret-key}")
    private String secretKey;

    @Value("${jwt.access-token.expiration}")
    private long tokenValidityInSeconds;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // JWT 토큰 생성
    // Claims 추가 필요
    public String generateToken(Map<String, Object> additionalClaims) {
        Date now = new Date();
        long jwtExpirationMs = TimeUnit.HOURS.toMillis(tokenValidityInSeconds); // 시간을 밀리초로 변환
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .addClaims(additionalClaims) // 추가 정보 (custom claims) 설정
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // 이메일 추출
    public String getEmailFromToken(String token) {
        return parseClaims(token).get("email", String.class); // email 키로 이메일 추출
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
        try {
            Claims claims = parseClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            log.error("Invalid JWT token: ", e);
            return false;
        }
    }
}