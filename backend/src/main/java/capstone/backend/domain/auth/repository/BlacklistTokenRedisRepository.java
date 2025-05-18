package capstone.backend.domain.auth.repository;

import capstone.backend.domain.auth.entity.BlacklistToken;
import org.springframework.data.keyvalue.repository.KeyValueRepository;

public interface BlacklistTokenRedisRepository extends KeyValueRepository<BlacklistToken, String> {
}