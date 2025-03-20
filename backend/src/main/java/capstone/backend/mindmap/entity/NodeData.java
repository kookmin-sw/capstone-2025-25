package capstone.backend.mindmap.entity;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NodeData {
    private String question;
    private String answer;
    private String summary;
    private int depth;
    private List<String> recommendedQuestions;
}
