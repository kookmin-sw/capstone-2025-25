package capstone.backend.domain.eisenhower.controller;

import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemCreateRequest;
import capstone.backend.domain.eisenhower.dto.response.EisenhowerItemResponse;
import capstone.backend.domain.eisenhower.service.EisenhowerService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/eisenhower")
@RequiredArgsConstructor
@Slf4j
public class EisenhowerController {

    private final EisenhowerService eisenhowerService;

    @PostMapping
    public ApiResponse<EisenhowerItemResponse> createItem(
            @RequestBody @Valid EisenhowerItemCreateRequest request,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User
    ) {
        return ApiResponse.ok(eisenhowerService.createItem(request, customOAuth2User.getMemberId()));
    }
}
