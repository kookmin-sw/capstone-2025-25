package capstone.backend.domain.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record RefreshAccessTokenRequest (
    @NotBlank
    String token
)
{}
