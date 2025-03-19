package capstone.backend.global.security.oauth2.user;

import java.util.Map;

public interface OAuth2UserInfo {
    OAuth2Provider getProvider();
    Map<String, Object> attributes();
    String getId();
    String getEmail();
    String getName();
}