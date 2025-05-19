package capstone.backend.domain.auth.dto.response;

public record AccessTokenResponse(
        String accessToken,
        Boolean isRegistered
) {
    public AccessTokenResponse(String accessToken) {
        this(accessToken, null);
    }

    public AccessTokenResponse(String accessToken, Boolean isRegistered) {
        this.accessToken = accessToken;
        this.isRegistered = isRegistered;
    }
}
