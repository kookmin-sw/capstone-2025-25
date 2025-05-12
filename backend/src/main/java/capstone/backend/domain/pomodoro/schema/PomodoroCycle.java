package capstone.backend.domain.pomodoro.schema;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PomodoroCycle {
    @NotNull(message = "작업 시간(workDuration)은 필수입니다.")
    @Min(value = 0, message = "작업 시간(workDuration)은 0 이상이어야 합니다.")
    @Schema(description = "작업 시간 (초 단위)", example = "1500")
    private Integer workDuration; // 초단위

    @NotNull(message = "휴식 시간(breakDuration)은 필수입니다.")
    @Min(value = 0, message = "휴식 시간(breakDuration)은 0 이상이어야 합니다.")
    @Schema(description = "휴식 시간 (초 단위)", example = "300")
    private Integer breakDuration; // 초단위
}
