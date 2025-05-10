package capstone.backend.domain.todayTask.controller;

import capstone.backend.domain.todayTask.dto.request.TodayTaskItemCreateRequest;
import capstone.backend.domain.todayTask.dto.request.TodayTaskUpdateRequest;
import capstone.backend.domain.todayTask.dto.response.TodayTaskItemResponse;
import capstone.backend.domain.todayTask.service.TodayTaskItemService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v2/today-task")
@Tag(name="오늘의 할 일", description = "오늘의 할 일 관련 API")
public class TodayTaskItemController {
    private final TodayTaskItemService todayTaskItemService;

    @Operation(summary = "오늘의 할 일 추가", description = "아이젠하워 할 일을 오늘의 할 일 목록에 추가")
    @PostMapping("/{eisenhowerId}")
    public ApiResponse<TodayTaskItemResponse> addTodayTask(
        @AuthenticationPrincipal CustomOAuth2User user,
        @Parameter(name = "eisenhowerId", description="추가할 아이젠하워 ID", example = "1", required = true)
        @PathVariable Long eisenhowerId
    ) {
        TodayTaskItemResponse response = todayTaskItemService.addTaskItem(user.getMemberId(), eisenhowerId);
        return ApiResponse.ok(response);
    }

    @Operation(summary = "오늘의 할 일 조회", description = "오늘의 할 일 조회")
    @GetMapping
    public ApiResponse<Page<TodayTaskItemResponse>> getTodayTasks(
        @AuthenticationPrincipal CustomOAuth2User user,
        @ParameterObject Pageable pageable
    ){
        Page<TodayTaskItemResponse> response = todayTaskItemService.getTodayTasks(user.getMemberId(), pageable);
        return ApiResponse.ok(response);
    }

    @Operation(summary = "오늘 날짜의 할 일 개수 조회", description = "오늘 날짜에 등록된 할 일 개수를 반환")
    @GetMapping("/count")
    public ApiResponse<Long> getTaskItemCount(
        @AuthenticationPrincipal CustomOAuth2User user
    ) {
        long count = todayTaskItemService.getTaskItemCount(user.getMemberId());
        return ApiResponse.ok(count);
    }

    @Operation(summary = "완료된 할 일 개수 조회")
    @GetMapping("/completed")
    public ApiResponse<Long> getCompletedTaskItemCount(
        @AuthenticationPrincipal CustomOAuth2User user
    ) {
        long completedCount = todayTaskItemService.getCompletedTaskItemCount(user.getMemberId());
        return ApiResponse.ok(completedCount);
    }

    @Operation(summary = "오늘의 할 일 삭제", description = "오늘의 할 일 목록에서 특정 할 일을 삭제")
    @DeleteMapping("/{taskId}")
    public ApiResponse<Void> deleteTodayTask(
        @AuthenticationPrincipal CustomOAuth2User user,
        @Parameter(name = "taskId", description="삭제할 오늘의 할 일 ID", example = "1", required = true)
        @PathVariable Long taskId
    ) {
        todayTaskItemService.deleteTaskItem(user.getMemberId(), taskId);
        return ApiResponse.ok();
    }

    @Operation(summary = "어제의 할 일 가져오기", description = "어제 날짜 기준으로 미완료된 할 일을 조회")
    @GetMapping("/yesterday")
    public ApiResponse<Page<TodayTaskItemResponse>> getYesterdayTaskItems(
        @AuthenticationPrincipal CustomOAuth2User user,
        @ParameterObject Pageable pageable
    ) {
        Page<TodayTaskItemResponse> response = todayTaskItemService.getYesterdayTaskItems(user.getMemberId(), pageable);
        return ApiResponse.ok(response);
    }

    @Operation(summary = "어제 일을 오늘 날짜로 변경", description = "특정 할 일을 오늘 날짜로 변경")
    @PostMapping("/move-today/{taskId}")
    public ApiResponse<TodayTaskItemResponse> updateTaskDateToToday(
        @AuthenticationPrincipal CustomOAuth2User user,
        @Parameter(name = "taskId", description = "변경할 오늘의 할 일 ID", example = "1", required = true)
        @PathVariable Long taskId
    ){
        TodayTaskItemResponse response = todayTaskItemService.updateTaskDateToToday(user.getMemberId(), taskId);
        return ApiResponse.ok(response);
    }

    @Operation(summary = "오늘의 할 일을 어제 날짜로 변경", description = "특정 할 일을 어제 날짜로 이동. 테스트 할 때만 사용")
    @PostMapping("/yesterday/{taskId}")
    public ApiResponse<TodayTaskItemResponse> updateTaskDateToYesterday(
        @AuthenticationPrincipal CustomOAuth2User user,
        @Parameter(name = "taskId", description = "어제로 변경할 오늘의 할 일 ID (테스트 할 때 사용)", example = "1", required = true)
        @PathVariable Long taskId
    ) {
        TodayTaskItemResponse response = todayTaskItemService.updateTaskDateToYesterday(user.getMemberId(), taskId);
        return ApiResponse.ok(response);
    }

    @Operation(summary = "오늘의 할 일 상태 변경", description = "할 일의 체크 상태 변경")
    @PatchMapping("/status/{taskId}")
    public ApiResponse<TodayTaskItemResponse> updateTaskStatus(
        @AuthenticationPrincipal CustomOAuth2User user,
        @Parameter(name = "taskId", description = "완료할 할 일 ID", example = "1", required = true)
        @PathVariable Long taskId,
        @RequestBody @Valid TodayTaskUpdateRequest request
    ) {
        return ApiResponse.ok(todayTaskItemService.updateTaskStatus(user.getMemberId(), taskId, request.isCompleted()));
    }
}
