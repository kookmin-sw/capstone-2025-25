package capstone.backend.domain.pomodoro.schema;

import capstone.backend.domain.eisenhower.schema.EisenhowerItem;
import capstone.backend.domain.member.scheme.Member;
import capstone.backend.domain.pomodoro.exception.PomodoroDurationException;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.*;
import java.util.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Pomodoro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pomodoro_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @JsonIgnore
    private Member member;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eisenhower_item_id")
    @JsonIgnore
    private EisenhowerItem eisenhowerItem;

    @Column(name = "title", nullable = false)
    private String title;

    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "total_planned_time", nullable = false)
    private LocalTime totalPlannedTime;

    @Column(name = "total_executed_time")
    private LocalTime totalExecutedTime;

    @Column(name = "total_working_duration")
    private LocalTime totalWorkingTime;

    @Column(name = "total_break_duration")
    private LocalTime totalBreakTime;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false, name = "planned_cycles")
    private List<PomodoroCycle> plannedCycles;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", name = "executed_cycles")
    private List<PomodoroCycle> executedCycles;

    public static Pomodoro create(
            Member member,
            EisenhowerItem eisenhowerItem,
            String title,
            LocalTime totalPlannedTime,
            List<PomodoroCycle> pomodoroCycles
    ) {
        return Pomodoro.builder()
                .title(title)
                .member(member)
                .eisenhowerItem(eisenhowerItem)
                .totalPlannedTime(totalPlannedTime)
                .plannedCycles(pomodoroCycles)
                .build();
    }

    public static Pomodoro create(
            Member member,
            String title,
            LocalTime totalPlannedTime,
            List<PomodoroCycle> pomodoroCycles
    ) {
        return Pomodoro.builder()
                .title(title)
                .member(member)
                .totalPlannedTime(totalPlannedTime)
                .plannedCycles(pomodoroCycles)
                .build();
    }

    // 뽀모도로 완료
    public void recordCompletedAt(List<PomodoroCycle> executedCycles) {
        this.completedAt = LocalDateTime.now();
        this.executedCycles = executedCycles;
    }

    // 총 실행 시간 업데이트
    public void updateTotalWorkingTime(LocalTime workingTime) {
        if (workingTime == null || workingTime.isBefore(LocalTime.of(0, 0, 0))) {
            throw new PomodoroDurationException();
        }
        this.totalWorkingTime = workingTime;
    }

    // 총 휴식 시간 업데이트
    public void updateTotalBreakTime(LocalTime breakTime) {
        if (breakTime == null || breakTime.isBefore(LocalTime.of(0, 0, 0))) {
            throw new PomodoroDurationException();
        }
        this.totalBreakTime = breakTime;
    }

    // 총 이용 시간
    public void updateTotalExecutedTime(LocalTime executedTime) {
        if (executedTime == null || executedTime.isBefore(LocalTime.of(0, 0, 0))) {
            throw new PomodoroDurationException();
        }
        this.totalExecutedTime = executedTime;
    }
}
