package capstone.backend.domain.bubble.service;


import capstone.backend.domain.bubble.dto.request.PromptRequest;
import capstone.backend.domain.bubble.dto.response.BubbleDTO;
import capstone.backend.domain.bubble.dto.response.PromptResponse;
import capstone.backend.domain.bubble.entity.Bubble;
import capstone.backend.domain.bubble.repository.BubbleRepository;
import capstone.backend.domain.member.scheme.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class WebFluxService {

    private final WebClient.Builder webClientBuilder;
    private final BubbleRepository bubbleRepository;

    @Value("${url.path.model.prompt}")
    private String gptServerEndpoint;

    // memberRepository에서 직접 조회하는 경우 동기적으로 작동함
    // 따라서, 한 트랜잭션 안에 member를 조회하는 로직을 제외하고 Member 객체를 받게 로직 설정
    @Transactional
    public Mono<List<BubbleDTO>> createBubbles(PromptRequest request, Member member) {
        log.info("GPT API 호출");

        WebClient webClient = webClientBuilder.build();

        return webClient.post()
                .uri(gptServerEndpoint)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(PromptResponse.class)
                .map(response -> {
                    // 요청 결과를 Bubble 엔티티로 변환
                    List<Bubble> bubbles = response.chunks().stream()
                            .map(title -> Bubble.create(title, member))
                            .toList();

                    // 저장
                    bubbleRepository.saveAll(bubbles);

                    log.info("Bubbles 저장 완료: count = {}", bubbles.size());

                    // DTO 변환
                    return bubbles.stream()
                            .map(BubbleDTO::new)
                            .toList();
                });
    }
}
