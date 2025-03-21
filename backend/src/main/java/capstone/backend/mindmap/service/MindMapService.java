package capstone.backend.mindmap.service;

import capstone.backend.mindmap.dto.request.MindMapRequest;
import capstone.backend.mindmap.dto.response.MindMapResponse;
import capstone.backend.mindmap.entity.*;
import capstone.backend.mindmap.repository.MindMapRepository;
import java.time.LocalDateTime;
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
        MindMap mindMap = new MindMap();
        mindMap.setOrderIndex(mindMapRequest.orderIndex());
        mindMap.setType(mindMapRequest.type());
        mindMap.setToDoDate(mindMapRequest.toDoDate());
        mindMap.setTitle(mindMapRequest.title());
        mindMap.setLastModifiedAt(LocalDateTime.now());
        mindMap.setMemberId(mindMapRequest.memberId());

        // 노드 리스트가 있다면 추가
        if (mindMapRequest.nodes() != null) {
            mindMap.setNodes(mindMapRequest.nodes());
        }

        MindMap savedMindMap = mindMapRepository.save(mindMap);
        return savedMindMap.getMindmapId();
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
