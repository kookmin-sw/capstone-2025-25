package capstone.backend.mindmap.controller;

import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.mindmap.dto.request.MindMapRequest;
import capstone.backend.mindmap.dto.response.MindMapResponse;
import capstone.backend.mindmap.service.MindMapService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mindmap")
public class MindMapController {
    private final MindMapService mindMapService;

    public MindMapController(MindMapService mindMapService) {
        this.mindMapService = mindMapService;
    }

    @PostMapping("/root")
    public ResponseEntity<ApiResponse<String>> createRootNode(@Valid @RequestBody MindMapRequest mindMapRequest) {
        Long mindMapId = mindMapService.createMindMap(mindMapRequest);
        return ResponseEntity.ok(ApiResponse.ok("MindMap이 생성되었습니다. ID: " + mindMapId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MindMapResponse>> getMindMap(@PathVariable Long id) {
        MindMapResponse response = mindMapService.getMindMapById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

}
