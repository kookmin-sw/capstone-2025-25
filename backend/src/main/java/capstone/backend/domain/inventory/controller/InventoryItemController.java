package capstone.backend.domain.inventory.controller;

import capstone.backend.domain.inventory.request.InventoryItemCreateRequest;
import capstone.backend.domain.inventory.request.InventoryItemUpdateRequest;
import capstone.backend.domain.inventory.request.InventoryItemMoveRequest;
import capstone.backend.domain.inventory.response.InventoryItemResponse;
import capstone.backend.domain.inventory.service.InventoryItemService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v2/inventory")
@RequiredArgsConstructor
@Tag(name = "보관함", description = "보관함 아이템 관련 API")
public class InventoryItemController {

    private final InventoryItemService inventoryItemService;

    @Operation(summary = "보관함 아이템 생성", description = "보관함 아이템을 생성합니다.")
    @PostMapping
    public ApiResponse<InventoryItemResponse> createInventoryItem(
        @AuthenticationPrincipal CustomOAuth2User user,
        @RequestBody @Valid InventoryItemCreateRequest request
    ){
        InventoryItemResponse response = inventoryItemService.createInventoryItem(request, user.getMemberId());
        return ApiResponse.ok(response);
    }

    @Operation(summary = "보관함 폴더별 조회", description = "폴더 안에 있는 보관함 아이템들을 조회합니다.")
    @GetMapping("/{folderId}")
    public ApiResponse<Page<InventoryItemResponse>> getInventoryItems(
        @AuthenticationPrincipal CustomOAuth2User user,
        @Parameter(name = "folderId", description = "조회할 폴더 ID", example = "1", required = true)
        @PathVariable Long folderId,
        @ParameterObject Pageable pageable
    ){
        Page<InventoryItemResponse> response = inventoryItemService.getInventoryItems(folderId, user.getMemberId(),pageable);
        return ApiResponse.ok(response);
    }

    @Operation(summary = "보관함 아이템 상세 조회", description = "보관함 아이템의 메모 조회")
    @GetMapping("/item/{itemId}")
    public ApiResponse<InventoryItemResponse> getInventoryItemDetail(
        @AuthenticationPrincipal CustomOAuth2User user,
        @Parameter(name = "itemId", description = "상세 조회 할 아이템 ID", example = "1", required = true)
        @PathVariable Long itemId
    ){
        InventoryItemResponse response = inventoryItemService.getInventoryItemDetail(itemId, user.getMemberId());
        return ApiResponse.ok(response);
    }

    @Operation(summary = "보관함 아이템 삭제", description = "보관함 아이템 삭제")
    @DeleteMapping("/item/{itemId}")
    public ApiResponse<Void> deleteInventoryItem(
        @AuthenticationPrincipal CustomOAuth2User user,
        @Parameter(name = "itemId", description = "삭제할 아이템 ID", example = "1", required = true)
        @PathVariable Long itemId
    ){
        inventoryItemService.deleteInventoryItem(itemId, user.getMemberId());
        return ApiResponse.ok();
    }

    @Operation(summary = "보관함 아이템 수정", description = "보관함 아이템 수정")
    @PatchMapping("/item/{itemId}")
    public ApiResponse<InventoryItemResponse> updateInventoryItem(
        @AuthenticationPrincipal CustomOAuth2User user,
        @Parameter(name = "itemId", description = "수정할 아이템 ID", example = "1", required = true)
        @PathVariable Long itemId,
        @RequestBody @Valid InventoryItemUpdateRequest request
    ){
        return ApiResponse.ok(inventoryItemService.updateInventoryItem(itemId, user.getMemberId(), request));
    }

    @Operation(summary = "보관함 아이템의 폴더 변경", description = "보관함 아이템의 폴더를 변경합니다.")
    @PatchMapping("/move/{itemId}")
    public ApiResponse<InventoryItemResponse> updateInventoryItemFolder(
        @AuthenticationPrincipal CustomOAuth2User user,
        @Parameter(name = "itemId", description = "폴더 변경할 아이템 ID", example = "1", required = true)
        @PathVariable Long itemId,
        @RequestBody @Valid InventoryItemMoveRequest request
    ){
        return ApiResponse.ok(inventoryItemService.moveInventoryItemFolder(user.getMemberId(), itemId, request.folderId()));
    }

    @Operation(summary = "최근 생성한 5개 보관함 아이템 조회", description = "보관함 아이템 Top5에 대해 생성순으로 조회합니다.")
    @GetMapping("/recent")
    public ApiResponse<List<InventoryItemResponse>> getRecentInventoryItems(
        @AuthenticationPrincipal CustomOAuth2User user
    ){
        return ApiResponse.ok(inventoryItemService.getRecentItems(user.getMemberId()));
    }
}
