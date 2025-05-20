package capstone.backend.domain.bubble.service;


import capstone.backend.domain.bubble.dto.request.BubbleUpdateRequest;
import capstone.backend.domain.bubble.dto.request.MergeBubbleRequest;
import capstone.backend.domain.bubble.dto.response.BubbleDTO;
import capstone.backend.domain.bubble.entity.Bubble;
import capstone.backend.domain.bubble.exception.BubbleNotFoundException;
import capstone.backend.domain.bubble.repository.BubbleRepository;
import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemCreateRequest;
import capstone.backend.domain.eisenhower.service.EisenhowerItemService;
import capstone.backend.domain.inventory.dto.request.InventoryItemCreateRequest;
import capstone.backend.domain.inventory.service.InventoryItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class BubbleService {

    private final BubbleRepository bubbleRepository;
    private final EisenhowerItemService eisenhowerItemService;
    private final InventoryItemService inventoryItemService;

    // 버블 전체 조회
    public List<BubbleDTO> findBubbles(Long memberId) {
        return bubbleRepository.findAllByMemberId(memberId)
                .stream().map(BubbleDTO::new).toList();
    }

    // 버블 확정 (아이젠하워로)
    @Transactional
    public void confirmToEisenhower(EisenhowerItemCreateRequest request, Long memberId, Long bubbleId) {
        Bubble bubble = bubbleRepository.findByMemberIdAndId(memberId, bubbleId).orElseThrow(BubbleNotFoundException::new);

        eisenhowerItemService.createItem(request, memberId);
        bubbleRepository.delete(bubble);
        log.info("Eisenhower item confirmed for bubble {}", bubbleId);
    }

    // 버블 확정 (보관함)
    @Transactional
    public void confirmToInventory(InventoryItemCreateRequest request, Long memberId, Long bubbleId) {
        Bubble bubble = bubbleRepository.findByMemberIdAndId(memberId, bubbleId).orElseThrow(BubbleNotFoundException::new);

        // 보관함 아이템 생성 로직 구현
        inventoryItemService.createInventoryItem(request, memberId);

        bubbleRepository.delete(bubble);
    }

    // 버블 삭제
    @Transactional
    public void deleteBubble(Long memberId, Long bubbleId) {
        Bubble bubble = bubbleRepository.findByMemberIdAndId(memberId, bubbleId).orElseThrow(BubbleNotFoundException::new);
        bubbleRepository.delete(bubble);
    }

    @Transactional
    public void updateBubble(Long memberId, Long id, @Valid BubbleUpdateRequest request) {
        Bubble bubble = bubbleRepository.findByMemberIdAndId(memberId, id)
                .orElseThrow(BubbleNotFoundException::new);
        bubble.update(request.title());
    }

    //버블 병합
    @Transactional
    public BubbleDTO mergeBubbles(Long memberId, MergeBubbleRequest request) {
        //버블 삭제
        List<Bubble> bubblesToDelete = bubbleRepository.findAllByMemberIdAndIdIn(memberId, request.bubbleList());

        if (bubblesToDelete.size() != request.bubbleList().size()) {
            throw new BubbleNotFoundException();
        }

        bubbleRepository.deleteAll(bubblesToDelete);

        //버블 생성
        Bubble newBubble = Bubble.create(request.mergedTitle(), bubblesToDelete.get(0).getMember());

        return new BubbleDTO(bubbleRepository.save(newBubble));
    }
}
