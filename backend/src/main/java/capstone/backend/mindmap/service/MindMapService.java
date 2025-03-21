package capstone.backend.mindmap.service;

import capstone.backend.mindmap.dto.request.MindMapRequest;
import capstone.backend.mindmap.dto.response.MindMapResponse;
import capstone.backend.mindmap.entity.*;
import capstone.backend.mindmap.exception.MindMapNotFoundException;
import capstone.backend.mindmap.repository.MindMapRepository;
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
            .map(mindMap -> MindMapResponse.builder()
                .id(mindMap.getMindmapId())
                .title(mindMap.getTitle())
                .build())
            .orElseThrow(MindMapNotFoundException::new);
    }

}
