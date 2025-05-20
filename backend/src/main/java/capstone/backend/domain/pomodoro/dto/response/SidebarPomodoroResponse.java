package capstone.backend.domain.pomodoro.dto.response;

import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import capstone.backend.domain.eisenhower.entity.EisenhowerQuadrant;
import capstone.backend.domain.pomodoro.entity.Pomodoro;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record SidebarPomodoroResponse(
        Pomodoro pomodoro,
        SidebarEisenhowerItemDTO eisenhower
) {
    public SidebarPomodoroResponse(Pomodoro pomodoro, EisenhowerItem eisenhowerItem) {
        this(
                pomodoro,
                eisenhowerItem != null ? new SidebarEisenhowerItemDTO(eisenhowerItem) : null
        );
    }

    // record가 isLinked() 메서드를 포함해서 JSON 직렬화될 때 linked라는 속성으로 자동 포함
    // 따라서 제거
    @JsonIgnore
    public boolean isLinked() {
        return eisenhower != null;
    }
}

/**
 * eisenhower Entity 구조 파악 후 수정 예정
 */
record SidebarEisenhowerItemDTO(
        Long id,
        String title,
        String memo,
        LocalDate dueDate,
        EisenhowerQuadrant quadrant,
        Long order,
        boolean isCompleted,
        LocalDateTime createdAt
) {
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
