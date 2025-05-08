package capstone.backend.domain.eisenhower.entity;

import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemCreateRequest;
import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemUpdateRequest;
import capstone.backend.domain.member.scheme.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class EisenhowerItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "eisenhower_item_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false)
    private String title;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private EisenhowerCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EisenhowerQuadrant quadrant;

    @Column(nullable = false, name = "task_order")
    private Long order;

    @Column(nullable = false)
    private Boolean isCompleted;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(columnDefinition = "TEXT")
    private String memo;

    private LocalDate dueDate;


    public static EisenhowerItem from(EisenhowerItemCreateRequest request, Member member, EisenhowerCategory category) {
        return EisenhowerItem.builder()
                .member(member)
                .title(request.title())
                .category(category)
                .dueDate(request.dueDate())
                .quadrant(request.quadrant())
                .order(request.order())
                .isCompleted(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public void update(EisenhowerItemUpdateRequest request, EisenhowerCategory category) {
        if (request.title() != null) {
            this.title = request.title();
        }
        if (request.memo() != null) {
            this.memo = request.memo();
        }
        if (request.isCompleted() != null) {
            this.isCompleted = request.isCompleted();
        }
        if (Boolean.TRUE.equals(request.dueDateExplicitlyNull())) {
            this.dueDate = null;
        } else if (request.dueDate() != null) {
            this.dueDate = request.dueDate();
        }
        this.category = category;
    }

    public void updateOrderAndQuadrant(Long order, EisenhowerQuadrant quadrant) {
        this.order = order;
        this.quadrant = quadrant;
    }

}
