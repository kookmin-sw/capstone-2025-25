package capstone.backend.domain.todayTask.controller;

import capstone.backend.domain.todayTask.dto.response.TodayTaskAnalysisResponse;
import capstone.backend.domain.todayTask.service.TodayTaskAnalysisService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "오늘의 할 일 분석", description = "일주일 간 오늘의 할 일 분석 API")
@RestController
@RequestMapping("/api/v2/today-task/analysis")
@RequiredArgsConstructor
public class TodayTaskAnalysisController {
    private final TodayTaskAnalysisService todayTaskAnalysisService;

    @Operation(summary = "일주일 간 분석 조회", description = "오늘부터 7일전까지의 오늘의 할 일 분석 결과 조회")
    @GetMapping
    public ApiResponse<List<TodayTaskAnalysisResponse>> getWeeklyAnalysis(
            @AuthenticationPrincipal CustomOAuth2User user
    ) {
        List<TodayTaskAnalysisResponse> analysis = todayTaskAnalysisService.getWeeklyAnalysis(user.getMemberId());
        return ApiResponse.ok(analysis);
    }
}
