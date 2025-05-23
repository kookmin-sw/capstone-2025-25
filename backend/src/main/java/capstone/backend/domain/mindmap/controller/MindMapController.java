package capstone.backend.domain.mindmap.controller;

import capstone.backend.domain.eisenhower.dto.response.EisenhowerCategoryResponse;
import capstone.backend.domain.eisenhower.service.EisenhowerItemService;
import capstone.backend.domain.mindmap.dto.request.UpdateMindMapRequest;
import capstone.backend.domain.mindmap.dto.request.UpdateMindMapTitleRequest;
import capstone.backend.domain.mindmap.dto.response.SidebarMindMapResponse;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.domain.mindmap.dto.request.MindMapRequest;
import capstone.backend.domain.mindmap.dto.response.MindMapResponse;
import capstone.backend.domain.mindmap.service.MindMapService;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "마인드맵 V1", description = "Version1. 마인드맵 관련 API")
@RestController
@RequestMapping("/api/v1/mindmap")
@RequiredArgsConstructor
public class MindMapController {

    private final MindMapService mindMapService;
    private final EisenhowerItemService eisenhowerItemService;

    @PostMapping("/root")
    @Operation(summary = "마인드맵 루트 노드 생성")
    public ApiResponse<Long> createRootNode(
            @Valid @RequestBody MindMapRequest mindMapRequest,
            @AuthenticationPrincipal CustomOAuth2User user
    ) {
        return ApiResponse.ok(mindMapService.createMindMap(user.getMemberId(), mindMapRequest));
    }

    @GetMapping("/{id}")
    @Operation(summary = "특정 마인드맵 조회")
    public ApiResponse<MindMapResponse> getMindMap(
            @Parameter(name="id", description = "조회 마인드맵 ID", required = true, in = ParameterIn.PATH)
            @PathVariable Long id,
            @AuthenticationPrincipal CustomOAuth2User user
    ) {
        return ApiResponse.ok(mindMapService.getMindMapById(user.getMemberId(), id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "마인드맵 전체 삭제")
    public ApiResponse<String> deleteMindMap(
        @Parameter(name = "id", description = "삭제 마인드맵 ID", required = true, in = ParameterIn.PATH)
        @PathVariable Long id,
        @AuthenticationPrincipal CustomOAuth2User user
    ) {
        mindMapService.deleteMindMap(user.getMemberId(), id);
        return ApiResponse.ok("마인드맵이 성공적으로 삭제되었습니다.");
    }

    @PutMapping("/{id}")
    @Operation(summary = "마인드맵 수정 (루트노드, 하위노드, 엣지)")
    public ApiResponse<String> updateMindMap(
        @Parameter(name = "id", description = "수정 마인드맵 ID", required = true, in = ParameterIn.PATH)
        @PathVariable Long id,
        @Valid @RequestBody UpdateMindMapRequest mindMapRequest,
        @AuthenticationPrincipal CustomOAuth2User user
    ){
        mindMapService.updateMindMap(user.getMemberId(), id, mindMapRequest);
        return ApiResponse.ok("마인드맵이 수정되었습니다.");
    }

    @PatchMapping("/title/{id}")
    @Operation(summary = "마인드맵 제목 수정")
    public ApiResponse<String> updateMindMapTitle(
        @Parameter(description = "마인드맵 ID", required = true, in = ParameterIn.PATH)
        @PathVariable Long id,
        @Valid @RequestBody UpdateMindMapTitleRequest updateMindMapTitleRequest,
        @AuthenticationPrincipal CustomOAuth2User user
    ){
        mindMapService.updateMindMapTitle(user.getMemberId(), id, updateMindMapTitleRequest);
        return ApiResponse.ok("마인드맨 제목이 변경되었습니다.");
    }

    @GetMapping("/list")
    @Operation(summary = "아이젠하워 연결 별 마인드맵 리스트 조회")
    public ApiResponse<List<SidebarMindMapResponse>> getMindMapList(
        @AuthenticationPrincipal CustomOAuth2User user
    ) {
        return ApiResponse.ok(mindMapService.getMindMapList(user.getMemberId()));
    }

    @GetMapping("/category/{id}")
    @Operation(summary = "마인드맵 추출 시, 연관된 아이젠하워 카테고리 조회")
    public ApiResponse<EisenhowerCategoryResponse> getCategoryByMindMapId(
        @Parameter(description = "마인드맵 ID", required = true, in = ParameterIn.PATH)
        @PathVariable Long id,
        @AuthenticationPrincipal CustomOAuth2User user
    ){
        EisenhowerCategoryResponse category = eisenhowerItemService.getCategoryByMindMapId(id, user.getMemberId());
        return ApiResponse.ok(category);
    }
}
