package capstone.backend.domain.todayTask.entity;

import capstone.backend.domain.member.scheme.Member;
import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class TodayTaskAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "daily_today_task_summary_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private long completedNum;

    public static TodayTaskAnalysis from(Member member, LocalDate date, long completedNum) {
        return TodayTaskAnalysis.builder()
            .member(member)
            .date(date)
            .completedNum(completedNum)
            .build();
    }
}
