package capstone.backend.domain.auth.repository;

import capstone.backend.domain.auth.schema.BlacklistToken;
import org.springframework.data.keyvalue.repository.KeyValueRepository;

public interface BlacklistTokenRedisRepository extends KeyValueRepository<BlacklistToken, String> {
    boolean existsByToken(String token);
}