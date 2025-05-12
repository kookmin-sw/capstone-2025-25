package capstone.backend.domain.pomodoro.util;

import capstone.backend.domain.pomodoro.schema.PomodoroCycle;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public class PomodoroTimeUtils {

    private PomodoroTimeUtils() {
        throw new UnsupportedOperationException("유틸 클래스는 인스턴스화할 수 없습니다.");
    }

    public static int[] calculateTotalTimeSummary(List<PomodoroCycle> cycles) {
        int totalWorkingSeconds = 0;
        int totalBreakSeconds = 0;

        for (PomodoroCycle cycle : cycles) {
            totalWorkingSeconds += Optional.ofNullable(cycle.getWorkDuration()).orElse(0) * 60;
            totalBreakSeconds += Optional.ofNullable(cycle.getBreakDuration()).orElse(0) * 60;
        }

        return new int[]{
                totalWorkingSeconds,
                totalBreakSeconds,
                totalWorkingSeconds + totalBreakSeconds
        };
    }

    public static LocalTime convertSecondsToLocalTime(int totalSeconds) {
        int hours = totalSeconds / 3600;
        int minutes = (totalSeconds % 3600) / 60;
        int seconds = totalSeconds % 60;
        return LocalTime.of(hours, minutes, seconds);
    }
}
