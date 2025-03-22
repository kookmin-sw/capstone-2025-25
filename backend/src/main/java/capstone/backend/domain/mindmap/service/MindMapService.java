package capstone.backend.domain.mindmap.service;

import capstone.backend.domain.mindmap.dto.request.MindMapRequest;
import capstone.backend.domain.mindmap.dto.response.MindMapResponse;
import capstone.backend.domain.mindmap.entity.MindMap;
import capstone.backend.domain.mindmap.entity.MindMapType;
import capstone.backend.domain.mindmap.exception.MindMapNotFoundException;
import capstone.backend.domain.mindmap.repository.MindMapRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MindMapService {
    private final MindMapRepository mindMapRepository;

    @Transactional
    public Long createMindMap(MindMapRequest mindMapRequest) {
        MindMap mindMap = MindMap.createMindMap(mindMapRequest);
        mindMapRepository.save(mindMap);
        return mindMap.getMindmapId();
    }

    public MindMapResponse getMindMapById(Long id){
        return mindMapRepository.findById(id)
            .map(MindMapResponse::fromEntity)
            .orElseThrow(MindMapNotFoundException::new);
    }

    @Transactional
    public void deleteMindMap(Long id) {
        if (!mindMapRepository.existsById(id)) {
            throw new MindMapNotFoundException(id);
        }

        mindMapRepository.deleteById(id);
    }

    public List<MindMapResponse> getMindMaps(LocalDate date, MindMapType type) {
        List<MindMap> mindMaps = mindMapRepository.findAllByToDoDateAndTypeOrderByOrderIndexAsc(date, type);

        if (mindMaps.isEmpty()) {
            throw new MindMapNotFoundException();
        }

        return mindMaps.stream()
            .map(MindMapResponse::fromEntity)
            .toList();
    }
}
