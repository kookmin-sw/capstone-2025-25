package capstone.backend.domain.eisenhower.dto.response;


import capstone.backend.domain.eisenhower.entity.EisenhowerNotification;
import java.time.LocalDate;

public record EisenhowerNotificationResponse(
        Long notificationId,
        Long eisenhowerItemId,
        String title,
        LocalDate dueDate
) {
    public static EisenhowerNotificationResponse from(EisenhowerNotification notification) {
        return new EisenhowerNotificationResponse(
                notification.getId(),
                notification.getEisenhowerItemId(),
                notification.getTitle(),
                notification.getDueDate()
        );
    }
}
