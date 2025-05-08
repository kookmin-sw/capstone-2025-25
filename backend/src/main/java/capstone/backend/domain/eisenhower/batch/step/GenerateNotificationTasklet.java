package capstone.backend.domain.eisenhower.batch.step;

import capstone.backend.domain.eisenhower.service.EisenhowerNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;

@Component
@RequiredArgsConstructor
public class GenerateNotificationTasklet implements Tasklet {

    private final EisenhowerNotificationService eisenhowerNotificationService;

    @Override
    public RepeatStatus execute(@NonNull StepContribution contribution, @NonNull ChunkContext chunkContext) {
        eisenhowerNotificationService.generateDailyNotifications();
        return RepeatStatus.FINISHED;
    }
}
