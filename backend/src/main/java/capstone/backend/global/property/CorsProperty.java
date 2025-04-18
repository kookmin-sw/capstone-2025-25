package capstone.backend.global.property;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Stream;

@Data
@Component
@ConfigurationProperties(prefix = "url")
public class CorsProperty {

    @NestedConfigurationProperty
    private Base base;

    @NestedConfigurationProperty
    private Path path;

    @Data
    public static class Base {

        @NotBlank
        private String client;

        @NotBlank
        private String server;

        public List<String> getClientList() {
            return Stream.of(client.split(","))
                    .map(String::trim)
                    .toList();
        }
    }

    @Data
    public static class Path {

        @NestedConfigurationProperty
        private Client client;

        @Data
        public static class Client {

            @NotBlank
            private String callback;
        }
    }
}
