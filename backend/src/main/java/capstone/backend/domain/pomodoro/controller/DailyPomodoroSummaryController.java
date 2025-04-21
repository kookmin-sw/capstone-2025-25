package capstone.backend.domain.pomodoro.controller;


import capstone.backend.domain.pomodoro.dto.request.MonthlyParamsDTO;
import capstone.backend.domain.pomodoro.dto.response.DailyPomodoroDTO;
import capstone.backend.domain.pomodoro.service.DailyPomodoroSummaryService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/data/pomodoro")
@RequiredArgsConstructor
public class DailyPomodoroSummaryController {

    private final DailyPomodoroSummaryService dailyPomodoroSummaryService;

    @GetMapping("/today")
    @Operation(summary = "금일 뽀모도로 총 이용 시간")
    public ApiResponse<DailyPomodoroDTO> todayTotalPomodoroTime(
            @AuthenticationPrincipal CustomOAuth2User user
            ) {
        return ApiResponse.ok(dailyPomodoroSummaryService.findTodayPomodoroSummary(user.getMemberId()));
    }

    @GetMapping("/month")
    @Operation(summary = "연,월별 뽀모도로 총 시간")
    public ApiResponse<List<DailyPomodoroDTO>> monthlyTotalPomodoroTime(
            @AuthenticationPrincipal CustomOAuth2User user,
            @Valid @ModelAttribute MonthlyParamsDTO request
    ) {
        return ApiResponse.ok(
                dailyPomodoroSummaryService.findMonthlyTotalPomodoros(
                        user.getMemberId(),
                        request.year(),
                        request.month()
                )
        );
    }

    @GetMapping("/week")
    @Operation(summary = "금주 뽀모도로 총 시간")
    public ApiResponse<List<DailyPomodoroDTO>> weeklyTotalPomodoroTime(
            @AuthenticationPrincipal CustomOAuth2User user
    ) {
        return ApiResponse.ok(dailyPomodoroSummaryService.findWeeklyPomodoroSummary(user.getMemberId(), LocalDate.now()));
    }

}
