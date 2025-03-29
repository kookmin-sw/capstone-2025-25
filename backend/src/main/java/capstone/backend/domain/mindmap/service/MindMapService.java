package capstone.backend.domain.mindmap.service;

import capstone.backend.domain.mindmap.dto.request.MindMapRequest;
import capstone.backend.domain.mindmap.dto.request.UpdateMindMapTitleRequest;
import capstone.backend.domain.mindmap.dto.response.MindMapResponse;
import capstone.backend.domain.mindmap.entity.MindMap;
import capstone.backend.domain.mindmap.exception.MindMapNotFoundException;
import capstone.backend.domain.mindmap.repository.MindMapRepository;
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
        return mindMap.getId();
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

    @Transactional
    public void updateMindMap(Long id, MindMapRequest mindMapRequest) {
        MindMap mindMap = mindMapRepository.findById(id)
            .orElseThrow(() -> new MindMapNotFoundException(id));

        mindMap.update(mindMapRequest);
    }

    @Transactional
    public void updateMindMapTitle(Long id, UpdateMindMapTitleRequest request){
        MindMap mindMap = mindMapRepository.findById(id)
            .orElseThrow(() -> new MindMapNotFoundException(id));
        mindMap.updateTitle(request.title());
    }
}
