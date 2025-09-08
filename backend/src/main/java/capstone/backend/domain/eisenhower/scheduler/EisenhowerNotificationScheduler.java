package capstone.backend.domain.eisenhower.scheduler;

import java.time.LocalDate;
import java.time.ZoneId;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EisenhowerNotificationScheduler {

    private final Job notificationJob;
    private final JobLauncher jobLauncher;

    @Scheduled(cron = "0 0 0 * * *")
    public void run() throws Exception {
        String runDate = LocalDate.now(ZoneId.of("Asia/Seoul")).toString();
        // JobParameters 생성
        JobParameters jobParameters = new JobParametersBuilder()
                .addString("runDate", runDate)
                .toJobParameters();

        log.info("Eisenhower Notification Scheduler started runDate={}", runDate);
        // Job 실행
        try {
            jobLauncher.run(notificationJob, jobParameters);
        }catch (JobInstanceAlreadyCompleteException e){
            log.info("Eisenhower Notification Scheduler already runDate={}", runDate);
        }

        log.info("Eisenhower Notification Scheduler finished runDate={}", runDate);
    }
}
