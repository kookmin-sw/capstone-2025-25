package capstone.backend.domain.inventory.entity;


import static lombok.AccessLevel.*;

import capstone.backend.domain.inventory.request.InventoryFolderRequest;
import capstone.backend.domain.member.scheme.Member;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PRIVATE)
@Builder
public class InventoryFolder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_folder_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false, length = 10)
    private String name;

    @Column(nullable = false)
    private boolean isDefault;

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