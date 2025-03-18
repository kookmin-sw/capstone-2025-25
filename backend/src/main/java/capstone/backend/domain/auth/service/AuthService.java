package capstone.backend.domain.auth.service;

import capstone.backend.domain.auth.dto.request.RefreshAccessTokenRequest;
import capstone.backend.domain.auth.dto.response.RefreshAccessTokenResponse;
import capstone.backend.domain.auth.exception.RefreshTokenExpiredException;
import capstone.backend.global.security.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AuthService {

    private final JwtProvider jwtProvider;

    @Transactional
    public RefreshAccessTokenResponse refreshAccessToken(RefreshAccessTokenRequest request) {
        Optional<String> newAccessToken = jwtProvider.refreshAccessToken(request.token());

        if (newAccessToken.isPresent()) {
            return new RefreshAccessTokenResponse(newAccessToken.get());
        } else {
            throw new RefreshTokenExpiredException();
        }
    }
}
