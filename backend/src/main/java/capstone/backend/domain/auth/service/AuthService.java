package capstone.backend.domain.auth.service;

import capstone.backend.domain.auth.dto.request.RefreshAccessTokenRequest;
import capstone.backend.domain.auth.dto.response.RefreshAccessTokenResponse;
import capstone.backend.domain.auth.exception.RefreshTokenExpiredException;
import capstone.backend.global.security.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtProvider jwtProvider;

    public RefreshAccessTokenResponse refreshAccessToken(RefreshAccessTokenRequest request) {
        String newAccessToken = jwtProvider.refreshAccessToken(request.token());

        if (newAccessToken != null) {
            return new RefreshAccessTokenResponse(newAccessToken);
        } else {
            throw new RefreshTokenExpiredException();
        }
    }
}
