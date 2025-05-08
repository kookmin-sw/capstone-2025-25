package capstone.backend.domain.eisenhower.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record EisenhowerItemOrderUpdateRequests(
        @NotNull
        @Valid
        @Schema(description = "아이젠하워 항목 순서 및 사분면 수정 요청 리스트", required = true)
        @NotNull List<EisenhowerItemOrderUpdateRequest> items
) {
}
