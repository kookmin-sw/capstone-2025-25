package capstone.backend.domain.inventory.controller;

import capstone.backend.domain.inventory.request.InventoryItemCreateRequest;
import capstone.backend.domain.inventory.response.InventoryItemResponse;
import capstone.backend.domain.inventory.service.InventoryItemService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
}
