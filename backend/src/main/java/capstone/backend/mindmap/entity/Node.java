package capstone.backend.mindmap.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Node {
    private String id;
    private String parentId;
    private NodeType type;
    private NodeData data;
    private Position position;
}