package capstone.backend.domain.eisenhower.controller;

import capstone.backend.domain.eisenhower.dto.response.EisenhowerNotificationResponse;
import capstone.backend.domain.eisenhower.service.EisenhowerNotificationService;
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

@Tag(name = "아이젠하워 알림", description = "아이젠하워 알림 관련 API")
@RestController
@RequestMapping("/api/eisenhower/notification")
@RequiredArgsConstructor
public class EisenhowerNotificationController {

    private final EisenhowerNotificationService eisenhowerNotificationService;

    @Operation(summary = "아이젠하워 작업 알림 전체 조회")
    @GetMapping
    public ApiResponse<List<EisenhowerNotificationResponse>> getEisenhowerNotification(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User
    ) {
        return ApiResponse.ok(eisenhowerNotificationService.getNotifications(customOAuth2User.getMemberId()));
    }
}
