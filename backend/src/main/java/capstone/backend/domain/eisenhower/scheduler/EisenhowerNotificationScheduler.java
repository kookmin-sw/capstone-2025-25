package capstone.backend.domain.eisenhower.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EisenhowerNotificationScheduler {

    private final Job notificationJob;
    private final JobLauncher jobLauncher;

    @Scheduled(cron = "0 0 6 * * *")
    public void run() throws Exception {
        // JobParameters 생성
        JobParameters jobParameters = new JobParametersBuilder()
                .addLong("timestamp", System.currentTimeMillis())
                .toJobParameters();

        log.info("Eisenhower Notification Scheduler started");
        // Job 실행
        jobLauncher.run(notificationJob, jobParameters);
        log.info("Eisenhower Notification Scheduler finished");
    }
}
