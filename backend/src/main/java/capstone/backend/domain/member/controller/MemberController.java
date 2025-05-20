package capstone.backend.domain.member.controller;


import capstone.backend.domain.member.dto.response.UserDataDTO;
import capstone.backend.domain.member.service.MemberService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "유저 정보", description = "유저 정보 관련 API")
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/me")
    @Operation(summary = "상단바 유저 정보", description = "email, username 데이터")
    public ApiResponse<UserDataDTO> me(
            @AuthenticationPrincipal CustomOAuth2User user
    ) {
        return ApiResponse.ok(memberService.findMember(user.getMemberId()));
    }

    @PatchMapping("/me/registered")
    @Operation(summary = "재로그인 처리 API", description = "튜토리얼 페이지 이후 최초 로그인 설정 해제")
    public ApiResponse<Void> reLogin(
            @AuthenticationPrincipal CustomOAuth2User user
    ) {
        memberService.updateLoginStatus(user.getMemberId());
        return ApiResponse.ok();
    }
}
