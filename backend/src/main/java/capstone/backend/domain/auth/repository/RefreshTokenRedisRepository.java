package capstone.backend.domain.auth.repository;

import capstone.backend.domain.auth.schema.RefreshToken;
import org.springframework.data.keyvalue.repository.KeyValueRepository;

import java.util.Optional;

public interface RefreshTokenRedisRepository extends KeyValueRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);
}