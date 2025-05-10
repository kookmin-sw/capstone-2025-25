package capstone.backend.domain.todayTask.dto.response;

import capstone.backend.domain.todayTask.entity.TodayTaskAnalysis;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public record TodayTaskAnalysisResponse(
    Long id,
    LocalDate taskDate,
    String dayOfWeek,
    Long completedNum
) {
    public static TodayTaskAnalysisResponse from(TodayTaskAnalysis todayTaskAnalysis) {
        return new TodayTaskAnalysisResponse(
            todayTaskAnalysis.getId(),
            todayTaskAnalysis.getDate(),
            todayTaskAnalysis.getDayOfWeek(),
            todayTaskAnalysis.getCompletedNum()
        );
    }

    public static List<TodayTaskAnalysisResponse> fromList(List<TodayTaskAnalysis> todayTaskAnalysisList){
        return todayTaskAnalysisList.stream()
            .map(TodayTaskAnalysisResponse::from)
            .collect(Collectors.toList());
    }
}
