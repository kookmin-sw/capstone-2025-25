package capstone.backend.global.security.oauth2.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OAuth2Provider {
    GOOGLE("google"),
    NAVER("naver"),
    KAKAO("kakao");

    private final String registrationId;

    public static OAuth2Provider from(String registrationId) {
        for (OAuth2Provider provider : values()) {
            if (provider.getRegistrationId().equalsIgnoreCase(registrationId)) {
                return provider;
            }
        }
        throw new IllegalArgumentException("Unsupported provider: " + registrationId);
    }
}