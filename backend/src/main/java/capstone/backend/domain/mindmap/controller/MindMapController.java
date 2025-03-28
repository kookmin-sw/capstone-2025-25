package capstone.backend.domain.mindmap.controller;

import capstone.backend.domain.mindmap.dto.request.UpdateMindMapOrderRequest;
import capstone.backend.domain.mindmap.dto.request.UpdateMindMapTitleRequest;
import capstone.backend.domain.mindmap.entity.MindMapType;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.domain.mindmap.dto.request.MindMapRequest;
import capstone.backend.domain.mindmap.dto.response.MindMapResponse;
import capstone.backend.domain.mindmap.service.MindMapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
            @Parameter(name="id", description = "조회 마인드맵 ID", required = true, in = ParameterIn.PATH)
            @PathVariable Long id
    ) {
        return ApiResponse.ok(mindMapService.getMindMapById(id));
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

    @GetMapping("/search")
    @Operation(summary = "날짜별, 타입별 마인드맵 전체 조회")
    public ApiResponse<List<MindMapResponse>> getMindMaps(
        @Parameter(name = "date", description = "조회할 날짜 (ex. 2025-03-23)", required = true, in = ParameterIn.QUERY)
        @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,

        @Parameter(name = "type", description = "마인드맵 타입 (TODO 또는 THINKING)", required = true, in = ParameterIn.QUERY)
        @RequestParam(value = "type") MindMapType type
    )  {
        List<MindMapResponse> mindMaps = mindMapService.getMindMaps(date, type);
        return ApiResponse.ok(mindMaps);
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

    @PatchMapping("/order")
    @Operation(summary = "마인드맵 순서 변경")
    public ApiResponse<String> updateMindMapOrder(
        @Valid @RequestBody UpdateMindMapOrderRequest updateMindMapOrderRequest
    ){
        mindMapService.updateMindMapOrder(updateMindMapOrderRequest);
        return ApiResponse.ok(("마인드맵 순서가 변경되었습니다."));
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
}
