package capstone.backend.domain.member.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id", nullable = false)
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "username")
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(nullable = false)
    private String provider; // OAuth2 로그인 제공자 (google, github, naver 등)

    // private 생성자: 직접 객체 생성을 막고, 필수 필드 검증
    private Member(String email, String username, Role role, String provider) {
        if (email == null || email.isBlank()) throw new IllegalArgumentException("Email은 필수값입니다.");
        if (role == null) throw new IllegalArgumentException("Role은 필수값입니다.");
        if (provider == null || provider.isBlank()) throw new IllegalArgumentException("Provider는 필수값입니다.");

        this.email = email;
        this.username = username;
        this.role = role;
        this.provider = provider;
    }

    // 정적 팩토리 메서드
    public static Member create(String email, String username, Role role, String provider) {
        return new Member(email, username, role, provider);
    }
}
