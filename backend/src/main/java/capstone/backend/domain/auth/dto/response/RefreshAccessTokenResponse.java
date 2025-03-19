package capstone.backend.domain.auth.dto.response;

import lombok.Builder;

@Builder
public record RefreshAccessTokenResponse(
        String accessToken
) {}
