package capstone.backend.domain.todayTask.scheduler;

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
public class TodayTaskAnalysisScheduler {

    private final JobLauncher jobLauncher;
    private final Job todayTaskAnalysisJob;

    @Scheduled(cron = "0 0 0 * * *")
    public void saveTodayTaskAnalysis(){
        JobParameters jobParameters = new JobParametersBuilder()
            .addLong("timestamp", System.currentTimeMillis())
                .toJobParameters();

        log.info("Starting daily task analysis at midnight");
        try {
            jobLauncher.run(todayTaskAnalysisJob, jobParameters);
            log.info("Successfully completed daily task analysis");
        } catch (Exception e) {
            log.error("Error during daily task analysis: ", e);
        }
    }
}
