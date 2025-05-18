package capstone.backend.global.security.oauth2.user;

import capstone.backend.domain.member.entity.Member;
import capstone.backend.domain.member.entity.Role;
import io.jsonwebtoken.Claims;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Getter
public class CustomOAuth2User implements OAuth2User {

    private final Long memberId;
    private final String provider; // ex> google
    private final String email;
    private final String name; // username
    private final Role role;
    private final Map<String, Object> attributes;

    // OAuth2 로그인용 생성자
    public CustomOAuth2User(Member member, OAuth2UserInfo oAuth2UserInfo) {
        this.memberId = member.getId();
        this.provider = member.getProvider();
        this.email = oAuth2UserInfo.getEmail();
        this.role = member.getRole();
        this.name = oAuth2UserInfo.getName();
        this.attributes = oAuth2UserInfo.attributes();
    }

    // Jwt Token으로 OAuth2User 생성
    public CustomOAuth2User(Member member, Claims claims) {
        this.memberId = member.getId();
        this.provider = member.getProvider();
        this.email = member.getEmail();
        this.role = member.getRole();
        this.name = member.getUsername();
        this.attributes = claims;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes != null ? attributes : Collections.emptyMap();
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }
}
