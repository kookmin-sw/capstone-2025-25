package capstone.backend.global.property;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Data
@Component
@ConfigurationProperties(prefix = "spring.data.redis")
public class RedisProperty {

    @NotBlank
    private String host;

    @NotNull
    private int port;

    @NotBlank
    private String password;

    @NotNull
    private Duration connectTimeout;

    @NotNull
    private Duration timeout;

}
