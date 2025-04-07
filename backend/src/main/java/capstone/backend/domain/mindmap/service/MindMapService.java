package capstone.backend.domain.mindmap.service;

import capstone.backend.domain.member.repository.MemberRepository;
import capstone.backend.domain.member.scheme.Member;
import capstone.backend.domain.mindmap.dto.request.MindMapRequest;
import capstone.backend.domain.mindmap.dto.request.UpdateMindMapTitleRequest;
import capstone.backend.domain.mindmap.dto.response.MindMapGroupListResponse;
import capstone.backend.domain.mindmap.dto.response.MindMapListResponse;
import capstone.backend.domain.mindmap.dto.response.MindMapResponse;
import capstone.backend.domain.mindmap.entity.MindMap;
import capstone.backend.domain.mindmap.exception.MindMapNotFoundException;
import capstone.backend.domain.mindmap.repository.MindMapRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MindMapService {
    private final MindMapRepository mindMapRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public Long createMindMap(Long memberId, MindMapRequest mindMapRequest) {
        Member member = memberRepository.findById(memberId).orElseThrow(IllegalArgumentException::new); //에러핸들링 변경하기
        MindMap mindMap = MindMap.createMindMap(mindMapRequest, member);
        mindMapRepository.save(mindMap);

        return mindMap.getId();
    }

    public MindMapResponse getMindMapById(Long memberId, Long mindMapId){
        return mindMapRepository.findByIdAndMemberId(mindMapId, memberId)
            .map(MindMapResponse::fromEntity)
            .orElseThrow(MindMapNotFoundException::new);
    }

    @Transactional
    public void deleteMindMap(Long memberId, Long mindMapId) {
        Member member = memberRepository.findById(memberId).orElseThrow(IllegalArgumentException::new); //에러핸들링 변경하기

        if (!mindMapRepository.existsByIdAndMemberId(mindMapId, member.getId())) {
            throw new MindMapNotFoundException();
        }

        mindMapRepository.deleteById(memberId);
    }

    @Transactional
    public void updateMindMap(Long id, MindMapRequest mindMapRequest) {
        MindMap mindMap = mindMapRepository.findById(id)
            .orElseThrow(MindMapNotFoundException::new);

        mindMap.update(mindMapRequest);
    }

    @Transactional
    public void updateMindMapTitle(Long id, UpdateMindMapTitleRequest request){
        MindMap mindMap = mindMapRepository.findById(id)
            .orElseThrow(MindMapNotFoundException::new);
        mindMap.updateTitle(request.title());
    }

//    public MindMapGroupListResponse getMindMapList(){
//        List<MindMap> connected = mindMapRepository.findByEisenhowerIdIsNotNullOrderByLastModifiedAtDesc();
//        List<MindMap> unconnected = mindMapRepository.findByEisenhowerIdIsNullOrderByLastModifiedAtDesc();
//
//        List<MindMapListResponse> connectedList = connected.stream()
//            .map(MindMapListResponse::fromEntity)
//            .toList();
//
//        List<MindMapListResponse> unconnectedList = unconnected.stream()
//            .map(MindMapListResponse::fromEntity)
//            .toList();
//
//        return new MindMapGroupListResponse(connectedList, unconnectedList);
//    }
}
