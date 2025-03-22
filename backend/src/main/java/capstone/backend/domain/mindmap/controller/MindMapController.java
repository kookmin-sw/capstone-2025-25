package capstone.backend.domain.mindmap.controller;

import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.domain.mindmap.dto.request.MindMapRequest;
import capstone.backend.domain.mindmap.dto.response.MindMapResponse;
import capstone.backend.domain.mindmap.service.MindMapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mindmap")
@RequiredArgsConstructor
public class MindMapController {

    private final MindMapService mindMapService;

    @PostMapping("/root")
    @Operation(summary = "마인드맵 루트 노드 생성")
    public ApiResponse<String> createRootNode(
            @Valid @RequestBody MindMapRequest mindMapRequest
    ) {
        Long mindMapId = mindMapService.createMindMap(mindMapRequest);
        return ApiResponse.ok("MindMap이 생성되었습니다. ID: " + mindMapId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "특정 마인드맵 조회")
    public ApiResponse<MindMapResponse> getMindMap(
            @Parameter(required = true, description = "마인드맵 ID", in = ParameterIn.PATH)
            @PathVariable Long id
    ) {
        return ApiResponse.ok(mindMapService.getMindMapById(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "마인드맵 전체 삭제")
    public ApiResponse<String> deleteMindMap(
        @Parameter(required = true, description = "마인드맵 ID", in = ParameterIn.PATH)
        @PathVariable Long id
    ) {
        mindMapService.deleteMindMap(id);
        return ApiResponse.ok("마인드맵이 성공적으로 삭제되었습니다.");
    }
}
