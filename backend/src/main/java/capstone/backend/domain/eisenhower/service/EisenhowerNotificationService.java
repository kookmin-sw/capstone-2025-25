package capstone.backend.domain.eisenhower.service;

import capstone.backend.domain.eisenhower.dto.response.EisenhowerNotificationResponse;
import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import capstone.backend.domain.eisenhower.entity.EisenhowerNotification;
import capstone.backend.domain.eisenhower.repository.EisenhowerItemRepository;
import capstone.backend.domain.eisenhower.repository.EisenhowerNotificationRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EisenhowerNotificationService {

    private final EisenhowerNotificationRepository eisenhowerNotificationRepository;
    private final EisenhowerItemRepository eisenhowerItemRepository;

    public List<EisenhowerNotificationResponse> getNotifications(Long memberId) {
        return eisenhowerNotificationRepository.findAllByMemberIdOrderByDueDateDesc(memberId)
                .stream()
                .map(EisenhowerNotificationResponse::from)
                .toList();
    }

    @Transactional
    public void generateDailyNotifications(LocalDate runDate) {
        LocalDate tomorrow = runDate.plusDays(1);

        List<EisenhowerItem> dueTodayItems = eisenhowerItemRepository.findAllByDueDateAndIsCompleted(tomorrow, false);

        for (EisenhowerItem item : dueTodayItems) {
            boolean exists = eisenhowerNotificationRepository.existsByMemberIdAndEisenhowerItemIdAndNotificationDate(
                    item.getMember().getId(),
                    item.getId(),
                    runDate
            );

            if (!exists) {
                try {
                    eisenhowerNotificationRepository.save(EisenhowerNotification.of(item, runDate));
                } catch (DataIntegrityViolationException ignore) {
                    // 중복 알림이 이미 존재하는 경우 무시
                }
            }
        }
    }
}
