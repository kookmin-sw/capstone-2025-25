package capstone.backend.domain.eisenhower.batch;

import capstone.backend.domain.eisenhower.batch.step.DeleteOldNotificationsTasklet;
import capstone.backend.domain.eisenhower.batch.step.GenerateNotificationTasklet;
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
public class NotificationJobConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final GenerateNotificationTasklet generateNotificationTasklet;
    private final DeleteOldNotificationsTasklet deleteOldNotificationTasklet;

    // 알림 생성 및 삭제 Job
    @Bean
    public Job notificationJob() {
        return new JobBuilder("notificationJob", jobRepository)
                .start(generateNotificationStep())
                .next(deleteOldNotificationStep())
                .build();
    }

    // 알림 생성 Step
    @Bean
    public Step generateNotificationStep() {
        return new StepBuilder("generateNotificationStep", jobRepository)
                .tasklet(generateNotificationTasklet, transactionManager)
                .build();
    }

    // 알림 삭제 Step
    @Bean
    public Step deleteOldNotificationStep() {
        return new StepBuilder("deleteOldNotificationStep", jobRepository)
                .tasklet(deleteOldNotificationTasklet, transactionManager)
                .build();
    }
}
