package capstone.backend.domain.inventory.entity;

import capstone.backend.domain.inventory.dto.request.InventoryItemCreateRequest;
import capstone.backend.domain.member.scheme.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@EntityListeners(AuditingEntityListener.class)
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id", nullable = false)
    private InventoryFolder folder;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @CreatedDate
    private LocalDateTime createdAt;

    public static InventoryItem from(InventoryItemCreateRequest request, InventoryFolder folder, Member member) {
        return InventoryItem.builder()
            .member(member)
            .folder(folder)
            .title(request.title())
            .memo(request.memo())
            .build();
    }

    public void update(String title, String memo){
        this.title = title;
        this.memo = memo;
    }

    public void updateFolder(InventoryFolder folder){
        this.folder = folder;
    }
}
