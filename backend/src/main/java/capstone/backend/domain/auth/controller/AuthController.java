package capstone.backend.domain.auth.controller;

import capstone.backend.domain.auth.dto.request.AccessTokenRequest;
import capstone.backend.domain.auth.dto.response.AccessTokenResponse;
import capstone.backend.domain.auth.dto.response.TokenResponse;
import capstone.backend.domain.auth.service.AuthService;
import capstone.backend.domain.member.service.MemberService;
import capstone.backend.global.api.dto.ApiResponse;
import capstone.backend.global.security.oauth2.user.CustomOAuth2User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "인증/인가", description = "JWT 관련 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final MemberService memberService;

    @PostMapping("/reissue")
    @Operation(summary = "Access Token 재발급", description = "refreshToken이 담긴 Cookie를 받아서 AT 재발급")
    public ApiResponse<AccessTokenResponse> refreshToken(
            @CookieValue(value = "refreshToken", required = false) String refreshToken
    ) {
        return ApiResponse.ok(authService.reissueAccessToken(refreshToken));
    }

    @PostMapping("/token")
    @Operation(
            summary = "code를 통한 AT, RT 발급",
            description = "소셜 로그인 이후 임시 발급한 code를 가지고 해당 API 요청 시 AT, RT 발급"
    )
    public ApiResponse<AccessTokenResponse> issueToken(
            @Parameter(name = "code", description = "OAuth 인증 후 리디렉션되는 임시 코드", required = true, example = "abc123")
            @RequestParam String code,
            HttpServletResponse response
    ) {
        TokenResponse tokenResponse = authService.loginByCode(code);

        // RT 쿠키 설정
        /*
          https 환경에서 secure = true로 설정할 경우 samesite=None으로 설정해줘야 함
          브라우저가 크로스 도메인 요청에서 SameSite=Lax 또는 미지정 쿠키를 거부함.
          따라서, SameSite=None & Secure=True 설정을 같이 적용해줘야 함.
         */
        String cookieValue = String.format(
                "refreshToken=%s; Path=/; Max-Age=%d; HttpOnly; Secure; SameSite=None",
                tokenResponse.refreshToken(),
                336 * 3600
        );
        response.addHeader("Set-Cookie", cookieValue);

        // AT는 body에 담아 응답
        return ApiResponse.ok(new AccessTokenResponse(tokenResponse.accessToken(), tokenResponse.isFirstLogin()));
    }

    @PostMapping("/logout")
    @Operation(
            summary = "로그아웃",
            description = "Redis에서 RT 삭제, 사용중인 AT를 BlackList로 등록"
    )
    public ApiResponse<Void> logout(
            @AuthenticationPrincipal CustomOAuth2User user,
            @RequestBody @Valid AccessTokenRequest request
    ) {
        authService.logout(user.getMemberId(), request.accessToken());
        return ApiResponse.ok();
    }

    @DeleteMapping
    @Operation(
            summary = "회원 탈퇴",
            description = "회원 탈퇴와 동시에 기존의 AT BlackList로 등록, 기존의 회원이 사용하던 RT 삭제"
    )
    public ApiResponse<Void> delete(
            @AuthenticationPrincipal CustomOAuth2User user,
            @RequestBody @Valid AccessTokenRequest request
    ) {
        authService.logout(user.getMemberId(), request.accessToken());
        memberService.deleteMember(user.getMemberId());
        return ApiResponse.ok();
    }
}