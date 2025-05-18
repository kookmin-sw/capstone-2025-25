package capstone.backend.domain.pomodoro.repository;

import capstone.backend.domain.pomodoro.entity.DailyPomodoroSummary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyPomodoroSummaryRepository extends JpaRepository<DailyPomodoroSummary, Long> {

    Optional<DailyPomodoroSummary> findByMemberIdAndCreatedAt(Long member_id, LocalDate createdAt);

    // 기간 내 뽀모도로 총량
    List<DailyPomodoroSummary> findAllByMemberIdAndCreatedAtBetweenOrderByCreatedAtAsc(Long memberId, LocalDate startDate, LocalDate endDate);
}