package capstone.backend.domain.auth.repository;

import capstone.backend.domain.member.scheme.Member;
import capstone.backend.domain.auth.scheme.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByMember(Member member);
}
