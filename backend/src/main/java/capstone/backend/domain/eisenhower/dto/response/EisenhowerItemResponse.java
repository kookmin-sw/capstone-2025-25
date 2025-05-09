package capstone.backend.domain.eisenhower.dto.response;

import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import capstone.backend.domain.eisenhower.entity.EisenhowerQuadrant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record EisenhowerItemResponse(
        Long id,
        String title,
        String memo,
        Long categoryId,
        EisenhowerQuadrant quadrant,
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
                item.getCategory() != null ? item.getCategory().getId() : null,
                item.getQuadrant(),
                item.getDueDate(),
                item.getOrder(),
                item.getIsCompleted(),
                item.getCreatedAt()
        );
    }

    public static List<EisenhowerItemResponse> listFrom(List<EisenhowerItem> items) {
        return items.stream()
                .map(EisenhowerItemResponse::from)
                .toList();
    }
}
