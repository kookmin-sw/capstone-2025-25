package capstone.backend.domain.inventory.controller;

import capstone.backend.domain.inventory.request.InventoryFolderCreateRequest;
import capstone.backend.domain.inventory.response.InventoryFolderResponse;
import capstone.backend.domain.inventory.service.InventoryFolderService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "보관함 폴더", description = "보관함 폴더 관련 API")
@RestController
@RequestMapping("/api/inventory/folder")
@RequiredArgsConstructor
public class InventoryFolderController {
    private final InventoryFolderService inventoryFolderService;

    @Operation(summary = "보관함 폴더 생성")
    @PostMapping
    public ApiResponse<InventoryFolderResponse> createInventoryFolder(
        @RequestBody @Valid InventoryFolderCreateRequest inventoryFolderCreateRequest,
        @AuthenticationPrincipal CustomOAuth2User user
    ){
        return ApiResponse.ok(inventoryFolderService.createInventoryFolder(inventoryFolderCreateRequest,
            user.getMemberId()));
    }

    @Operation(summary = "보관함 폴더 전체 조회")
    @GetMapping
    public ApiResponse<List<InventoryFolderResponse>> getInventoryFolders(
        @AuthenticationPrincipal CustomOAuth2User user
    ){
        return ApiResponse.ok(inventoryFolderService.getInventoryFolders(user.getMemberId()));
    }
}
