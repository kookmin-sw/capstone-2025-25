package capstone.backend.domain.pomodoro.controller.v1;


import capstone.backend.domain.pomodoro.dto.request.CreatePomodoroRequest;
import capstone.backend.domain.pomodoro.dto.response.PomodoroDTO;
import capstone.backend.domain.pomodoro.dto.response.SidebarResponse;
import capstone.backend.domain.pomodoro.schema.Pomodoro;
import capstone.backend.domain.pomodoro.service.PomodoroService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "(미사용) 뽀모도로 타이머 V1", description = "Version 1. 뽀모도로 타이머 관련 API")
@RestController
@RequestMapping("/api/pomodoro/v1")
@RequiredArgsConstructor
public class PomodoroV1Controller {

    private final PomodoroService pomodoroService;

    @PostMapping("/create")
    @Operation(summary = "뽀모도로 생성")
    public ApiResponse<PomodoroDTO> createUnlink(
            @AuthenticationPrincipal CustomOAuth2User user,
            @Valid @RequestBody CreatePomodoroRequest request
    ) {
        return ApiResponse.ok(pomodoroService.createPomodoro(user.getMemberId(), request));
    }

    @GetMapping
    @Operation(summary = "(매핑 + 언매핑) 뽀모도로 데이터")
    public ApiResponse<SidebarResponse> linkedAndUnlinkedPomodoros(
            @AuthenticationPrincipal CustomOAuth2User user
    ) {
        return ApiResponse.ok(pomodoroService.getAllPomodoros(user.getMemberId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "특정 뽀모도로 조회")
    public ApiResponse<Pomodoro> findById(
            @Parameter(name = "id", description = "뽀모도로 ID", required = true, in = ParameterIn.PATH)
            @PathVariable Long id,
            @AuthenticationPrincipal CustomOAuth2User user
    ) {
        return ApiResponse.ok(pomodoroService.findById(user.getMemberId(), id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "특정 뽀모도로 삭제")
    public ApiResponse<Void> deleteById(
            @Parameter(name = "id", description = "뽀모도로 ID", required = true, in = ParameterIn.PATH)
            @PathVariable Long id,
            @AuthenticationPrincipal CustomOAuth2User user
    ) {
        pomodoroService.deletePomodoro(user.getMemberId(), id);
        return ApiResponse.ok();
    }
}
