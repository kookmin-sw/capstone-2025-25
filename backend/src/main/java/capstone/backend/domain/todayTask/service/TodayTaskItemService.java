package capstone.backend.domain.todayTask.service;

import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import capstone.backend.domain.eisenhower.exception.EisenhowerItemNotFoundException;
import capstone.backend.domain.eisenhower.repository.EisenhowerItemRepository;
import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import capstone.backend.domain.todayTask.dto.request.TodayTaskItemCreateRequest;
import capstone.backend.domain.todayTask.dto.response.TodayTaskItemResponse;
import capstone.backend.domain.todayTask.entity.TodayTaskItem;
import capstone.backend.domain.todayTask.exception.TodayTaskNotFoundException;
import capstone.backend.domain.todayTask.repository.TodayTaskItemRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TodayTaskItemService {

    private final TodayTaskItemRepository todayTaskItemRepository;
    private final MemberRepository memberRepository;
    private final EisenhowerItemRepository eisenhowerItemRepository;

    //오늘의 할 일 추가
    @Transactional
    public List<TodayTaskItemResponse> addTaskItem(Long memberId, TodayTaskItemCreateRequest request) {
        Member member = memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);

        return request.eisenhowerItemIds().stream()
            .map(itemId -> {
                EisenhowerItem eisenhowerItem = eisenhowerItemRepository.findByIdAndMemberId(itemId, memberId)
                    .orElseThrow(EisenhowerItemNotFoundException::new);

                TodayTaskItem todayTaskItem = TodayTaskItem.from(member, eisenhowerItem);
                todayTaskItemRepository.save(todayTaskItem);

                return TodayTaskItemResponse.from(todayTaskItem);
            })
            .toList();
    }

    //오늘의 할 일 조회
    public Page<TodayTaskItemResponse> getTodayTasks(Long memberId, Pageable pageable) {
        Page<TodayTaskItem> todayTasks = todayTaskItemRepository.findByMemberIdAndTaskDate(memberId, getDate(), pageable);
        return todayTasks.map(TodayTaskItemResponse::from);
    }

    //할 일 전체 개수 조회
    public Long getTaskItemCount(Long memberId) {
        return todayTaskItemRepository.countByMemberIdAndTaskDate(memberId, getDate());
    }

    //완료된 할 일 개수 조회
    public Long getCompletedTaskItemCount(Long memberId) {
        return todayTaskItemRepository.countByMemberIdAndTaskDateAndEisenhowerItemIsCompleted(memberId, getDate(), true);
    }

    //오늘의 할 일에서 삭제
    @Transactional
    public void deleteTaskItem(Long memberId, Long taskId) {
        TodayTaskItem todayTaskItem = todayTaskItemRepository.findByIdAndMemberId(taskId, memberId)
            .orElseThrow(TodayTaskNotFoundException::new);

        todayTaskItemRepository.delete(todayTaskItem);
    }

    //어제 할 일 중 완료되지 않은 할 일 가져오기
    public Page<TodayTaskItemResponse> getYesterdayTaskItems(Long memberId, Pageable pageable){
        Page<TodayTaskItem> yesterdayTasks = todayTaskItemRepository.findByMemberIdAndTaskDateAndEisenhowerItemIsCompleted(memberId, getDate().minusDays(1), false, pageable);

        return yesterdayTasks.map(TodayTaskItemResponse::from);
    }

    //할 일 날짜를 오늘로 변경
    @Transactional
    public TodayTaskItemResponse updateTaskDateToToday(Long memberId, Long taskId) {
        TodayTaskItem todayTaskItem = todayTaskItemRepository.findByIdAndMemberId(taskId, memberId)
            .orElseThrow(TodayTaskNotFoundException::new);

        todayTaskItem.updateTaskDate(LocalDate.now());

        todayTaskItemRepository.save(todayTaskItem);
        return TodayTaskItemResponse.from(todayTaskItem);
    }

    //오늘의 할 일 날짜를 어제로 변경
    @Transactional
    public TodayTaskItemResponse updateTaskDateToYesterday(Long memberId, Long taskId) {
        TodayTaskItem todayTaskItem = todayTaskItemRepository.findByIdAndMemberId(taskId, memberId)
            .orElseThrow(TodayTaskNotFoundException::new);

        todayTaskItem.updateTaskDate(LocalDate.now().minusDays(1));

        todayTaskItemRepository.save(todayTaskItem);
        return TodayTaskItemResponse.from(todayTaskItem);
    }

    //오전 6시 기준 날짜 가져오기
    private LocalDate getDate() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sixAM = now.with(LocalTime.of(6, 0));
        return now.isBefore(sixAM) ? LocalDate.now().minusDays(1) : LocalDate.now();
    }
}
