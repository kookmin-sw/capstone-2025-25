package capstone.backend.global.property;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "cloud.aws")
public class AwsProperty {

    @NotBlank
    private String region;

    @NestedConfigurationProperty
    private Credentials credentials;

    @Data
    public static class Credentials {

        @NotBlank
        private String accessKey;

        @NotBlank
        private String secretKey;
    }
}
