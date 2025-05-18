package capstone.backend.domain.pomodoro.dto.request;

import capstone.backend.domain.pomodoro.entity.PomodoroCycle;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record RecordPomodoroRequest(
        @Valid
        @NotEmpty(message = "실제 실행 기록을 입력해주세요.")
        @Schema(description = "실제 실행 기간 별 초 단위 기록")
        List<PomodoroCycle> executedCycles
) {
}
