package capstone.backend.global.security.oauth2.user.info;

import capstone.backend.global.security.oauth2.user.OAuth2Provider;
import capstone.backend.global.security.oauth2.user.OAuth2UserInfo;

import java.util.Map;

public class NaverOAuth2UserInfo implements OAuth2UserInfo {
    private final Map<String, Object> attributes;
    private final Map<String, Object> response;

    public NaverOAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
        this.response = (Map<String, Object>) attributes.get("response"); // Naver는 "response" 객체 내부에 값이 있음
    }

    @Override
    public OAuth2Provider getProvider() {
        return OAuth2Provider.NAVER;
    }

    @Override
    public Map<String, Object> attributes() {
        return attributes;
    }

    @Override
    public String getId() {
        return (String) response.get("id"); // Naver의 고유 ID
    }

    @Override
    public String getEmail() {
        return (String) response.get("email");
    }

    @Override
    public String getName() {
        return (String) response.get("name");
    }
}
