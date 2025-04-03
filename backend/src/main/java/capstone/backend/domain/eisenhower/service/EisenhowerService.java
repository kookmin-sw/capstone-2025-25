package capstone.backend.domain.eisenhower.service;

import capstone.backend.domain.eisenhower.dto.request.EisenhowerUpdateRequest;
import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemCreateRequest;
import capstone.backend.domain.eisenhower.dto.response.EisenhowerItemResponse;
import capstone.backend.domain.eisenhower.entity.EisenhowerCategory;
import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import capstone.backend.domain.eisenhower.exception.CategoryNotFoundException;
import capstone.backend.domain.eisenhower.exception.EisenhowerItemNotFoundException;
import capstone.backend.domain.eisenhower.repository.EisenhowerCategoryRepository;
import capstone.backend.domain.eisenhower.repository.EisenhowerItemRepository;
import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import java.util.List;
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
            category = eisenhowerCategoryRepository.findByIdAndMemberId(request.categoryId(), memberId)
                    .orElseThrow(CategoryNotFoundException::new);
        }

        Member member = memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);

        EisenhowerItem item = EisenhowerItem.from(request, member, category);

        return EisenhowerItemResponse.from(eisenhowerItemRepository.save(item));
    }

    public List<EisenhowerItemResponse> getItemsNotCompleted(Long memberId) {
        List<EisenhowerItem> items = eisenhowerItemRepository.findAllByMemberIdAndIsCompletedFalse(memberId);
        return EisenhowerItemResponse.listFrom(items);
    }


    public List<EisenhowerItemResponse> getItemsCompleted(Long memberId) {
        List<EisenhowerItem> items = eisenhowerItemRepository.findAllByMemberIdAndIsCompletedTrue(memberId);
        return EisenhowerItemResponse.listFrom(items);
    }

    @Transactional
    public EisenhowerItemResponse updateItem(Long memberId, Long itemId, EisenhowerUpdateRequest request) {
        EisenhowerItem item = eisenhowerItemRepository.findByIdAndMemberId(itemId, memberId)
                .orElseThrow(EisenhowerItemNotFoundException::new);

        EisenhowerCategory category = item.getCategory();
        if (Boolean.TRUE.equals(request.categoryExplicitlyNull())) {
            category = null;
        } else if (request.categoryId() != null) {
            category = eisenhowerCategoryRepository.findByIdAndMemberId(request.categoryId(), memberId)
                    .orElseThrow(CategoryNotFoundException::new);
        }

        item.update(request, category);

        return EisenhowerItemResponse.from(item);
    }

    @Transactional
    public void deleteItem(Long memberId, Long itemId) {
        EisenhowerItem item = eisenhowerItemRepository.findByIdAndMemberId(itemId, memberId)
                .orElseThrow(EisenhowerItemNotFoundException::new);

        eisenhowerItemRepository.delete(item);
    }
}
