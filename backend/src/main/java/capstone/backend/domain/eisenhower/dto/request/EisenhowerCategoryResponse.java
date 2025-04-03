package capstone.backend.domain.eisenhower.dto.request;

import capstone.backend.domain.eisenhower.entity.EisenhowerCategory;

public record EisenhowerCategoryResponse(
        Long id,
        String title,
        String color
) {
    public static EisenhowerCategoryResponse from(EisenhowerCategory eisenhowerCategory) {
        return new EisenhowerCategoryResponse(
                eisenhowerCategory.getId(),
                eisenhowerCategory.getTitle(),
                eisenhowerCategory.getColor()
        );
    }
}
