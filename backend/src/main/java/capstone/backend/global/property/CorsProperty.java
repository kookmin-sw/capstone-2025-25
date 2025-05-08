package capstone.backend.global.property;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Stream;

@Data
@Component
@ConfigurationProperties(prefix = "cors")
public class CorsProperty {

    @NotBlank
    private String origin;

    public List<String> getClientList() {
        return Stream.of(origin.split(","))
                .map(String::trim)
                .toList();
    }
}
