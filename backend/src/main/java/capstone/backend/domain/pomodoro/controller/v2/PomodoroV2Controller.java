package capstone.backend.domain.pomodoro.controller.v2;


import capstone.backend.domain.pomodoro.dto.request.RecordPomodoroRequest;
import capstone.backend.domain.pomodoro.service.PomodoroService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "뽀모도로 타이머 V2", description = "Version 2. 기획 수정 후 뽀모도로 타이머 관련 API")
@RestController
@RequestMapping("/api/v2/pomodoro")
@RequiredArgsConstructor
public class PomodoroV2Controller {

    private final PomodoroService pomodoroService;

    @PatchMapping
    @Operation(summary = "뽀모도로 완료 및 기록")
    public ApiResponse<Void> setPomodoro(
            @Valid @RequestBody RecordPomodoroRequest request,
            @AuthenticationPrincipal CustomOAuth2User user
    ) {
        pomodoroService.recordPomodoro(user.getMemberId(), request);
        return ApiResponse.ok();
    }
}
