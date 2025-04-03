package capstone.backend.domain.eisenhower.dto.request;

import jakarta.validation.constraints.NotNull;

public record EisenhowerCategoryCreateRequest(
        @NotNull String title,
        @NotNull String color
) {
}
