package capstone.backend.domain.eisenhower.batch.step;

import capstone.backend.domain.eisenhower.service.EisenhowerNotificationService;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GenerateNotificationTasklet implements Tasklet {

    private final EisenhowerNotificationService eisenhowerNotificationService;

    @Override
    public RepeatStatus execute(@NonNull StepContribution contribution, @NonNull ChunkContext chunkContext) {
        String runDateStr = (String) chunkContext.getStepContext().getJobParameters().get("runDate");
        LocalDate runDate = LocalDate.parse(runDateStr);
        eisenhowerNotificationService.generateDailyNotifications(runDate);
        return RepeatStatus.FINISHED;
    }
}
