package capstone.backend.domain.todayTask.entity;

import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import capstone.backend.domain.member.scheme.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;
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
public class TodayTaskItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "today_task_item_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eisenhower_item_id", nullable = false)
    private EisenhowerItem eisenhowerItem;

    @Column(name = "task_date", nullable = false)
    private LocalDate taskDate;

    public static TodayTaskItem from(Member member, EisenhowerItem eisenhowerItem) {
        return TodayTaskItem.builder()
            .member(member)
            .eisenhowerItem(eisenhowerItem)
            .taskDate(LocalDate.now())
            .build();
    }
}
