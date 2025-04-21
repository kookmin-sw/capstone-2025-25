package capstone.backend.domain.eisenhower.service;

import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemCreateRequest;
import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemFilterRequest;
import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemOrderUpdateRequest;
import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemUpdateRequest;
import capstone.backend.domain.eisenhower.dto.response.EisenhowerCategoryResponse;
import capstone.backend.domain.eisenhower.dto.response.EisenhowerItemResponse;
import capstone.backend.domain.eisenhower.entity.EisenhowerCategory;
import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import capstone.backend.domain.eisenhower.exception.CategoryNotFoundException;
import capstone.backend.domain.eisenhower.exception.EisenhowerItemNotFoundException;
import capstone.backend.domain.eisenhower.exception.MindMapNotLinkedToEisenhowerException;
import capstone.backend.domain.eisenhower.repository.EisenhowerCategoryRepository;
import capstone.backend.domain.eisenhower.repository.EisenhowerItemRepository;
import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EisenhowerItemService {

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

    public EisenhowerItemResponse getItem(Long memberId, Long itemId) {
        EisenhowerItem item = eisenhowerItemRepository.findByIdAndMemberId(itemId, memberId)
                .orElseThrow(EisenhowerItemNotFoundException::new);

        return EisenhowerItemResponse.from(item);
    }

    public Page<EisenhowerItemResponse> getItemsFiltered(Long memberId, EisenhowerItemFilterRequest filter, Pageable pageable) {
        return eisenhowerItemRepository.findFiltered(memberId, filter, pageable)
                .map(EisenhowerItemResponse::from);
    }

    @Transactional
    public EisenhowerItemResponse updateItem(Long memberId, Long itemId, EisenhowerItemUpdateRequest request) {
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

    @Transactional
    public void updateItemOrderAndQuadrant(Long memberId, List<EisenhowerItemOrderUpdateRequest> requests) {
        for (EisenhowerItemOrderUpdateRequest req : requests) {
            EisenhowerItem item = eisenhowerItemRepository.findByIdAndMemberId(req.eisenhowerItemId(), memberId)
                    .orElseThrow(EisenhowerItemNotFoundException::new);

            item.updateOrderAndQuadrant(req.order(), req.quadrant());
        }

    }

    public Page<EisenhowerItemResponse> searchItems(Long memberId, String keyword, Pageable pageable) {
        return eisenhowerItemRepository.findByMemberIdAndTitleContaining(memberId, keyword, pageable)
                .map(EisenhowerItemResponse::from);
    }

    //마인드맵 추출 시, 연관된 아이젠하워 카테고리 조회
    public EisenhowerCategoryResponse getCategoryByMindMapId(Long mindMapId, Long memberId){
        EisenhowerItem item = eisenhowerItemRepository.findByMemberIdAndMindMapId(memberId, mindMapId)
            .orElseThrow(MindMapNotLinkedToEisenhowerException::new);

        return EisenhowerCategoryResponse.from(item.getCategory());
    }
}
