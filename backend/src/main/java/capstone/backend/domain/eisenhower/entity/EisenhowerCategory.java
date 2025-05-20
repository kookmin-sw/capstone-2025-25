package capstone.backend.domain.eisenhower.entity;

import capstone.backend.domain.eisenhower.dto.request.EisenhowerCategoryCreateRequest;
import capstone.backend.domain.eisenhower.dto.request.EisenhowerCategoryUpdateRequest;
import capstone.backend.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class EisenhowerCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "eisenhower_category_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Member member;

    @Column(nullable = false, length = 10)
    private String title;

    @Column(nullable = false)
    private String color;

    public static EisenhowerCategory from(EisenhowerCategoryCreateRequest eisenhowerCategoryRequest, Member member) {
        return EisenhowerCategory.builder()
                .member(member)
                .title(eisenhowerCategoryRequest.title())
                .color(eisenhowerCategoryRequest.color())
                .build();
    }

    public void update(EisenhowerCategoryUpdateRequest eisenhowerCategoryUpdateRequest) {
        if (eisenhowerCategoryUpdateRequest.title() != null) {
            this.title = eisenhowerCategoryUpdateRequest.title();
        }
        if (eisenhowerCategoryUpdateRequest.color() != null) {
            this.color = eisenhowerCategoryUpdateRequest.color();
        }
    }
}
