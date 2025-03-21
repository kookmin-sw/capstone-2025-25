package capstone.backend.global.redis;


import capstone.backend.global.property.JwtProperty;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final JwtProperty jwtProperty;
    private final StringRedisTemplate refreshTokenRedisTemplate;

    public void saveRefreshToken(String key, String value) {
        refreshTokenRedisTemplate.opsForValue().set(key, value, jwtProperty.getRefreshToken().getExpiration(), TimeUnit.HOURS);
    }

    public String getRefreshToken(String key) {
        return refreshTokenRedisTemplate.opsForValue().get(key);
    }

    public void deleteRefreshToken(String key) {
        refreshTokenRedisTemplate.delete(key);
    }
}
