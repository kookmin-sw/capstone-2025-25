package capstone.backend.mindmap.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Getter
@Setter
@Table(name = "mindmap")
public class MindMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name="mindmapId")
    private Long mindmapId;

    @Column(nullable = false, name = "orderIndex")
    private int orderIndex;

    @Column(nullable = false, name="memberId")
    private Long memberId;

    @Column(nullable = false, name="todoDate")
    private LocalDate toDoDate;

    @Column(nullable = false, name="title")
    private String title;

    @Column(nullable = false, name="lastModifiedAt")
    private LocalDateTime lastModifiedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MindMapType type; // TODO / THINKING

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false, name = "nodes") //string으로 바꾸기
    private List<Node> nodes;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", name = "edges")
    private List<Edge> edges;
}