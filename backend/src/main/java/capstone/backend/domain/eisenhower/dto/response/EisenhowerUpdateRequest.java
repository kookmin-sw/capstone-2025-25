package capstone.backend.domain.eisenhower.dto.response;

import capstone.backend.domain.common.entity.TaskType;
import java.time.LocalDate;

public record EisenhowerUpdateRequest(
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
