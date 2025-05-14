package capstone.backend.domain.pomodoro.dto.response;

import capstone.backend.domain.pomodoro.schema.DailyPomodoroSummary;

import java.time.LocalDate;

public record DailyPomodoroDTO(
        Long dailyPomodoroSummaryId,
        LocalDate createdAt,
        Long totalTime,
        String dayOfWeek
) {
    public DailyPomodoroDTO(DailyPomodoroSummary summary) {
        this(
                summary.getId(),
                summary.getCreatedAt(),
                summary.getTotalTime(),
                summary.getDayOfWeek()
        );
    }
}
