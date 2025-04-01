package capstone.backend.domain.member.scheme;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "member_id")
    private Long id;

    @Column(nullable = false, name = "email")
    private String email;

    @Column(name = "username")
    private String username;

    @Column(nullable = false, name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false)
    private String provider; // OAuth2 로그인 제공자 (google, github, naver 등)

    public static Member create(String email, String username, Role role, String provider) {
        return Member.builder()
                .email(email)
                .username(username)
                .role(role)
                .provider(provider)
                .build();
    }
}
