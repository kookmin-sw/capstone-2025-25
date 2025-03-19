package capstone.backend.global.security.oauth2.user;

import capstone.backend.global.security.oauth2.exception.OAuth2AuthenticationProcessingException;
import capstone.backend.global.security.oauth2.user.info.GoogleOAuth2UserInfo;
import capstone.backend.global.security.oauth2.user.info.KakaoOAuth2UserInfo;
import capstone.backend.global.security.oauth2.user.info.NaverOAuth2UserInfo;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Slf4j
public class OAuth2UserInfoFactory {
    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        OAuth2Provider provider = OAuth2Provider.from(registrationId);

        switch (provider) {
            case GOOGLE -> {
                return new GoogleOAuth2UserInfo(attributes);
            }
            case NAVER -> {
                return new NaverOAuth2UserInfo(attributes);
            }
            case KAKAO -> {
                return new KakaoOAuth2UserInfo(attributes);
            }
        }

        throw new OAuth2AuthenticationProcessingException("Login with " + registrationId + " is not supported");
    }
}
