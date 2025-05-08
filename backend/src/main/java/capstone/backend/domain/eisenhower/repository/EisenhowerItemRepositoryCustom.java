package capstone.backend.domain.eisenhower.repository;

import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemFilterRequest;
import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EisenhowerItemRepositoryCustom {
    Page<EisenhowerItem> findFiltered(Long memberId, EisenhowerItemFilterRequest filter, Pageable pageable);
}
