package capstone.backend.domain.mindmap.dto.response;

import capstone.backend.domain.common.entity.TaskType;
import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import capstone.backend.domain.eisenhower.entity.EisenhowerQuadrant;
import capstone.backend.domain.mindmap.entity.MindMap;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record SidebarMindMapResponse(
    Long id,
    String title,
    TaskType type,
    LocalDateTime lastModifiedAt,
    SidebarEisenhowerItemDTO eisenhowerItemDTO,
    boolean linked
){
    public static SidebarMindMapResponse from(MindMap mindMap, EisenhowerItem eisenhowerItem){
        return new SidebarMindMapResponse(
            mindMap.getId(),
            mindMap.getTitle(),
            mindMap.getType(),
            mindMap.getLastModifiedAt(),
            eisenhowerItem != null ? new SidebarEisenhowerItemDTO(eisenhowerItem) : null,
            eisenhowerItem != null
        );
    }
}

record SidebarEisenhowerItemDTO(
    Long id,
    String title,
    String memo,
    LocalDate dueDate,
    EisenhowerQuadrant quadrant,
    Long order,
    boolean isCompleted,
    LocalDateTime createdAt
){
    SidebarEisenhowerItemDTO(EisenhowerItem eisenhowerItem) {
        this(
            eisenhowerItem.getId(),
            eisenhowerItem.getTitle(),
            eisenhowerItem.getMemo(),
            eisenhowerItem.getDueDate(),
            eisenhowerItem.getQuadrant(),
            eisenhowerItem.getOrder(),
            eisenhowerItem.getIsCompleted(),
            eisenhowerItem.getCreatedAt()
        );
    }
}

