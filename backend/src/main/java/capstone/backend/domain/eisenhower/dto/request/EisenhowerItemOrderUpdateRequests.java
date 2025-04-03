package capstone.backend.domain.eisenhower.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record EisenhowerItemOrderUpdateRequests(
        @NotNull List<EisenhowerItemOrderUpdateRequest> items
) {
}
