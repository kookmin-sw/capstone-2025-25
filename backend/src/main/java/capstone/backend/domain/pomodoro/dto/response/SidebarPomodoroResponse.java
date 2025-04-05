package capstone.backend.domain.pomodoro.dto.response;

import capstone.backend.domain.eisenhower.schema.EisenhowerItem;
import capstone.backend.domain.pomodoro.schema.Pomodoro;

public record SidebarPomodoroResponse(
    Pomodoro pomodoro,
    SidebarEisenhowerItemDTO eisenhower
) {
    public SidebarPomodoroResponse(Pomodoro pomodoro) {
        this(
            pomodoro,
            pomodoro.getEisenhowerItem() != null
                ? new SidebarEisenhowerItemDTO(pomodoro.getEisenhowerItem())
                : null
        );
    }
}

/**
 * eisenhower Entity 구조 파악 후 수정 예정
 */
record SidebarEisenhowerItemDTO(
        Long id,
        String title
//        String memo,
//        String dueDate,
//        String quadrant,
//        String type,
//        boolean isPinned,
//        boolean isTodayTask,
//        LocalDate todayTaskDate,
//        String order,
//        boolean isCompleted,
//        LocalDateTime createdAt
) {
    SidebarEisenhowerItemDTO(EisenhowerItem eisenhowerItem) {
        this(
                eisenhowerItem.getId(),
                eisenhowerItem.getTitle()
//                eisenhowerItem.getMemo(),
//                eisenhowerItem.getDueDate(),
//                eisenhowerItem.getQuadrant(),
//                eisenhowerItem.getType(),
//                eisenhowerItem.getIsPinned(),
//                eisenhowerItem.getIsTodayTask(),
//                eisenhowerItem.getTodayTaskDate(),
//                eisenhowerItem.getorder(),
//                eisenhowerItem.getIsCompleted(),
//                eisenhowerItem.getCreatedAt()
        );
    }
}

