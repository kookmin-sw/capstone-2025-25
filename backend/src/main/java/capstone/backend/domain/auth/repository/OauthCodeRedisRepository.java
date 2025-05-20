package capstone.backend.domain.auth.repository;

import capstone.backend.domain.auth.entity.OauthCode;
import org.springframework.data.keyvalue.repository.KeyValueRepository;

import java.util.Optional;

public interface OauthCodeRedisRepository extends KeyValueRepository<OauthCode, Long> {
    Optional<OauthCode> findByCode(String code);

    void deleteByCode(String code);
}
