package capstone.backend.domain.pomodoro.controller;


import capstone.backend.domain.pomodoro.dto.response.DailyPomodoroDTO;
import capstone.backend.domain.pomodoro.service.DailyPomodoroSummaryService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@Validated
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
            @Parameter(description = "년도", required = true)
            @RequestParam
            @NotNull(message = "년도는 필수 입력 값입니다.")
            @Min(value = 2000, message = "년도는 2000년 이상이어야 합니다.")
            @Max(value = 2100, message = "년도는 2100년 이하여야 합니다.")
            Integer year,

            @Parameter(description = "월", required = true)
            @RequestParam
            @NotNull(message = "월은 필수 입력 값입니다.")
            @Min(value = 1, message = "월은 1 이상이어야 합니다.")
            @Max(value = 12, message = "월은 12 이하여야 합니다.")
            Integer month
    ) {
        return ApiResponse.ok(dailyPomodoroSummaryService.findMonthlyTotalPomodoros(user.getMemberId(), year, month));
    }

    @GetMapping("/week")
    @Operation(summary = "금주 뽀모도로 총 시간")
    public ApiResponse<List<DailyPomodoroDTO>> weeklyTotalPomodoroTime(
            @AuthenticationPrincipal CustomOAuth2User user
    ) {
        return ApiResponse.ok(dailyPomodoroSummaryService.findWeeklyPomodoroSummary(user.getMemberId(), LocalDate.now()));
    }

}
