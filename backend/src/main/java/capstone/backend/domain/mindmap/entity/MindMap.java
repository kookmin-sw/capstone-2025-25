package capstone.backend.domain.mindmap.entity;

import capstone.backend.domain.mindmap.dto.request.MindMapRequest;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
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
    private Long mindmapId;

    @Column(nullable = false, name = "order_index")
    private int orderIndex;

    @Column(nullable = false, name="member_id")
    private Long memberId;

    @Column(nullable = false, name="todo_date")
    private LocalDate toDoDate;

    @Column(nullable = false, name="title")
    private String title;

    @Column(nullable = false, name="last_modified_at")
    private LocalDateTime lastModifiedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MindMapType type; // TODO / THINKING

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "text", nullable = false, name = "nodes") //string으로 바꾸기
    private List<Node> nodes;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "text", name = "edges")
    private List<Edge> edges;

    public static MindMap createMindMap(MindMapRequest mindMapRequest) {
        return MindMap.builder()
            .orderIndex(mindMapRequest.orderIndex())
            .memberId(mindMapRequest.memberId())
            .toDoDate(mindMapRequest.toDoDate())
            .title(mindMapRequest.title())
            .lastModifiedAt(LocalDateTime.now())
            .type(mindMapRequest.type())
            .nodes(mindMapRequest.nodes())
            .build();
    }
}