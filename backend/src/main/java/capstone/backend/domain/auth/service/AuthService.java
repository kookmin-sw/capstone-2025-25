package capstone.backend.domain.auth.service;

import capstone.backend.domain.auth.dto.response.AccessTokenResponse;
import capstone.backend.domain.auth.dto.response.TokenResponse;
import capstone.backend.domain.auth.exception.CodeExpiredException;
import capstone.backend.domain.auth.exception.RefreshTokenExpiredException;
import capstone.backend.domain.auth.exception.TokenNotFoundException;
import capstone.backend.domain.auth.repository.BlacklistTokenRedisRepository;
import capstone.backend.domain.auth.repository.OauthCodeRedisRepository;
import capstone.backend.domain.auth.repository.RefreshTokenRedisRepository;
import capstone.backend.domain.auth.schema.BlacklistToken;
import capstone.backend.domain.auth.schema.OauthCode;
import capstone.backend.domain.auth.schema.RefreshToken;
import capstone.backend.domain.member.service.MemberService;
import capstone.backend.global.security.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final OauthCodeRedisRepository oauthCodeRedisRepository;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final BlacklistTokenRedisRepository blacklistTokenRedisRepository;
    private final JwtProvider jwtProvider;
    private final MemberService memberService;

    public void saveRefreshToken(Long memberId, String token) {
        RefreshToken refreshToken = new RefreshToken(memberId, token, memberId, jwtProvider.getRefreshTokenExpiration());
        refreshTokenRedisRepository.save(refreshToken);
    }

    // AT 재발급
    public AccessTokenResponse reissueAccessToken(String refreshToken) {
        RefreshToken storedToken = refreshTokenRedisRepository.findByToken(refreshToken)
                .orElseThrow(TokenNotFoundException::new);

        // 실제 RT가 유효한지 검증 (만료 여부 포함)
        if (!jwtProvider.validateToken(storedToken.token())) {
            throw new RefreshTokenExpiredException();
        }

        String accessToken = jwtProvider.refreshAccessToken(storedToken.token());
        return new AccessTokenResponse(accessToken);
    }

    // 임시 코드 생성 및 저장
    public String generateOneTimeCode(Long memberId) {
        String code = UUID.randomUUID().toString();
        oauthCodeRedisRepository.save(new OauthCode(memberId, code, memberId, 60000));
        return code;
    }

    // code를 통한 AT, RT 발급
    public TokenResponse loginByCode(String code) {
        Long memberId = oauthCodeRedisRepository.findByCode(code)
                .map(OauthCode::memberId)
                .orElseThrow(CodeExpiredException::new);

        oauthCodeRedisRepository.deleteByCode(code);  // 재사용 방지

        String accessToken = jwtProvider.generateAccessToken(memberId.toString());
        String refreshToken = jwtProvider.generateRefreshToken(memberId.toString());

        saveRefreshToken(memberId, refreshToken);  // Redis에 RT 저장

        // 핵심 로직: 최초 로그인 여부 판단
        boolean isFirstLogin = memberService.isMemberRegistered(memberId);

        return new TokenResponse(accessToken, refreshToken, isFirstLogin);
    }

    // 로그아웃 로직
    public void logout(Long memberId, String accessToken) {
        // 1. RT 삭제
        refreshTokenRedisRepository.findById(memberId)
                .ifPresent(refreshTokenRedisRepository::delete);

        // 2. AT 블랙리스트 등록
        long expiration = jwtProvider.getRemainingExpiration(accessToken);
        if (expiration > 0) {
            BlacklistToken blacklistToken = BlacklistToken.builder()
                    .token(accessToken)
                    .ttl(expiration)
                    .build();
            blacklistTokenRedisRepository.save(blacklistToken);
        }

        log.info("로그아웃 처리 완료 - memberId={}, AT 블랙리스트 등록", memberId);
    }
}
