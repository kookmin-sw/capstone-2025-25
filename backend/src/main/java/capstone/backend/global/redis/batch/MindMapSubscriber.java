package capstone.backend.global.redis.batch;

import capstone.backend.domain.mindmap.entity.MindMap;
import capstone.backend.domain.mindmap.repository.MindMapRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
/**
 * 배치 프로세싱 수행
 */
public class MindMapSubscriber {

    private final StringRedisTemplate redisTemplate;
    private final MindMapRepository mindMapRepository;
    private final ObjectMapper objectMapper;

    private static final String MINDMAP_KEY_PATTERN = "mindmap:*";

    public void receiveMessage(String mindMapId) {
        log.info("Triggering batch process for MindMap: {}", mindMapId);
    }

    // 배치 프로세스 실행 (예: 5분마다 실행)
    @Scheduled(fixedRate = 300000)
    public void processBatch() {
        Set<String> keys = redisTemplate.keys(MINDMAP_KEY_PATTERN);

        if (keys == null || keys.isEmpty()) return;

        List<MindMap> mindMaps = keys.stream()
                .map(key -> redisTemplate.opsForValue().get(key))
                .filter(Objects::nonNull)
                .map(this::deserializeMindMap)
                .toList();

        mindMapRepository.saveAll(mindMaps); // MongoDB에 벌크 업데이트
        redisTemplate.delete(keys); // 처리된 데이터 삭제
        log.info("Batch updated {} mindmaps and cleared from Redis.", mindMaps.size());
    }

    private MindMap deserializeMindMap(String json) {
        try {
            return objectMapper.readValue(json, MindMap.class);
        } catch (JsonProcessingException e) {
            log.error("Error deserializing MindMap", e);
            throw new RuntimeException("Deserialization Error");
        }
    }
}
