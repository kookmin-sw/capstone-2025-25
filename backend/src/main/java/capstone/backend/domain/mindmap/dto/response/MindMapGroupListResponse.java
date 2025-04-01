package capstone.backend.domain.mindmap.dto.response;

import java.util.List;

public record MindMapGroupListResponse(
    List<MindMapListResponse> connectedItems,
    List<MindMapListResponse> unconnectedItems
){}
