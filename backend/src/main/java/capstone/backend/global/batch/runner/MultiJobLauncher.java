package capstone.backend.global.batch.runner;

import capstone.backend.global.batch.service.MultiJobExecutionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MultiJobLauncher implements ApplicationRunner {

    private final MultiJobExecutionService multiJobExecutionService;

    @Override
    public void run(ApplicationArguments args) {
        log.info("MultiJobLauncher started");

        String[] jobNames = {"notificationJob", "todayTaskAnalysisJob"};

        for (String jobName : jobNames) {
            log.info("Running job {}", jobName);
            multiJobExecutionService.execute(jobName);
        }

        log.info("MultiJobLauncher finished");
    }
}
