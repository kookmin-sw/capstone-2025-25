package capstone.backend.domain.eisenhower.batch.step;

import capstone.backend.domain.eisenhower.repository.EisenhowerNotificationRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;

@Component
@RequiredArgsConstructor
public class DeleteOldNotificationsTasklet implements Tasklet {

    private final EisenhowerNotificationRepository eisenhowerNotificationRepository;

    @Override
    public RepeatStatus execute(@NonNull StepContribution contribution, @NonNull ChunkContext chunkContext) {
        LocalDate today = LocalDate.now();
        eisenhowerNotificationRepository.deleteAllByDueDateBefore(today.minusDays(7));
        return RepeatStatus.FINISHED;
    }
}
