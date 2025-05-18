package capstone.backend.domain.pomodoro.entity;

import capstone.backend.domain.member.entity.Member;
import capstone.backend.domain.pomodoro.exception.PomodoroDurationException;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
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
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Member member;

    @Column(name = "title", nullable = false)
    private String title;

    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "total_planned_time", nullable = false)
    private LocalTime totalPlannedTime;

    @Column(name = "total_planned_working_time", nullable = false)
    private LocalTime totalPlannedWorkingTime;

    @Column(name = "total_planned_break_time", nullable = false)
    private LocalTime totalPlannedBreakTime;

    @Column(name = "total_executed_time")
    private LocalTime totalExecutedTime;

    @Column(name = "total_executed_working_time")
    private LocalTime totalExecutedWorkingTime;

    @Column(name = "total_executed_break_time")
    private LocalTime totalExecutedBreakTime;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false, name = "planned_cycles")
    private List<PomodoroCycle> plannedCycles;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", name = "executed_cycles")
    private List<PomodoroCycle> executedCycles;

    public static Pomodoro create(
            Member member,
            String title,
            LocalTime totalPlannedTime,
            List<PomodoroCycle> pomodoroCycles,
            LocalTime totalPlannedWorkingTime,
            LocalTime totalPlannedBreakTime
    ) {
        return Pomodoro.builder()
                .title(title)
                .member(member)
                .totalPlannedTime(totalPlannedTime)
                .plannedCycles(pomodoroCycles)
                .totalPlannedWorkingTime(totalPlannedWorkingTime)
                .totalPlannedBreakTime(totalPlannedBreakTime)
                .build();
    }

    // 뽀모도로 완료
    public void recordCompletedAt(List<PomodoroCycle> executedCycles) {
        this.completedAt = LocalDateTime.now();
        this.executedCycles = executedCycles;
    }

    // 총 실행 시간 업데이트
    public void updateTotalExecutedWorkingTime(LocalTime workingTime) {
        if (workingTime == null || workingTime.isBefore(LocalTime.of(0, 0, 0))) {
            throw new PomodoroDurationException();
        }
        this.totalExecutedWorkingTime = workingTime;
    }

    // 총 휴식 시간 업데이트
    public void updateTotalExecutedBreakTime(LocalTime breakTime) {
        if (breakTime == null || breakTime.isBefore(LocalTime.of(0, 0, 0))) {
            throw new PomodoroDurationException();
        }
        this.totalExecutedBreakTime = breakTime;
    }

    // 총 이용 시간
    public void updateTotalExecutedTime(LocalTime executedTime) {
        if (executedTime == null || executedTime.isBefore(LocalTime.of(0, 0, 0))) {
            throw new PomodoroDurationException();
        }
        this.totalExecutedTime = executedTime;
    }
}
