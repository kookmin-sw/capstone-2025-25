package capstone.backend.domain.eisenhower.scheduler;

import capstone.backend.domain.eisenhower.service.EisenhowerNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EisenhowerNotificationScheduler {

    private final EisenhowerNotificationService notificationService;

    @Scheduled(cron = "0 0 6 * * *")
    public void run() {
        log.info("Eisenhower Notification Scheduler started");
        notificationService.generateDailyNotifications();
        log.info("Eisenhower Notification Scheduler finished");
    }
}
