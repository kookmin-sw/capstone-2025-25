package capstone.backend.domain.todayTask.dto.response;

import capstone.backend.domain.todayTask.entity.TodayTaskItem;
import java.time.LocalDate;

public record TodayTaskItemResponse(
    Long id,
    String title,
    Long category_id,
    String memo,
    LocalDate dueDate,
    LocalDate taskDate,
    boolean isCompleted
) {
    public static TodayTaskItemResponse from(TodayTaskItem todayTaskItem) {
        return new TodayTaskItemResponse(
            todayTaskItem.getId(),
            todayTaskItem.getEisenhowerItem().getTitle(),
            todayTaskItem.getEisenhowerItem().getCategory() != null ? todayTaskItem.getEisenhowerItem().getCategory().getId() : null ,
            todayTaskItem.getEisenhowerItem().getMemo(),
            todayTaskItem.getEisenhowerItem().getDueDate(),
            todayTaskItem.getTaskDate(),
            todayTaskItem.getEisenhowerItem().getIsCompleted()
        );
    }
}
