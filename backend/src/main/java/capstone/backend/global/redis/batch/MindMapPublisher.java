package capstone.backend.global.redis.batch;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
/**
 * Redis에 마지막 PUT 요청만 저장
 */
public class MindMapPublisher {

//    private final StringRedisTemplate redisTemplate;
//    private final ObjectMapper objectMapper;
//    private static final String MINDMAP_KEY_PREFIX = "mindmap:";
//
//    public void saveMindMapToRedis(MindMap mindMap) {
//        String key = MINDMAP_KEY_PREFIX + mindMap.getId();
//        String jsonValue = serializeMindMap(mindMap);
//
//        redisTemplate.opsForValue().set(key, jsonValue); // 가장 최신 데이터로 덮어쓰기
//        redisTemplate.convertAndSend("mindmap-processing", mindMap.getId()); // 배치 실행을 위한 신호 전송
//
//        log.info("Saved MindMap to Redis: {}", mindMap.getId());
//    }
//
//    private String serializeMindMap(MindMap mindMap) {
//        try {
//            return objectMapper.writeValueAsString(mindMap);
//        } catch (JsonProcessingException e) {
//            log.error("Error serializing MindMap", e);
//            throw new RuntimeException("Serialization Error");
//        }
//    }
}
