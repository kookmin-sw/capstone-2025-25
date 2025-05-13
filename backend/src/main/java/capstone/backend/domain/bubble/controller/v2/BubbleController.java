package capstone.backend.domain.bubble.controller.v2;


import capstone.backend.domain.bubble.dto.request.BubbleUpdateRequest;
import capstone.backend.domain.bubble.dto.request.PromptRequest;
import capstone.backend.domain.bubble.dto.response.BubbleDTO;
import capstone.backend.domain.bubble.service.BubbleService;
import capstone.backend.domain.bubble.service.WebFluxService;
import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemCreateRequest;
import capstone.backend.domain.inventory.dto.request.InventoryItemCreateRequest;
import capstone.backend.domain.member.scheme.Member;
import capstone.backend.domain.member.service.MemberService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "버블 API", description = "버블 관련 API 구현")
@RestController
@RequestMapping("/api/v2/bubble")
@RequiredArgsConstructor
public class BubbleController {

    private final BubbleService bubbleService;
    private final MemberService memberService;
    private final WebFluxService webFluxService;

    @GetMapping
    @Operation(summary = "버블 전체 조회 API", description = "버블 전체 조회 시 prompt, id 반환")
    public ApiResponse<List<BubbleDTO>> getBubbles(
            @AuthenticationPrincipal CustomOAuth2User user
    ) {
        return ApiResponse.ok(bubbleService.findBubbles(user.getMemberId()));
    }

    @PostMapping("/create")
    @Operation(summary = "버블 생성 API", description = "프롬프트를 기준으로 GPT API에서 뽑아준 청크 단위로 버블 생성 후 반환")
    public ApiResponse<List<BubbleDTO>> createBubbles(
            @AuthenticationPrincipal CustomOAuth2User user,
            @Valid @RequestBody PromptRequest request
    ) {
        Member member = memberService.findById(user.getMemberId());
        return ApiResponse.ok(webFluxService.createBubblesSync(request, member));
//        return webFluxService.createBubblesAsync(request, member).map(ApiResponse::ok);
    }

    @PostMapping("/confirm-eisenhower/{id}")
    @Operation(summary = "버블 확정 (아이젠하워)", description = "버블 내용을 바탕으로 아이젠하워 TODO 생성")
    public ApiResponse<Void> confirmEisenhower(
            @AuthenticationPrincipal CustomOAuth2User user,
            @Valid @RequestBody EisenhowerItemCreateRequest request,
            @Parameter(name = "id", description = "버블 ID", example = "1", required = true)
            @PathVariable Long id
    ) {
        bubbleService.confirmToEisenhower(request, user.getMemberId(), id);
        return ApiResponse.ok();
    }

    @PostMapping("/confirm-inventory/{id}")
    @Operation(summary = "버블 확정 (보관함)", description = "request body의 memo 필드값은 null로 해주세요")
    public ApiResponse<Void> confirmInventory(
            @AuthenticationPrincipal CustomOAuth2User user,
            @Valid @RequestBody InventoryItemCreateRequest request,
            @Parameter(name = "id", description = "버블 ID", example = "1", required = true)
            @PathVariable Long id
    ) {
        bubbleService.confirmToInventory(request, user.getMemberId(), id);
        return ApiResponse.ok();
    }

    @PatchMapping("/{id}")
    @Operation(summary = "버블 수정", description = "특정 버블 수정 API")
    public ApiResponse<Void> updateBubble(
            @AuthenticationPrincipal CustomOAuth2User user,
            @Parameter(name = "id", description = "버블 ID", example = "1", required = true)
            @PathVariable Long id,
            @Valid @RequestBody BubbleUpdateRequest request
    ) {
        bubbleService.updateBubble(user.getMemberId(), id, request);
        return ApiResponse.ok();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "버블 삭제", description = "특정 버블 삭제 API")
    public ApiResponse<Void> deleteBubble(
            @AuthenticationPrincipal CustomOAuth2User user,
            @Parameter(name = "id", description = "버블 ID", example = "1", required = true)
            @PathVariable Long id
    ) {
        bubbleService.deleteBubble(user.getMemberId(), id);
        return ApiResponse.ok();
    }
}
