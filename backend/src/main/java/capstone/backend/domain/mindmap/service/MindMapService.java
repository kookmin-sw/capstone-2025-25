package capstone.backend.domain.mindmap.service;

import capstone.backend.domain.eisenhower.entity.EisenhowerItem;
import capstone.backend.domain.eisenhower.exception.EisenhowerItemNotFoundException;
import capstone.backend.domain.eisenhower.repository.EisenhowerItemRepository;
import capstone.backend.domain.member.exception.MemberNotFoundException;
import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import capstone.backend.domain.mindmap.dto.request.MindMapRequest;
import capstone.backend.domain.mindmap.dto.request.UpdateMindMapRequest;
import capstone.backend.domain.mindmap.dto.request.UpdateMindMapTitleRequest;
import capstone.backend.domain.mindmap.dto.response.MindMapResponse;
import capstone.backend.domain.mindmap.dto.response.SidebarMindMapResponse;
import capstone.backend.domain.mindmap.entity.MindMap;
import capstone.backend.domain.mindmap.entity.Node;
import capstone.backend.domain.mindmap.exception.MindMapNotFoundException;
import capstone.backend.domain.mindmap.repository.MindMapRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MindMapService {
    private final MindMapRepository mindMapRepository;
    private final MemberRepository memberRepository;
    private final EisenhowerItemRepository eisenhowerItemRepository;

    // measured 초기화
    private void sanitizeMindMapRequest(MindMapRequest request) {
        if (request.nodes() != null) {
            request.nodes().forEach(Node::sanitizeMeasured);
        }
    }

    //마인드맵 생성
    @Transactional
    public Long createMindMap(Long memberId, MindMapRequest mindMapRequest) {
        Member member = memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);

        sanitizeMindMapRequest(mindMapRequest);

        MindMap mindMap = MindMap.createMindMap(mindMapRequest, member);

        Optional.ofNullable(mindMapRequest.eisenhowerId())
            .ifPresent(eisenhowerId -> {
                EisenhowerItem eisenhowerItem = eisenhowerItemRepository.findById(eisenhowerId)
                    .orElseThrow(EisenhowerItemNotFoundException::new);
                eisenhowerItem.connectMindMap(mindMap);
                eisenhowerItemRepository.save(eisenhowerItem);
            });
        mindMapRepository.save(mindMap);

        return mindMap.getId();
    }

    //마인드맵 상세 조회
    public MindMapResponse getMindMapById(Long memberId, Long mindMapId){
        return mindMapRepository.findByIdAndMemberId(mindMapId, memberId)
            .map(mindMap -> {
                if (mindMap.getNodes() != null) {
                    mindMap.getNodes().forEach(Node::sanitizeMeasured);
                }
                return MindMapResponse.fromEntity(mindMap);
            })
            .orElseThrow(MindMapNotFoundException::new);
    }

    //마인드맵 삭제
    @Transactional
    public void deleteMindMap(Long memberId, Long mindMapId) {
        MindMap mindMap = mindMapRepository.findByIdAndMemberId(mindMapId, memberId)
            .orElseThrow(MindMapNotFoundException::new);

        mindMapRepository.delete(mindMap);
    }

    //마인드맵 노드 수정, 하위노드, 엣지 삭제
    @Transactional
    public void updateMindMap(Long memberId, Long mindMapId, UpdateMindMapRequest mindMapRequest) {
        MindMap mindMap = mindMapRepository.findByIdAndMemberId(mindMapId, memberId)
            .orElseThrow(MindMapNotFoundException::new);

        mindMap.update(mindMapRequest);
    }

    //마인드맵 제목 수정
    @Transactional
    public void updateMindMapTitle(Long memberId, Long mindMapId, UpdateMindMapTitleRequest request){
        MindMap mindMap = mindMapRepository.findByIdAndMemberId(mindMapId, memberId)
            .orElseThrow(MindMapNotFoundException::new);

        mindMap.updateTitle(request.title());
    }


    //마인드맵 리스트 조회
    public List<SidebarMindMapResponse> getMindMapList(Long memberId){
        List<Object[]> results = mindMapRepository.findMindMapWithEisenhowerByMemberId(memberId);
        return results.stream()
            .map(row -> {
                MindMap mindMap = (MindMap) row[0];
                EisenhowerItem eisenhowerItem = (EisenhowerItem) row[1]; // null 가능
                return SidebarMindMapResponse.from(mindMap, eisenhowerItem);
            })
            .toList();
    }
}
