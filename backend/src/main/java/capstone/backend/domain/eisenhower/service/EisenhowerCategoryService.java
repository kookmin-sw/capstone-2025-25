package capstone.backend.domain.eisenhower.service;

import capstone.backend.domain.eisenhower.dto.request.EisenhowerCategoryCreateRequest;
import capstone.backend.domain.eisenhower.dto.response.EisenhowerCategoryResponse;
import capstone.backend.domain.eisenhower.dto.request.EisenhowerCategoryUpdateRequest;
import capstone.backend.domain.eisenhower.entity.EisenhowerCategory;
import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import capstone.backend.domain.eisenhower.exception.CategoryNotFoundException;
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
public class EisenhowerCategoryService {

    private final EisenhowerCategoryRepository eisenhowerCategoryRepository;
    private final MemberRepository memberRepository;
    private final EisenhowerItemRepository eisenhowerItemRepository;

    public List<EisenhowerCategoryResponse> getEisenhowerCategories(Long memberId) {
        return eisenhowerCategoryRepository.findAllByMemberId(memberId)
                .orElseThrow(CategoryNotFoundException::new)
                .stream()
                .map(EisenhowerCategoryResponse::from)
                .toList();
    }

    @Transactional
    public EisenhowerCategoryResponse createEisenhowerCategory(EisenhowerCategoryCreateRequest eisenhowerCategoryRequest, Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);

        EisenhowerCategory eisenhowerCategory = EisenhowerCategory.from(eisenhowerCategoryRequest, member);

        return EisenhowerCategoryResponse.from(eisenhowerCategoryRepository.save(eisenhowerCategory));
    }

    @Transactional
    public EisenhowerCategoryResponse updateEisenhowerCategory(
            EisenhowerCategoryUpdateRequest eisenhowerCategoryUpdateRequest, Long memberId, Long categoryId) {
        EisenhowerCategory eisenhowerCategory = eisenhowerCategoryRepository.findByIdAndMemberId(categoryId, memberId)
                .orElseThrow(CategoryNotFoundException::new);

        eisenhowerCategory.update(eisenhowerCategoryUpdateRequest);

        return EisenhowerCategoryResponse.from(eisenhowerCategory);
    }

    @Transactional
    public void deleteEisenhowerCategory(Long memberId, Long categoryId) {
        EisenhowerCategory eisenhowerCategory = eisenhowerCategoryRepository.findByIdAndMemberId(categoryId, memberId)
                .orElseThrow(CategoryNotFoundException::new);

        List<EisenhowerItem> items = eisenhowerItemRepository.findAllByMemberIdAndCategoryId(memberId, categoryId);

        for (EisenhowerItem item : items) {
            item.deleteCategory();
        }

        eisenhowerCategoryRepository.delete(eisenhowerCategory);
    }
}
