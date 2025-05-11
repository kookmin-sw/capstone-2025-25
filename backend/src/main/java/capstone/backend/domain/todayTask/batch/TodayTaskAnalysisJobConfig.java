package capstone.backend.domain.todayTask.batch;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@RequiredArgsConstructor
public class TodayTaskAnalysisJobConfig {
    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final SaveTodayTaskAnalysisTasklet saveTodayTaskAnalysisTasklet;

    @Bean(name = "todayTaskAnalysisJob")
    public Job todayTaskAnalysisJob() {
        return new JobBuilder("todayTaskAnalysisJob", jobRepository)
            .start(saveTodayTaskAnalysisStep())
            .build();
    }

    @Bean
    public Step saveTodayTaskAnalysisStep() {
        return new StepBuilder("saveTodayTaskAnalysisStep", jobRepository)
            .tasklet(saveTodayTaskAnalysisTasklet, transactionManager)
            .build();
    }
}
