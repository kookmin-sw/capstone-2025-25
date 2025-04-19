package capstone.backend.domain.mindmap.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Node {
    private String id;
    private NodeType type;
    private NodeData data;
    private Position position;
    private Measured measured;

    public void sanitizeMeasured() {
        if (this.measured == null) {
            this.measured = new Measured();
        }
    }
}