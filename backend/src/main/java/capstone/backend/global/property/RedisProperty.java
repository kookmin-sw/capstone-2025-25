package capstone.backend.global.property;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "spring.data.redis")
public class RedisProperty {

    @NotBlank
    private String host;

    @NotBlank
    private int port;

    @NotBlank
    private String password;

    @NotBlank
    private String connectTimeout;

    @NotBlank
    private String timeout;

}
