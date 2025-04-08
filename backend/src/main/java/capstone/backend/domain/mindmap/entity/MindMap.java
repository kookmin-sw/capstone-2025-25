package capstone.backend.domain.mindmap.entity;

import capstone.backend.domain.common.entity.TaskType;
import capstone.backend.domain.mindmap.dto.request.MindMapRequest;
import jakarta.persistence.*;
import java.util.ArrayList;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Table(name = "mindmap")
public class MindMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name="mindmap_id")
    private Long id;

    @Column(nullable = false, name="member_id")
    private Long memberId;

    @Column(name="eisenhower_id")
    private Long eisenhowerId;

    @Column(nullable = false, name="title")
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name="type")
    private TaskType type; // TODO / THINKING

    @Column(nullable = false, name="last_modified_at")
    private LocalDateTime lastModifiedAt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "text", nullable = false, name = "nodes")
    private List<Node> nodes;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "text", name = "edges")
    private List<Edge> edges;

    public static MindMap createMindMap(MindMapRequest mindMapRequest) {
        return MindMap.builder()
            .memberId(mindMapRequest.memberId())
            .eisenhowerId(mindMapRequest.eisenhowerId())
            .title(mindMapRequest.title())
            .type(mindMapRequest.type())
            .lastModifiedAt(LocalDateTime.now())
            .nodes(mindMapRequest.nodes())
            .build();
    }

    public void update(MindMapRequest mindMapRequest) {
        this.eisenhowerId = mindMapRequest.eisenhowerId();
        this.title = mindMapRequest.title();
        this.type = mindMapRequest.type();
        this.lastModifiedAt = LocalDateTime.now();
        this.nodes = mindMapRequest.nodes() != null ? new ArrayList<>(mindMapRequest.nodes()) : null;
        this.edges = mindMapRequest.edges() != null ? new ArrayList<>(mindMapRequest.edges()) : null;
    }

    public void updateTitle(String newTitle){
        this.title = newTitle;
    }
}
