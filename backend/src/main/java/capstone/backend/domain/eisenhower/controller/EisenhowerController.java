package capstone.backend.domain.eisenhower.controller;

import capstone.backend.domain.eisenhower.dto.request.EisenhowerUpdateRequest;
import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemCreateRequest;
import capstone.backend.domain.eisenhower.dto.response.EisenhowerItemResponse;
import capstone.backend.domain.eisenhower.service.EisenhowerService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping
    public ApiResponse<List<EisenhowerItemResponse>> getItems(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @RequestParam(required = false) Boolean completed
    ) {
        if(Boolean.TRUE.equals(completed)) {
            return ApiResponse.ok(eisenhowerService.getItemsCompleted(customOAuth2User.getMemberId()));
        }
        return ApiResponse.ok(eisenhowerService.getItemsNotCompleted(customOAuth2User.getMemberId()));
    }

    @PatchMapping("/{itemId}")
    public ApiResponse<EisenhowerItemResponse> updateItem(
            @RequestBody @Valid EisenhowerUpdateRequest request,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long itemId
    ) {
        return ApiResponse.ok(eisenhowerService.updateItem(customOAuth2User.getMemberId(), itemId, request));
    }
}
