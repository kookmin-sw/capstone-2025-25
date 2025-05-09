package capstone.backend.domain.bubble.entity;


import capstone.backend.domain.member.scheme.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Bubble {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "bubble_id")
    private Long id;

    @Column(nullable = false, name = "title")
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    public static Bubble create(String title, Member member) {
        return Bubble.builder()
                .title(title)
                .member(member)
                .build();
    }
    public void update(String title) {
        this.title = title;
    }
}
