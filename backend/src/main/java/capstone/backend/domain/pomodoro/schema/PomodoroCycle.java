package capstone.backend.domain.pomodoro.schema;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PomodoroCycle {
    @NotNull(message = "작업 시간(workDuration)은 필수입니다.")
    @Min(value = 0, message = "작업 시간(workDuration)은 0 이상이어야 합니다.")
    private Integer workDuration; // 초단위

    @NotNull(message = "휴식 시간(breakDuration)은 필수입니다.")
    @Min(value = 0, message = "휴식 시간(breakDuration)은 0 이상이어야 합니다.")
    private Integer breakDuration; // 초단위
}
