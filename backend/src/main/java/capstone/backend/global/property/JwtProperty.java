package capstone.backend.global.property;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperty {

    @NotBlank
    private String secretKey;

    @NestedConfigurationProperty
    private AccessToken accessToken;

    @NestedConfigurationProperty
    private RefreshToken refreshToken;

    @Data
    public static class AccessToken {

        @NotBlank
        private Long expiration;
    }

    @Data
    public static class RefreshToken {

        @NotBlank
        private Long expiration;

    }
}
