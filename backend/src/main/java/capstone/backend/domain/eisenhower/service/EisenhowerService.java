package capstone.backend.domain.eisenhower.service;

import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemCreateRequest;
import capstone.backend.domain.eisenhower.dto.response.EisenhowerItemResponse;
import capstone.backend.domain.eisenhower.entity.EisenhowerCategory;
import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import capstone.backend.domain.eisenhower.exception.CategoryNotFoundException;
import capstone.backend.domain.eisenhower.repository.EisenhowerCategoryRepository;
import capstone.backend.domain.eisenhower.repository.EisenhowerItemRepository;
import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EisenhowerService {

    private final EisenhowerItemRepository eisenhowerItemRepository;
    private final EisenhowerCategoryRepository eisenhowerCategoryRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public EisenhowerItemResponse createItem(EisenhowerItemCreateRequest request, Long memberId) {
        EisenhowerCategory category = null;

        if (request.categoryId() != null) {
            category = eisenhowerCategoryRepository.findById(request.categoryId())
                    .orElseThrow(CategoryNotFoundException::new);
        }

        Member member = memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);

        EisenhowerItem item = EisenhowerItem.from(request, member, category);

        return EisenhowerItemResponse.from(eisenhowerItemRepository.save(item));
    }

}
