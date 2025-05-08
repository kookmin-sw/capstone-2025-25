package capstone.backend.domain.todayTask.repository;

import capstone.backend.domain.todayTask.entity.TodayTaskItem;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodayTaskItemRepository extends JpaRepository<TodayTaskItem, Long> {
    List<TodayTaskItem> findByMemberIdAndTaskDate(Long memberId, LocalDate taskDate);
}
