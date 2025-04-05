package capstone.backend.domain.pomodoro.schema;


import capstone.backend.domain.member.scheme.Member;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Duration;
import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EntityListeners(AuditingEntityListener.class)
@Builder
public class DailyPomodoroSummary {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "daily_pomodoro_summary_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @CreatedDate
    private LocalDate createdAt;

    // Duration은 HH:mm:ss 형태를 초 단위로 내부에서 처리 (INTERVAL type)
    @Column(name = "total_time")
    private Duration totalTime;

    public static DailyPomodoroSummary create(Member member) {
        return DailyPomodoroSummary.builder()
                .member(member)
                .totalTime(Duration.ZERO)
                .build();
    }

    public void addToTotalTime(Duration additional) {
        if (this.totalTime == Duration.ZERO) {
            this.totalTime = additional;
        } else {
            this.totalTime = this.totalTime.plus(additional);
        }
    }

    public String getTotalTime() {
        long seconds = totalTime.getSeconds();
        long hours = seconds / 3600;
        long minutes = (seconds % 3600) / 60;
        long secs = seconds % 60;
        return String.format("%02d:%02d:%02d", hours, minutes, secs);
    }
}
