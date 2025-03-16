package capstone.backend.global.security.oauth2.user.info;

import capstone.backend.global.security.oauth2.user.OAuth2Provider;
import capstone.backend.global.security.oauth2.user.OAuth2UserInfo;

import java.util.Map;

public class KakaoOAuth2UserInfo implements OAuth2UserInfo {
    private final Map<String, Object> attributes;
    private final Map<String, Object> kakaoAccount;

    public KakaoOAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
        this.kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
    }

    @Override
    public OAuth2Provider getProvider() {
        return OAuth2Provider.KAKAO;
    }

    @Override
    public String getId() {
        return String.valueOf(attributes.get("id"));
    }

    @Override
    public String getEmail() {
        return (String) kakaoAccount.get("email");
    }

    @Override
    public String getName() {
        return (String) ((Map<String, Object>) kakaoAccount.get("profile")).get("nickname");
    }

    @Override
    public Map<String, Object> attributes() {
        return attributes;
    }
}
