package capstone.backend.domain.eisenhower.dto.response;

import capstone.backend.domain.common.entity.TaskType;
import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import capstone.backend.domain.eisenhower.entity.EisenhowerQuadrant;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record EisenhowerItemResponse(
        Long id,
        String title,
        String memo,
        String categoryTitle,
        String categoryColor,
        EisenhowerQuadrant quadrant,
        TaskType type,
        LocalDate dueDate,
        Long order,
        Boolean isCompleted,
        LocalDateTime createdAt
) {
    public static EisenhowerItemResponse from(EisenhowerItem item) {
        return new EisenhowerItemResponse(
                item.getId(),
                item.getTitle(),
                item.getMemo(),
                item.getCategory() != null ? item.getCategory().getTitle() : null,
                item.getCategory() != null ? item.getCategory().getColor() : null,
                item.getQuadrant(),
                item.getType(),
                item.getDueDate(),
                item.getOrder(),
                item.getIsCompleted(),
                item.getCreatedAt()
        );
    }

}
