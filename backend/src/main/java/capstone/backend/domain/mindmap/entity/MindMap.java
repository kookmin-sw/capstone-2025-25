package capstone.backend.domain.mindmap.entity;

import capstone.backend.domain.member.scheme.Member;
import capstone.backend.domain.common.entity.TaskType;
import capstone.backend.domain.mindmap.dto.request.MindMapRequest;
import jakarta.persistence.*;
import java.util.ArrayList;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import net.minidev.json.annotate.JsonIgnore;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Table(name = "mindmap")
public class MindMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name="mindmap_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @JsonIgnore
    private Member member;

    @Column(nullable = false, name="title")
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name="type")
    private TaskType type; // TODO / THINKING

    @LastModifiedDate
    @Column(nullable = false, name="last_modified_at")
    private LocalDateTime lastModifiedAt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "text", nullable = false, name = "nodes")
    private List<Node> nodes;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "text", name = "edges")
    private List<Edge> edges;

    @Builder
    public static MindMap createMindMap(MindMapRequest mindMapRequest, Member member) {
        return MindMap.builder()
            .member(member)
            .title(mindMapRequest.title())
            .type(mindMapRequest.type())
            .nodes(mindMapRequest.nodes())
            .build();
    }

    public void update(MindMapRequest mindMapRequest) {
        this.title = mindMapRequest.title();
        this.type = mindMapRequest.type();
        this.nodes = mindMapRequest.nodes() != null ? new ArrayList<>(mindMapRequest.nodes()) : null;
        this.edges = mindMapRequest.edges() != null ? new ArrayList<>(mindMapRequest.edges()) : null;
    }

    public void updateTitle(String newTitle){
        this.title = newTitle;
    }
}
