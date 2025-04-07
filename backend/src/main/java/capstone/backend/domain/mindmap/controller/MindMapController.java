package capstone.backend.domain.mindmap.controller;

import capstone.backend.domain.mindmap.dto.request.UpdateMindMapTitleRequest;
import capstone.backend.domain.mindmap.dto.response.MindMapGroupListResponse;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.domain.mindmap.dto.request.MindMapRequest;
import capstone.backend.domain.mindmap.dto.response.MindMapResponse;
import capstone.backend.domain.mindmap.service.MindMapService;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mindmap")
@RequiredArgsConstructor
public class MindMapController {

    private final MindMapService mindMapService;

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
        @PathVariable Long id
    ) {
        mindMapService.deleteMindMap(id);
        return ApiResponse.ok("마인드맵이 성공적으로 삭제되었습니다.");
    }

    @PutMapping("/{id}")
    @Operation(summary = "마인드맵 루트 노드 수정")
    public ApiResponse<String> updateMindMap(
        @Parameter(name = "id", description = "수정 마인드맵 ID", required = true, in = ParameterIn.PATH)
        @PathVariable Long id,
        @Valid @RequestBody MindMapRequest mindMapRequest
    ){
        mindMapService.updateMindMap(id, mindMapRequest);
        return ApiResponse.ok("마인드맵이 수정되었습니다. ID: " + id);
    }

    @PatchMapping("/title/{id}")
    @Operation(summary = "마인드맵 제목 수정")
    public ApiResponse<String> updateMindMapTitle(
        @Parameter(description = "마인드맵 ID", required = true, in = ParameterIn.PATH)
        @PathVariable Long id,
        @Valid @RequestBody UpdateMindMapTitleRequest updateMindMapTitleRequest
    ){
        mindMapService.updateMindMapTitle(id, updateMindMapTitleRequest);
        return ApiResponse.ok("마인드맨 제목이 변경되었습니다.");
    }

    @GetMapping("/list")
    @Operation(summary = "아이젠하워 연결 별 마인드맵 리스트 조회")
    public ApiResponse<MindMapGroupListResponse> getMindMapList(
    ) {
        MindMapGroupListResponse response = mindMapService.getMindMapList();
        return ApiResponse.ok(response);
    }
}
