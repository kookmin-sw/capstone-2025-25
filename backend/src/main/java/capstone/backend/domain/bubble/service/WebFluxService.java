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
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class WebFluxService {

    private final WebClient webClient;
    private final BubbleRepository bubbleRepository;

    @Value("${url.path.model.prompt}")
    private String gptServerEndpoint;

    // 비동기 처리
    // memberRepository에서 직접 조회하는 경우 동기적으로 작동함
    // 따라서, 한 트랜잭션 안에 member를 조회하는 로직을 제외하고 Member 객체를 받게 로직 설정
    @Transactional
    public Mono<List<BubbleDTO>> createBubblesAsync(PromptRequest request, Member member) {
        log.info("GPT API 호출 (비동기)");

        return webClient.post()
                .uri(gptServerEndpoint)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(PromptResponse.class)
                .flatMapMany(response -> {
                    List<String> chunks = response.chunks();
                    if (chunks == null || chunks.isEmpty()) {
                        log.warn("GPT 응답의 chunks가 null 또는 비어있음: response = {}", response);
                        return Flux.empty();
                    }
                    return Flux.fromIterable(chunks)
                            .map(chunk -> {
                                Bubble bubble = Bubble.create(chunk, member);
                                bubbleRepository.save(bubble);
                                log.info("Bubble 저장 완료: bubble = {}", chunk);
                                return new BubbleDTO(bubble);
                            });
                })
                .collectList();
    }

    // 버블 생성 동기 처리
    @Transactional
    public List<BubbleDTO> createBubblesSync(PromptRequest request, Member member) {
        log.info("GPT API 호출 (동기)");

        // GPT API 응답 동기 처리
        PromptResponse response = webClient.post()
                .uri(gptServerEndpoint)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(PromptResponse.class)
                .block();

        if (response == null || response.chunks() == null || response.chunks().isEmpty()) {
            log.warn("GPT 응답의 chunks가 null 또는 비어있음: response = {}", response);
            return Collections.emptyList();
        }

        List<BubbleDTO> bubbleDTOs = new ArrayList<>();
        for (String chunk : response.chunks()) {
            Bubble bubble = Bubble.create(chunk, member);
            bubbleRepository.save(bubble);
            log.info("Bubble 저장 완료: bubble = {}", chunk);
            bubbleDTOs.add(new BubbleDTO(bubble));
        }

        return bubbleDTOs;
    }
}
