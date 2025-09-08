package capstone.backend.domain.eisenhower.repository;

import capstone.backend.domain.eisenhower.entity.EisenhowerNotification;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EisenhowerNotificationRepository extends JpaRepository<EisenhowerNotification, Long> {
    List<EisenhowerNotification> findAllByMemberIdOrderByDueDateDesc(Long memberId);

    void deleteAllByNotificationDateBefore(LocalDate date);

    boolean existsByMemberIdAndEisenhowerItemIdAndNotificationDate(Long id, Long id1, LocalDate runDate);
}
