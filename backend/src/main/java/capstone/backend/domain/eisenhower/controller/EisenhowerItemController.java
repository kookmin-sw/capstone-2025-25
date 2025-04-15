package capstone.backend.domain.eisenhower.controller;

import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemCreateRequest;
import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemFilterRequest;
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
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User
    ) {
        return ApiResponse.ok(eisenhowerItemService.createItem(request, customOAuth2User.getMemberId()));
    }

    @Operation(summary = "아이젠하워 작업 조회", description = "아이젠하워 작업을 조회합니다.")
    @GetMapping("/{itemId}")
    public ApiResponse<EisenhowerItemResponse> getItem(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @Parameter(name = "itemId", description = "조회할 아이젠하워 항목 ID", example = "1", required = true)
            @PathVariable Long itemId) {
        return ApiResponse.ok(eisenhowerItemService.getItem(customOAuth2User.getMemberId(), itemId));
    }

    @Operation(summary = "아이젠하워 작업 전체 조회", description = "필터링 조건에 따라 아이젠하워 작업을 조회합니다.")
    @GetMapping
    public ApiResponse<Page<EisenhowerItemResponse>> getItemsFiltered(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @ParameterObject EisenhowerItemFilterRequest filter,
            @ParameterObject Pageable pageable
    ) {
        return ApiResponse.ok(eisenhowerItemService.getItemsFiltered(customOAuth2User.getMemberId(), filter, pageable));
    }

    @Operation(summary = "아이젠하워 작업 검색", description = "아이젠하워 작업을 검색합니다.")
    @GetMapping("/search")
    public ApiResponse<Page<EisenhowerItemResponse>> searchItems(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @Parameter(name = "keyword", description = "검색어", example = "example", required = true)
            @RequestParam String keyword,
            @ParameterObject Pageable pageable
    ) {
        return ApiResponse.ok(eisenhowerItemService.searchItems(customOAuth2User.getMemberId(), keyword, pageable));
    }

    @Operation(summary = "아이젠하워 작업 수정")
    @PatchMapping("/{itemId}")
    public ApiResponse<EisenhowerItemResponse> updateItem(
            @RequestBody @Valid EisenhowerItemUpdateRequest request,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @Parameter(name = "itemId", description = "수정할 아이젠하워 항목 ID", example = "1", required = true)
            @PathVariable Long itemId
    ) {
        return ApiResponse.ok(eisenhowerItemService.updateItem(customOAuth2User.getMemberId(), itemId, request));
    }

    @Operation(summary = "아이젠하워 작업 삭제")
    @DeleteMapping("/{itemId}")
    public ApiResponse<String> deleteItem(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @Parameter(name = "itemId", description = "삭제할 아이젠하워 항목 ID", example = "1", required = true)
            @PathVariable Long itemId
    ) {
        eisenhowerItemService.deleteItem(customOAuth2User.getMemberId(), itemId);
        return ApiResponse.ok("아이젠하워 작업이 삭제되었습니다.");
    }

    @Operation(summary = "아이젠하워 작업들에 대한 순서 및 사분면 위치 업데이트")
    @PatchMapping("/order")
    public ApiResponse<Void> updateItemOrderAndQuadrant(
            @RequestBody @Valid EisenhowerItemOrderUpdateRequests request,
            @AuthenticationPrincipal CustomOAuth2User user
    ) {
        eisenhowerItemService.updateItemOrderAndQuadrant(user.getMemberId(), request.items());
        return ApiResponse.ok();
    }
}
