package capstone.backend.domain.eisenhower.dto.request;

import capstone.backend.domain.common.entity.TaskType;
import java.time.LocalDate;

public record EisenhowerItemUpdateRequest(
        String title,
        TaskType type,
        Long categoryId,
        LocalDate dueDate,
        String memo,
        Boolean isCompleted,
        Boolean dueDateExplicitlyNull,
        Boolean categoryExplicitlyNull
) {
}
