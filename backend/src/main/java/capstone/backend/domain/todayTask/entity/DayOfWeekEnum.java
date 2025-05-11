package capstone.backend.domain.todayTask.entity;

import java.time.DayOfWeek;

public enum DayOfWeekEnum {
    MON,
    SUN,
    TUE,
    WED,
    THU,
    FRI,
    SAT;

    public static DayOfWeekEnum from(DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> MON;
            case TUESDAY -> TUE;
            case WEDNESDAY -> WED;
            case THURSDAY -> THU;
            case FRIDAY -> FRI;
            case SATURDAY -> SAT;
            case SUNDAY -> SUN;
        };
    }
}
