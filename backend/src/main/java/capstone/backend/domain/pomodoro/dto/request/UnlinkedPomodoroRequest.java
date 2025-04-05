package capstone.backend.domain.pomodoro.dto.request;

import capstone.backend.domain.pomodoro.schema.PomodoroCycle;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record UnlinkedPomodoroRequest(
        @NotBlank(message = "총 시간을 입력해주세요.")
        @Pattern(
                regexp = "^(?!00:00$)([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",
                message = "HH:MM 형식으로 입력해야 하며, 1분 이상 입력해주세요."
        )
        @Schema(description = "사용자가 지정한 총 시간", example = "00:00")
        String totalPlannedTime,

        @NotBlank(message = "제목을 입력해주세요.")
        @Schema(description = "제목")
        String title,

        @NotEmpty(message = "뽀모도로 사이클을 등록해주세요.")
        @Schema(description = "뽀모도로 사이클 목록")
        List<PomodoroCycle> plannedCycles
) {}
