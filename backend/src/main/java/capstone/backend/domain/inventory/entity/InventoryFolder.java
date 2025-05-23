package capstone.backend.domain.inventory.entity;


import static lombok.AccessLevel.*;

import capstone.backend.domain.inventory.dto.request.InventoryFolderRequest;
import capstone.backend.domain.member.entity.Member;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PRIVATE)
@EntityListeners(AuditingEntityListener.class)
@Builder
public class InventoryFolder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_folder_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Member member;

    @Column(nullable = false, length = 10)
    private String name;

    @Column(nullable = false)
    private boolean isDefault;

    @CreatedDate
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "folder", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<InventoryItem> items = new ArrayList<>();

    public static InventoryFolder from(Member member, InventoryFolderRequest inventoryFolderRequest, boolean isDefault) {
        return InventoryFolder.builder()
            .member(member)
            .name(inventoryFolderRequest.name())
            .isDefault(isDefault)
            .build();
    }

    public void updateName(String name){
        this.name = name;
    }
}