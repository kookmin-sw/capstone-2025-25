package capstone.backend.mindmap.dto.request;

import capstone.backend.mindmap.entity.MindMapType;
import capstone.backend.mindmap.entity.Node;
import java.time.LocalDate;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MindMapRequest {
    private int orderIndex;
    private MindMapType type;
    private LocalDate toDoDate;
    private String title;
    private Long memberId;
    private List<Node> nodes;
}
