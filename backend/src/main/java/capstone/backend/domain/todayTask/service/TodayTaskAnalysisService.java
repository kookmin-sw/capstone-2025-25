package capstone.backend.domain.todayTask.service;

import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import capstone.backend.domain.todayTask.dto.response.TodayTaskAnalysisResponse;
import capstone.backend.domain.todayTask.entity.TodayTaskAnalysis;
import capstone.backend.domain.todayTask.repository.TodayTaskAnalysisRepository;
import capstone.backend.domain.todayTask.repository.TodayTaskItemRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TodayTaskAnalysisService {

    private final MemberRepository memberRepository;
    private final TodayTaskAnalysisRepository todayTaskAnalysisRepository;
    private final TodayTaskItemRepository todayTaskItemRepository;

    public List<TodayTaskAnalysisResponse> getWeeklyAnalysis(Long memberId) {
        LocalDate endDate = LocalDate.now().minusDays(1);
        LocalDate startDate = endDate.minusDays(6);
        List<TodayTaskAnalysis> analysisList = todayTaskAnalysisRepository.findByMemberIdAndDateBetween(memberId, startDate, endDate);
        return TodayTaskAnalysisResponse.fromList(analysisList);
    }

    @Transactional
    public void saveTodayTask() {
        LocalDate yesterday = LocalDate.now().minusDays(1);

        // 어제 할 일을 추가한 멤버 ID 목록 조회
        List<Long> memberIds = todayTaskItemRepository.findDistinctMemberIdsByTaskDate(yesterday);

        for (Long memberId : memberIds) {
            Member member = memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
            long completedNum = todayTaskItemRepository.countByMemberIdAndTaskDateAndEisenhowerItemIsCompleted(memberId, yesterday, true);

            TodayTaskAnalysis analysis = todayTaskAnalysisRepository.findByMemberIdAndDate(memberId, yesterday)
                .orElse(TodayTaskAnalysis.builder()
                    .member(member)
                    .date(yesterday)
                    .completedNum(completedNum)
                    .build());

            todayTaskAnalysisRepository.save(analysis);
        }
    }
}
