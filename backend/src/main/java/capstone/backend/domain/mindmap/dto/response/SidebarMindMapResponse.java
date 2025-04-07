package capstone.backend.domain.mindmap.dto.response;

import capstone.backend.domain.mindmap.entity.MindMap;

public record SidebarMindMapResponse(
    MindMap mindMap,
    SidebarEisenhowerItemDTO eisenhowerItemDTO,
    boolean linked
){
    public static SidebarMindMapResponse from(MindMap mindMap, EisenhowerItem eisenhowerItem){
        return new SidebarMindMapResponse(
            mindMap,
            eisenhowerItem != null ? new SidebarEisenhowerItemDTO(eisenhowerItem) : null,
            eisenhowerItem != null
        );
    }
}

record SidebarEisenhowerItemDTO(
    Long id,
    String title
){
    SidebarEisenhowerItemDTO(EisenhowerItem eisenhowerItem) {
        this(
            eisenhowerItem.getId(),
            eisenhowerItem.getTitle()
        );
    }
}

