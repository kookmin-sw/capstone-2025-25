package capstone.backend.domain.todayTask.repository;

import capstone.backend.domain.todayTask.entity.TodayTaskItem;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodayTaskItemRepository extends JpaRepository<TodayTaskItem, Long> {
    Page<TodayTaskItem> findByMemberIdAndTaskDate(Long memberId, LocalDate taskDate, Pageable pageable);
    Long countByMemberIdAndTaskDate(Long memberId, LocalDate taskDate);
    Long countByMemberIdAndTaskDateAndEisenhowerItemIsCompleted(Long memberId, LocalDate taskDate, boolean isCompleted);
    Optional<TodayTaskItem> findByIdAndMemberId(Long id, Long memberId);
    Page<TodayTaskItem> findByMemberIdAndTaskDateAndEisenhowerItemIsCompleted(Long memberId, LocalDate taskDate, boolean isCompleted, Pageable pageable);
}
