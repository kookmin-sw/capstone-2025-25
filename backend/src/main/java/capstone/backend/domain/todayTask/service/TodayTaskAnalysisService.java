package capstone.backend.domain.todayTask.service;

import capstone.backend.domain.todayTask.dto.response.TodayTaskAnalysisResponse;
import capstone.backend.domain.todayTask.entity.TodayTaskAnalysis;
import capstone.backend.domain.todayTask.repository.TodayTaskAnalysisRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TodayTaskAnalysisService {

    private final TodayTaskAnalysisRepository todayTaskAnalysisRepository;

    public List<TodayTaskAnalysisResponse> getWeeklyAnalysis(Long memberId) {
        LocalDate endDate = LocalDate.now().minusDays(1);
        LocalDate startDate = endDate.minusDays(6);
        List<TodayTaskAnalysis> analysisList = todayTaskAnalysisRepository.findByMemberIdAndDateBetween(memberId, startDate, endDate);
        return TodayTaskAnalysisResponse.fromList(analysisList);
    }
}
