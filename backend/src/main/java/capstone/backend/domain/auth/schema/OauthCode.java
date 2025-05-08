package capstone.backend.domain.auth.schema;

import java.util.concurrent.TimeUnit;

import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

@Builder
@RedisHash(value = "oauth_code")
public record OauthCode(

        @Id
        Long id,

        @Indexed
        String code,

        Long memberId,

        @TimeToLive(unit = TimeUnit.MILLISECONDS)
        long ttl
) {
}
