package capstone.backend.domain.pomodoro.service;

import static capstone.backend.domain.pomodoro.util.PomodoroTimeUtils.calculateTotalTimeSummary;

import capstone.backend.domain.eisenhower.repository.EisenhowerItemRepository;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.pomodoro.dto.request.CreatePomodoroRequest;
import capstone.backend.domain.pomodoro.dto.request.RecordPomodoroRequest;
import capstone.backend.domain.pomodoro.dto.response.PomodoroDTO;
import capstone.backend.domain.pomodoro.dto.response.SidebarResponse;
import capstone.backend.domain.pomodoro.exception.PomodoroDurationException;
import capstone.backend.domain.pomodoro.exception.PomodoroNotFoundException;
import capstone.backend.domain.pomodoro.repository.PomodoroRepository;
import capstone.backend.domain.pomodoro.entity.Pomodoro;
import capstone.backend.domain.pomodoro.entity.PomodoroCycle;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PomodoroService {

    private final MemberRepository memberRepository;
    private final PomodoroRepository pomodoroRepository;
    private final EisenhowerItemRepository eisenhowerItemRepository;
    private final DailyPomodoroSummaryService dailyPomodoroSummaryService;

    // 뽀모도로 생성
    @Transactional
    public PomodoroDTO createPomodoro(Long memberId, CreatePomodoroRequest request) {

//        Member member = memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
//
//        // 총 계획 시간 파싱 (times[0] = 집중시간, times[1] = 휴식시간)
//        int[] times = calculateTotalTimeSummary(request.plannedCycles());
//
//        Pomodoro pomodoro = Pomodoro.create(
//                member,
//                request.title(),
//                LocalTime.parse(request.totalPlannedTime()),
//                request.plannedCycles(),
//                convertSecondsToLocalTime(times[0]),
//                convertSecondsToLocalTime(times[1])
//        );
//
//        // eisenhowerId가 있으면 매핑
//        Optional.ofNullable(request.eisenhowerId())
//                .ifPresent(eisenhowerId -> {
//                    // 한번 더 유효성 검사
//                    EisenhowerItem eisenhowerItem = eisenhowerItemRepository.findById(eisenhowerId)
//                            .orElseThrow(EisenhowerItemNotFoundException::new);
//                    eisenhowerItem.connectPomodoro(pomodoro); // 연관관계 설정
//                    eisenhowerItemRepository.save(eisenhowerItem);
//                });
//
//        Pomodoro save = pomodoroRepository.save(pomodoro);
//        return new PomodoroDTO(save.getId());
        return null;
    }

    // (언링크 + 링크) 뽀모도로 전체 조회
    public SidebarResponse getAllPomodoros(Long memberId) {
//        List<Object[]> results = pomodoroRepository.findPomodoroWithEisenhowerByMemberId(memberId);
//
//        Map<Boolean, List<SidebarPomodoroResponse>> partitioned = results.stream()
//                .map(row -> new SidebarPomodoroResponse((Pomodoro) row[0], (EisenhowerItem) row[1]))
//                .collect(Collectors.partitioningBy(SidebarPomodoroResponse::isLinked));
//
//        return new SidebarResponse(
//                partitioned.getOrDefault(false, List.of()), // unlinked
//                partitioned.getOrDefault(true, List.of())   // linked
//        );
        return null;
    }

    // 특정 뽀모도로 조회
    public Pomodoro findById(Long memberId, Long pomodoroId) {
        return pomodoroRepository.findByIdAndMemberId(pomodoroId, memberId).orElseThrow(PomodoroNotFoundException::new);
    }

    // 특정 뽀모도로 삭제
    @Transactional
    public void deletePomodoro(Long pomodoroId, Long memberId) {
        // 도훈 피드백 (특정 사용자가 다른 사용자의 뽀모도로를 삭제시킬 수도 있음.)
        Pomodoro pomodoro = pomodoroRepository.findByIdAndMemberId(pomodoroId, memberId).orElseThrow(PomodoroNotFoundException::new);

        // EisenhowerItem에서 연결 끊기 (만약 존재한다면)
//        eisenhowerItemRepository.findById(pomodoroId).ifPresent(eisenhowerItem -> eisenhowerItem.connectPomodoro(null));

        pomodoroRepository.delete(pomodoro);
    }

    // 뽀모도로 완료 기록
    @Transactional
    public void recordPomodoro(Long memberId, RecordPomodoroRequest request) {
        List<PomodoroCycle> executedCycles = request.executedCycles();

        // 최적화된 시간 계산
        long[] times = calculateTotalTimeSummary(executedCycles);

        long totalExecutedSeconds = times[2];
        // 1분 미만이면 기록을 저장하지 않고 에러 발생
        if (totalExecutedSeconds <= 59) {
            throw new PomodoroDurationException();
        }

        // 일일 뽀모도로 총 시간 업데이트
        dailyPomodoroSummaryService.updateDailyPomodoroSummary(memberId, totalExecutedSeconds);
    }
}
