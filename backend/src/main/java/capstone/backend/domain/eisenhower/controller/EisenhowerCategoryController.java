package capstone.backend.domain.eisenhower.controller;

import capstone.backend.domain.eisenhower.dto.request.EisenhowerCategoryCreateRequest;
import capstone.backend.domain.eisenhower.dto.response.EisenhowerCategoryResponse;
import capstone.backend.domain.eisenhower.dto.request.EisenhowerCategoryUpdateRequest;
import capstone.backend.domain.eisenhower.service.EisenhowerCategoryService;
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
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "아이젠하워 카테고리", description = "아이젠하워 카테고리 관련 API")
@RestController
@RequestMapping("/api/eisenhower/category")
@RequiredArgsConstructor
public class EisenhowerCategoryController {

    private final EisenhowerCategoryService eisenhowerCategoryService;

    @Operation(summary = "아이젠하워 카테고리 전체 조회")
    @GetMapping
    public ApiResponse<List<EisenhowerCategoryResponse>> getEisenhowerCategories(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User
    ) {
        return ApiResponse.ok(eisenhowerCategoryService.getEisenhowerCategories(customOAuth2User.getMemberId()));
    }

    @Operation(summary = "아이젠하워 카테고리 생성")
    @PostMapping
    public ApiResponse<EisenhowerCategoryResponse> createEisenhowerCategory(
            @RequestBody @Valid EisenhowerCategoryCreateRequest eisenhowerCategoryRequest,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User
    ) {
        return ApiResponse.ok(eisenhowerCategoryService.createEisenhowerCategory(eisenhowerCategoryRequest, customOAuth2User.getMemberId()));
    }

    @Operation(summary = "아이젠하워 카테고리 수정")
    @PatchMapping("/{categoryId}")
    public ApiResponse<EisenhowerCategoryResponse> updateEisenhowerCategory(
            @RequestBody EisenhowerCategoryUpdateRequest eisenhowerCategoryUpdateRequest,
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @Parameter(description = "카테고리 ID", required = true) @PathVariable Long categoryId
    ) {
        return ApiResponse.ok(eisenhowerCategoryService.updateEisenhowerCategory(eisenhowerCategoryUpdateRequest, customOAuth2User.getMemberId(), categoryId));
    }

    @Operation(summary = "아이젠하워 카테고리 삭제")
    @DeleteMapping("/{categoryId}")
    public ApiResponse<String> updateEisenhowerCategory(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @Parameter(description = "카테고리 ID", required = true) @PathVariable Long categoryId
    ) {
        eisenhowerCategoryService.deleteEisenhowerCategory(customOAuth2User.getMemberId(), categoryId);
        return ApiResponse.ok("아이젠하워 카테고리가 삭제되었습니다.");
    }
}
