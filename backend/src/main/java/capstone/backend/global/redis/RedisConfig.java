package capstone.backend.global.redis;

import capstone.backend.global.property.RedisProperty;
import io.lettuce.core.ClientOptions;
import io.lettuce.core.SocketOptions;
import io.lettuce.core.resource.DefaultClientResources;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.time.Duration;

@Configuration
@RequiredArgsConstructor
public class RedisConfig {

    private final RedisProperty redisProperty;

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        // Redis Standalone 설정
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(redisProperty.getHost(), redisProperty.getPort());
        config.setPassword(redisProperty.getPassword());

        // Lettuce 클라이언트 설정 (Timeout 적용)
        LettuceClientConfiguration clientConfig = LettuceClientConfiguration.builder()
                .commandTimeout(Duration.parse(redisProperty.getTimeout())) // Read Timeout 적용
                .clientOptions(ClientOptions.builder()
                        .socketOptions(SocketOptions.builder()
                                .connectTimeout(Duration.parse(redisProperty.getConnectTimeout())) // Connection Timeout 적용
                                .build())
                        .build())
                .clientResources(DefaultClientResources.create())
                .build();

        return new LettuceConnectionFactory(config, clientConfig);
    }

    /**
     * Refresh Token 저장을 위한 StringRedisTemplate
     * Key: userId
     * Value: Refresh Token (String)
     */
    @Bean
    public StringRedisTemplate refreshTokenRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
        return new StringRedisTemplate(redisConnectionFactory);
    }
}
