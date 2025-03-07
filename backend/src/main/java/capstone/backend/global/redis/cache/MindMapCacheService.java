package capstone.backend.global.redis.cache;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class MindMapCacheService {

    private final MindMapRepository mindMapRepository;

    @Cacheable(value = "mindmap", key = "#userId")
    public Optional<MindMap> getMindMap(String userId) {
        return mindMapRepository.findByUserId(userId);
    }

    @CachePut(value = "mindmap", key = "#mindMap.userId")
    public MindMap saveOrUpdateMindMap(MindMap mindMap) {
        return mindMapRepository.save(mindMap);
    }

    @CacheEvict(value = "mindmap", key = "#userId")
    public void deleteMindMap(String userId) {
        mindMapRepository.deleteByUserId(userId);
    }
}