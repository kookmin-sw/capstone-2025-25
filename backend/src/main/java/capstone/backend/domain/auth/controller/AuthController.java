package capstone.backend.domain.auth.controller;

import capstone.backend.domain.auth.dto.response.AccessTokenResponse;
import capstone.backend.domain.auth.dto.response.TokenResponse;
import capstone.backend.domain.auth.service.AuthService;
import capstone.backend.global.api.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "인증/인가", description = "JWT 관련 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

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
        Cookie refreshTokenCookie = new Cookie("refreshToken", tokenResponse.refreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(336 * 3600);
        response.addCookie(refreshTokenCookie);

        // AT는 body에 담아 응답
        return ApiResponse.ok(new AccessTokenResponse(tokenResponse.accessToken()));
    }
}