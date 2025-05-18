package capstone.backend.domain.todayTask.entity;

import capstone.backend.domain.member.entity.Member;
import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class TodayTaskAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "today_task_analysis_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Member member;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeekEnum dayOfWeek;

    @Column(nullable = false)
    private long completedNum;

    public static TodayTaskAnalysis from(Member member, LocalDate date, long completedNum) {
        return TodayTaskAnalysis.builder()
            .member(member)
            .date(date)
            .dayOfWeek(DayOfWeekEnum.from(date.getDayOfWeek()))
            .completedNum(completedNum)
            .build();
    }
}
