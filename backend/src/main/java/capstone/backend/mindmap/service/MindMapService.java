package capstone.backend.mindmap.service;

import capstone.backend.mindmap.dto.request.MindMapRequest;
import capstone.backend.mindmap.dto.response.MindMapResponse;
import capstone.backend.mindmap.entity.*;
import capstone.backend.mindmap.repository.MindMapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MindMapService {
    @Autowired
    private MindMapRepository mindMapRepository;

    public MindMapService(MindMapRepository mindMapRepository) {
        this.mindMapRepository = mindMapRepository;
    }

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
            .orElseThrow(() -> new IllegalArgumentException("MindMap을 찾을 수 없습니다. ID: " + id));
    }

}
