package capstone.backend.domain.inventory.controller;

import capstone.backend.domain.inventory.request.InventoryFolderRequest;
import capstone.backend.domain.inventory.response.InventoryFolderResponse;
import capstone.backend.domain.inventory.service.InventoryFolderService;
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

@Tag(name = "보관함 폴더", description = "보관함 폴더 관련 API")
@RestController
@RequestMapping("/api/v2/inventory/folder")
@RequiredArgsConstructor
public class InventoryFolderController {
    private final InventoryFolderService inventoryFolderService;

    @Operation(summary = "보관함 폴더 생성")
    @PostMapping
    public ApiResponse<InventoryFolderResponse> createInventoryFolder(
        @RequestBody @Valid InventoryFolderRequest inventoryFolderRequest,
        @AuthenticationPrincipal CustomOAuth2User user
    ){
        return ApiResponse.ok(inventoryFolderService.createInventoryFolder(inventoryFolderRequest,
            user.getMemberId()));
    }

    @Operation(summary = "보관함 폴더 전체 조회")
    @GetMapping
    public ApiResponse<List<InventoryFolderResponse>> getInventoryFolders(
        @AuthenticationPrincipal CustomOAuth2User user
    ){
        return ApiResponse.ok(inventoryFolderService.getInventoryFolders(user.getMemberId()));
    }

    @Operation(summary = "보관함 폴더 이름 변경")
    @PatchMapping("/{id}")
    public ApiResponse<InventoryFolderResponse> updateInventoryFolder(
        @AuthenticationPrincipal CustomOAuth2User user,
        @Parameter(name = "id", description = "수정할 폴더 ID", example = "1", required = true)
        @PathVariable Long id,
        @RequestBody @Valid InventoryFolderRequest request
    ){
        InventoryFolderResponse response = inventoryFolderService.updateInventoryFolder(user.getMemberId(), id, request);
        return ApiResponse.ok(response);
    }

    @Operation(summary = "보관함 폴더 삭제")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteInventoryFolder(
        @AuthenticationPrincipal CustomOAuth2User user,
        @Parameter(name = "id", description = "삭제할 폴더 ID", example = "2", required = true)
        @PathVariable Long id
    ){
        inventoryFolderService.deleteInventoryFolder(user.getMemberId(), id);
        return ApiResponse.ok();
    }

    @Operation(summary = "보관함 폴더 상세 조회")
    @GetMapping("/{id}")
    public ApiResponse<InventoryFolderResponse> getInventoryFolderDetail(
        @AuthenticationPrincipal CustomOAuth2User user,
        @Parameter(name = "id", description = "상세 조회할 폴더 ID", example = "1", required = true)
        @PathVariable Long id
    ){
        return ApiResponse.ok(inventoryFolderService.getInventoryFolderDetail(user.getMemberId(), id));
    }
}
