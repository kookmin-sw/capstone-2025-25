package capstone.backend.domain.pomodoro.service;


import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.entity.Member;
import capstone.backend.domain.pomodoro.dto.response.DailyPomodoroDTO;
import capstone.backend.domain.pomodoro.repository.DailyPomodoroSummaryRepository;
import capstone.backend.domain.pomodoro.entity.DailyPomodoroSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DailyPomodoroSummaryService {

    private final DailyPomodoroSummaryRepository dailyPomodoroSummaryRepository;
    private final MemberRepository memberRepository;

    // 뽀모도로 완료 시 오늘 날짜의 총 뽀모도로 이용량 기록.
    @Transactional
    public void updateDailyPomodoroSummary(Long memberId, Long executedSeconds) {
        DailyPomodoroSummary summary = dailyPomodoroSummaryRepository
                .findByMemberIdAndCreatedAt(memberId, LocalDate.now())
                .orElseGet(() -> {
                    Member member = memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
                    return DailyPomodoroSummary.create(member);
                });

        summary.addToTotalTime(executedSeconds);

        dailyPomodoroSummaryRepository.save(summary);
    }

    // 오늘의 뽀모도로 총 이용 시간
    public DailyPomodoroDTO findTodayPomodoroSummary(Long memberId) {
        return dailyPomodoroSummaryRepository.findByMemberIdAndCreatedAt(memberId, LocalDate.now())
                .map(DailyPomodoroDTO::new)
                .orElse(null);
    }

    // 월간 뽀모도로 총 이용시간
    public List<DailyPomodoroDTO> findMonthlyTotalPomodoros(Long memberId, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        return dailyPomodoroSummaryRepository.findAllByMemberIdAndCreatedAtBetweenOrderByCreatedAtAsc(
                memberId, startDate, endDate)
                .stream()
                .map(DailyPomodoroDTO::new)
                .toList();
    }

    // 금주 뽀모도로 총 이용시간
    public List<DailyPomodoroDTO> findWeeklyPomodoroSummary(Long memberId, LocalDate baseDate) {
        // 기준 날짜를 기준으로 1주일 전 ~ 하루 전까지 계산
        LocalDate startDate = baseDate.minusDays(7); // 7일 전
        LocalDate endDate = baseDate.minusDays(1);   // 하루 전

        return dailyPomodoroSummaryRepository.findAllByMemberIdAndCreatedAtBetweenOrderByCreatedAtAsc(
                        memberId, startDate, endDate)
                .stream()
                .map(DailyPomodoroDTO::new)
                .toList();
    }

}
