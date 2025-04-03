package capstone.backend.domain.eisenhower.dto.response;

import capstone.backend.domain.common.entity.TaskType;
import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import capstone.backend.domain.eisenhower.entity.EisenhowerQuadrant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record EisenhowerItemResponse(
        Long id,
        String title,
        String memo,
        Long category_id,
        EisenhowerQuadrant quadrant,
        TaskType type,
        LocalDate dueDate,
        Long order,
        Boolean isCompleted,
        LocalDateTime createdAt,
        Long mindMapId
//        Long pomodoroId
) {
    public static EisenhowerItemResponse from(EisenhowerItem item) {
        return new EisenhowerItemResponse(
                item.getId(),
                item.getTitle(),
                item.getMemo(),
                item.getCategory() != null ? item.getCategory().getId() : null,
                item.getQuadrant(),
                item.getType(),
                item.getDueDate(),
                item.getOrder(),
                item.getIsCompleted(),
                item.getCreatedAt(),
                item.getMindMap() != null ? item.getMindMap().getId() : null
//                item.getPomodoro() != null ? item.getPomodoro().getId() : null
        );
    }

    public static List<EisenhowerItemResponse> listFrom(List<EisenhowerItem> items) {
        return items.stream()
                .map(EisenhowerItemResponse::from)
                .toList();
    }
}
