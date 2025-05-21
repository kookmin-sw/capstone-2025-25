package capstone.backend.domain.pomodoro.dto.request;

import capstone.backend.domain.pomodoro.entity.PomodoroCycle;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record CreatePomodoroRequest(
        @NotBlank(message = "총 시간을 입력해주세요.")
        @Pattern(
                regexp = "^(?!00:00:00$)([0-1]?\\d|2[0-3]):[0-5]\\d:[0-5]\\d$",
                message = "HH:MM:SS 형식으로 입력해야 하며, 최소 1초 이상 입력해야 합니다."
        )
        @Schema(description = "사용자가 지정한 총 시간", example = "00:01:00")
        String totalPlannedTime,

        @NotBlank(message = "제목을 입력해주세요.")
        @Schema(description = "제목")
        String title,

        @Schema(description = "아이젠하워 매핑 여부를 위한 ID 값")
        Long eisenhowerId,

        @NotEmpty(message = "뽀모도로 사이클을 등록해주세요.")
        @Schema(description = "뽀모도로 사이클 목록")
        List<PomodoroCycle> plannedCycles
) {}
