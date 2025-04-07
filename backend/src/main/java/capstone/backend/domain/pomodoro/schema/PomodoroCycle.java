package capstone.backend.domain.pomodoro.schema;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PomodoroCycle {
    private Integer workDuration; // 초단위
    private Integer breakDuration; // 초단위
}
