package capstone.backend.domain.todayTask.repository;

import capstone.backend.domain.todayTask.entity.TodayTaskAnalysis;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodayTaskAnalysisRepository extends JpaRepository<TodayTaskAnalysis, Long> {
    List<TodayTaskAnalysis> findByMemberIdAndDateBetween(Long memberId, LocalDate startDate, LocalDate endDate);
    Optional<TodayTaskAnalysis> findByMemberIdAndDate(Long memberId, LocalDate date);
}