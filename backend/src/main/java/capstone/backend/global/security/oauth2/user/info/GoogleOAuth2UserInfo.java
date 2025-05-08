package capstone.backend.global.security.oauth2.user.info;

import capstone.backend.global.security.oauth2.user.OAuth2Provider;
import capstone.backend.global.security.oauth2.user.OAuth2UserInfo;

import java.util.Map;

public record GoogleOAuth2UserInfo(
        Map<String, Object> attributes
) implements OAuth2UserInfo {

    @Override
    public OAuth2Provider getProvider() {
        return OAuth2Provider.GOOGLE;
    }

    @Override
    public String getId() {
        return (String) attributes.get("sub"); // Google은 "sub" 필드를 ID로 사용
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }
}