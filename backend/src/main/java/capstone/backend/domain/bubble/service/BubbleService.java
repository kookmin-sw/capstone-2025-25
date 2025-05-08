package capstone.backend.domain.bubble.service;


import capstone.backend.domain.bubble.dto.request.ConfirmBubbleRequest;
import capstone.backend.domain.bubble.dto.response.BubbleDTO;
import capstone.backend.domain.bubble.entity.Bubble;
import capstone.backend.domain.bubble.exception.BubbleNotFoundException;
import capstone.backend.domain.bubble.repository.BubbleRepository;
import capstone.backend.domain.eisenhower.dto.request.EisenhowerItemCreateRequest;
import capstone.backend.domain.eisenhower.service.EisenhowerItemService;
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

    // 버블 확정 (생각 바구니로)
    @Transactional
    public void confirmToInventory(ConfirmBubbleRequest request, Long memberId, Long bubbleId) {
        Bubble bubble = bubbleRepository.findByMemberIdAndId(memberId, bubbleId).orElseThrow(BubbleNotFoundException::new);

        // TODO 추후 보관함 생성 로직 구현


        bubbleRepository.delete(bubble);
    }

    // 버블 삭제
    @Transactional
    public void deleteBubble(Long memberId, Long bubbleId) {
        Bubble bubble = bubbleRepository.findByMemberIdAndId(memberId, bubbleId).orElseThrow(BubbleNotFoundException::new);
        bubbleRepository.delete(bubble);
    }
}
