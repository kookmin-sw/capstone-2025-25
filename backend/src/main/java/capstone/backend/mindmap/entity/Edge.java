package capstone.backend.mindmap.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Edge {
    private String id;
    private String source;
    private String target;
}
