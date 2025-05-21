package capstone.backend.domain.pomodoro.entity;


import capstone.backend.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.DayOfWeek;
import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class DailyPomodoroSummary {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "daily_pomodoro_summary_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Member member;

    @Column(updatable = false)
    private LocalDate createdAt;

    @Column(name = "total_time")
    private Long totalTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, updatable = false)
    private DayOfWeek dayOfWeek;

    // 요일 추가로 인한 @CreatedDate 제거, 생성 시 날짜 및 요일 동시 추가하는게 로직상 자연스럽고 일관적임.
    public static DailyPomodoroSummary create(Member member) {
        LocalDate now = LocalDate.now();
        return DailyPomodoroSummary.builder()
                .member(member)
                .createdAt(now)
                .dayOfWeek(now.getDayOfWeek())
                .totalTime(0L)
                .build();
    }

    public void addToTotalTime(Long additionalSeconds) {
        if (this.totalTime == null) {
            this.totalTime = 0L;
        }
        this.totalTime += additionalSeconds;
    }

    public String getDayOfWeek() {
        return switch (dayOfWeek) {
            case MONDAY -> "MON";
            case TUESDAY -> "TUE";
            case WEDNESDAY -> "WED";
            case THURSDAY -> "THU";
            case FRIDAY -> "FRI";
            case SATURDAY -> "SAT";
            case SUNDAY -> "SUN";
        };
    }
}
