package capstone.backend.domain.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AccessTokenRequest(
    @NotBlank
    String accessToken
)
{}
