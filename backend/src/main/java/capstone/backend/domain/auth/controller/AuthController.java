package capstone.backend.domain.auth.controller;

import capstone.backend.domain.auth.dto.request.RefreshAccessTokenRequest;
import capstone.backend.domain.auth.dto.response.RefreshAccessTokenResponse;
import capstone.backend.domain.auth.service.AuthService;
import capstone.backend.global.api.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/refresh-token")
    @Operation(summary = "Access Token 재발급")
    public ApiResponse<RefreshAccessTokenResponse> refreshToken(
            @CookieValue(value = "refreshToken", required = false) String refreshToken
    ) {
        return ApiResponse.ok(authService.refreshAccessToken(refreshToken));
    }
}