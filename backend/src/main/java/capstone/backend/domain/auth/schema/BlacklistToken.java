package capstone.backend.domain.auth.schema;

import java.util.concurrent.TimeUnit;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import lombok.Builder;

@Builder
@RedisHash(value = "blacklist_token")
public record BlacklistToken(

        @Id
        String token, // AT 자체를 key로 사용

        @TimeToLive(unit = TimeUnit.MILLISECONDS)
        long ttl
) {
}
