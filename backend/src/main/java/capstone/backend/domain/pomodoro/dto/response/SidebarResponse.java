package capstone.backend.domain.pomodoro.dto.response;

import java.util.List;

public record SidebarResponse(
        List<SidebarPomodoroResponse> unlinkedPomodoros,
        List<SidebarPomodoroResponse> linkedPomodoros
) {}

