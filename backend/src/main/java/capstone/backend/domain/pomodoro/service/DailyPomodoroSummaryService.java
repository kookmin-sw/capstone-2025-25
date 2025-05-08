package capstone.backend.domain.pomodoro.service;


import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import capstone.backend.domain.pomodoro.dto.response.DailyPomodoroDTO;
import capstone.backend.domain.pomodoro.repository.DailyPomodoroSummaryRepository;
import capstone.backend.domain.pomodoro.schema.DailyPomodoroSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Duration;
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
    public void updateDailyPomodoroSummary(Long memberId, int executedSeconds) {
        Duration executedDuration = Duration.ofSeconds(executedSeconds);

        DailyPomodoroSummary summary = dailyPomodoroSummaryRepository
                .findByMemberIdAndCreatedAt(memberId, LocalDate.now())
                .orElseGet(() -> {
                    Member member = memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
                    return DailyPomodoroSummary.create(member);
                });

        summary.addToTotalTime(executedDuration);

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
        // 기준 날짜를 포함하는 주의 일요일과 토요일 계산
        DayOfWeek dayOfWeek = baseDate.getDayOfWeek();
        LocalDate sunday = baseDate.minusDays(dayOfWeek.getValue() % 7);
        LocalDate saturday = sunday.plusDays(6);

        return dailyPomodoroSummaryRepository.findAllByMemberIdAndCreatedAtBetweenOrderByCreatedAtAsc(
                memberId, sunday, saturday)
                .stream()
                .map(DailyPomodoroDTO::new)
                .toList();
    }

}
