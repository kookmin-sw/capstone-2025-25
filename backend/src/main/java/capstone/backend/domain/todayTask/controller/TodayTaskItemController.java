package capstone.backend.domain.todayTask.controller;

import capstone.backend.domain.todayTask.dto.request.TodayTaskItemCreateRequest;
import capstone.backend.domain.todayTask.dto.response.TodayTaskItemResponse;
import capstone.backend.domain.todayTask.service.TodayTaskItemService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v2/today-task")
@Tag(name="오늘의 할 일", description = "오늘의 할 일 관련 API")
public class TodayTaskItemController {
    private final TodayTaskItemService todayTaskItemService;

    @Operation(summary = "오늘의 할 일 추가", description = "여러 개의 아이젠하워 할 일을 오늘의 할 일 목록에 추가")
    @PostMapping
    public ApiResponse<List<TodayTaskItemResponse>> addTodayTask(
        @RequestBody @Valid TodayTaskItemCreateRequest request,
        @AuthenticationPrincipal CustomOAuth2User user
    ) {
        List<TodayTaskItemResponse> response = todayTaskItemService.addTaskItem(user.getMemberId(), request);
        return ApiResponse.ok(response);
    }

    @Operation(summary = "오늘의 할 일 조회", description = "오늘의 할 일 조회. 날짜 디폴트 값은 오늘 날짜(2025-05-07)")
    @GetMapping
    public ApiResponse<List<TodayTaskItemResponse>> getTodayTasks(
        @AuthenticationPrincipal CustomOAuth2User user,
        @RequestParam(value = "date", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ){
        List<TodayTaskItemResponse> response = todayTaskItemService.getTodayTasks(user.getMemberId(), date);
        return ApiResponse.ok(response);
    }

    @Operation(summary = "특정 날짜의 할 일 개수 조회", description = "특정 날짜에 등록된 할 일 개수를 반환. 날짜가 없으면 오늘 날짜 기준으로 조회합니다.")
    @GetMapping("/count")
    public ApiResponse<Integer> getTaskItemCount(
        @AuthenticationPrincipal CustomOAuth2User user,
        @RequestParam(value = "date", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        int count = todayTaskItemService.getTaskItemCount(user.getMemberId(), date);
        return ApiResponse.ok(count);
    }

    @Operation(summary = "완료된 할 일 개수 조회", description = "특정 날짜에 완료된 할 일 개수를 반환. 날짜가 없으면 오늘 날짜 기준으로 조회합니다.")
    @GetMapping("/completed")
    public ApiResponse<Long> getCompletedTaskItemCount(
        @AuthenticationPrincipal CustomOAuth2User user,
        @RequestParam(value = "date", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        long completedCount = todayTaskItemService.getCompletedTaskItemCount(user.getMemberId(), date);
        return ApiResponse.ok(completedCount);
    }
}
