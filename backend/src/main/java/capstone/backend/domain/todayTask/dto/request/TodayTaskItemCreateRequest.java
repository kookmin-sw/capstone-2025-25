package capstone.backend.domain.todayTask.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;


public record TodayTaskItemCreateRequest(
    @NotNull
    @NotEmpty
    @Schema(description = "오늘의 할 일에 추가할 아이젠하워 ID 목록", example = "[1, 2, 3]")
    List<Long> eisenhowerItemIds
){}
