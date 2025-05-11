package capstone.backend.domain.todayTask.batch;

import capstone.backend.domain.todayTask.service.TodayTaskAnalysisService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SaveTodayTaskAnalysisTasklet implements Tasklet {

    private final TodayTaskAnalysisService todayTaskAnalysisService;

    @Override
    public RepeatStatus execute(@NonNull StepContribution contribution, @NonNull ChunkContext chunkContext) {
        todayTaskAnalysisService.saveTodayTask();

        return RepeatStatus.FINISHED;
    }
}
