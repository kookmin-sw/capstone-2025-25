package capstone.backend.global.security.oauth2.user;

import capstone.backend.domain.member.entity.Member;
import io.jsonwebtoken.Claims;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Getter
public class CustomOAuth2User implements OAuth2User, UserDetails {

    private final Long memberId;
    private final String provider;
    private final Map<String, Object> attributes;
    private final String email;
    private final String role;

    public CustomOAuth2User(Member member, OAuth2UserInfo oAuth2UserInfo) {
        this.memberId = member.getId();
        this.provider = member.getProvider();
        this.email = member.getEmail();
        this.role = member.getRole().toString();
        this.attributes = oAuth2UserInfo.attributes();
    }

    public CustomOAuth2User(Member member, Claims claims) {
        this.memberId = member.getId();
        this.provider = member.getProvider();
        this.email = member.getEmail();
        this.role = member.getRole().toString();
        this.attributes = claims;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role)); // 권한은 반드시 이렇게 설정
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    @Override
    public String getName() {
        return email;
    }
}
