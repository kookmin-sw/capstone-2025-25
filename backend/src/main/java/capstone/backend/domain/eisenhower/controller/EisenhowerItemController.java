package capstone.backend.domain.eisenhower.controller;

import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemCreateRequest;
import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemOrderUpdateRequests;
import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemUpdateRequest;
import capstone.backend.domain.eisenhower.dto.response.EisenhowerItemResponse;
import capstone.backend.domain.eisenhower.service.EisenhowerItemService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "아이젠하워 작업", description = "아이젠하워 작업 관련 API")
@RestController
@RequestMapping("/api/eisenhower")
@RequiredArgsConstructor
public class EisenhowerItemController {

    private final EisenhowerItemService eisenhowerItemService;

    @Operation(summary = "아이젠하워 작업 생성")
    @PostMapping
    public ApiResponse<EisenhowerItemResponse> createItem(
            @RequestBody @Valid EisenhowerItemCreateRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User customOAuth2User
    ) {
        return ApiResponse.ok(eisenhowerItemService.createItem(request, customOAuth2User.getMemberId()));
    }

    @Operation(summary = "아이젠하워 작업 전체 조회", description = "완료된 작업과 미완료된 작업을 구분하여 조회할 수 있습니다.")
    @GetMapping
    public ApiResponse<List<EisenhowerItemResponse>> getItems(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @Parameter(description = "완료된 작업만 조회할지 여부", example = "false") @RequestParam(required = false) Boolean completed
    ) {
        if(Boolean.TRUE.equals(completed)) {
            return ApiResponse.ok(eisenhowerItemService.getItemsCompleted(customOAuth2User.getMemberId()));
        }
        return ApiResponse.ok(eisenhowerItemService.getItemsNotCompleted(customOAuth2User.getMemberId()));
    }

    @Operation(summary = "아이젠하워 작업 수정")
    @PatchMapping("/{itemId}")
    public ApiResponse<EisenhowerItemResponse> updateItem(
            @RequestBody @Valid EisenhowerItemUpdateRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long itemId
    ) {
        return ApiResponse.ok(eisenhowerItemService.updateItem(customOAuth2User.getMemberId(), itemId, request));
    }

    @Operation(summary = "아이젠하워 작업 삭제")
    @DeleteMapping("/{itemId}")
    public ApiResponse<String> deleteItem(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long itemId
    ) {
        eisenhowerItemService.deleteItem(customOAuth2User.getMemberId(), itemId);
        return ApiResponse.ok("아이젠하워 작업이 삭제되었습니다.");
    }

    @Operation(summary = "아이젠하워 작업들에 대한 순서 및 사분면 위치 업데이트")
    @PatchMapping("/order")
    public ApiResponse<Void> updateItemOrderAndQuadrant(
            @RequestBody @Valid EisenhowerItemOrderUpdateRequests request,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomOAuth2User user
    ) {
        eisenhowerItemService.updateItemOrderAndQuadrant(user.getMemberId(), request.items());
        return ApiResponse.ok();
    }
}
