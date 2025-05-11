package capstone.backend.domain.todayTask.scheduler;

import capstone.backend.domain.todayTask.service.TodayTaskAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TodayTaskAnalysisScheduler {

    private TodayTaskAnalysisService todayTaskAnalysisService;

    @Scheduled(cron = "0 0 0 * * *")
    public void saveTodayTaskAnalysis() throws Exception {
        log.info("Starting daily task analysis at midnight");
        try {
            todayTaskAnalysisService.saveTodayTask();
            log.info("Successfully completed daily task analysis");
        } catch (Exception e) {
            log.error("Error during daily task analysis: ", e);
        }
    }
}
